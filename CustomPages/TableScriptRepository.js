//*
//COMMON FUNCTIONS
function LoggingOn() {
    return true;
}

//***** SET THIS SPECIFIC TO THE CRM INSTANCE *****
function logFileName() {
    return "D:\\CRM2017\\CRM2017\\Logs\\tablescriptlog.txt";
}
//***** SET THIS SPECIFIC TO THE CRM INSTANCE *****


function writeToFile(message) {

    if (LoggingOn()) {
        try {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var s = fso.OpenTextFile(logFileName(), 8, true);
            var fName = arguments.callee.caller.toString().match(/function ([^\(]+)/)[1]
            s.writeline(new Date().toTimeString() + " - " + fName + ":");
            s.writeline("----  " + message);
            s.writeline("");
            s.Close();
            fso = null;
        } catch (error) {
            ErrorStr += message;
        }

    }
}

function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while (!qry.eof) {
        processFn(qry);
        qry.NextRecord();
    }
}

//*************************
// Entity : QuoteItems 
// Script : CalculateLine 
//*************************
function QuoteItems_CalculateLine_InsertRecord() {
    try {
        writeToFile("***** Insert Record");

        OnInsertOrUpdate(false);
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_PostInsertRecord() {
    try {
        OnLineDeleteOrAfterInsert(WhereClause, false);
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_UpdateRecord() {
    try {
         writeToFile("***** Update Record");
        OnInsertOrUpdate(true);
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_DeleteRecord() {
    try {
         writeToFile("***** Delete Record");
        OnLineDeleteOrAfterInsert(WhereClause, true);
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function OnInsertOrUpdate(doHeader) {
     writeToFile("***** OnInsertOrUpdate");

    var quoteID = Values("quit_orderquoteid");
    CalculateLineValues();
    if (doHeader) {
        CalculateQuoteHeaderProfitValues(quoteID);
    }
}


function OnLineDeleteOrAfterInsert(whereClause, isDeleting) {
     writeToFile("***** OnLineDeleteOrAfterInsert");
    
    var sql = "SELECT quit_orderquoteid FROM quoteitems with (NOLOCK) where " + whereClause;
    writeToFile(sql);
    var quoteID;
    RunQuery(sql, function (qry) {
        quoteID = qry("quit_orderquoteid");
    });
    if(isDeleting){
        var quoteItemID = whereClause.split("=")[1];
        CalculateQuoteHeaderProfitValues(quoteID, function(){
            return " and quit_LineItemID <> " + quoteItemID;
        })
    }else {
        CalculateQuoteHeaderProfitValues(quoteID);
    }
}

function CalculateLineValues() {
     writeToFile("***** CalculateLineValues");

    var quantity = Values("quit_quantity");
    //writeToFile("Quantity = " + quantity);

    var salesprice = Values("quit_salesprice");
    var salespriceCID = Values("quit_salesprice_cid");
    //writeToFile("Sales Price = " + salesprice);

    var vatRate = GetVatRate(coalesceZero(Values("quit_vatrate"), 0));
    var vatAmt = Values("quit_vatamount");
    //writeToFile("Vat Rate is " + vatRate + " and Vat Amount is " + vatAmt);

    var discountPercent = Values('quit_discountpercent');
    //writeToFile("Discount % =" + discountPercent);

    var itemLineDiscount = Values("quit_itemlinediscount");
    //writeToFile("Item Line Discount = " + itemLineDiscount);

    var quotedPriceTotalNet = Values("quit_linetotalnet");
    //writeToFile(quotedPriceTotalNet);

    //line total (gross) is just the net + vat, as they are both already discounted:
    Values("quit_linetotalgross") = (parseFloat(quotedPriceTotalNet) + parseFloat(vatAmt)).toFixed(2);
    Values("quit_linetotalgross_cid") = salespriceCID;

    //quit_quotedpricetotal gets the discounted net value to participate in the 'Quote Total' on the opportunity:
    Values("quit_quotedpricetotal") = quotedPriceTotalNet;
    Values("quit_quotedpricetotal_cid") = salespriceCID;

    //writeToFile("We have calculated the line total to be : " + Values("quit_quotedpricetotal"));
}

function CalculateQuoteHeaderProfitValues(quoteID, whereClauseFunction) {
     writeToFile("***** CalculateQuoteHeaderProfitValues");
    var profitValuesTotal = 0;
    var lineTotalSum = 0;
    var cogsSum = 0;
    var profitValueCID = 0;
    var sql = "SELECT quit_productfamilyid, quit_cost, quit_quantity, quit_linetotalnet, quit_profitvalue, quit_profitvalue_cid from QuoteItems with (NOLOCK) where quit_orderquoteid=" + quoteID;
    sql += " and quit_deleted IS NULL";
    if (typeof whereClauseFunction === "function"){ 
        sql += whereClauseFunction();
    }
    writeToFile(sql);

    RunQuery(sql, function (qry) {

        var productFamily = qry("quit_productfamilyid");
        if(productFamily != "23"){
            var lineProfitValue = Number(qry("quit_profitvalue"));
            if(isNaN(lineProfitValue)){
                lineProfitValue = 0;
            }
            profitValuesTotal += lineProfitValue;

            lineTotalSum += Number(qry("quit_linetotalnet"));
            if(isNaN(lineTotalSum)){
                lineTotalSum  = 0;
            }
            
            cogsSum += (Number(qry("quit_cost")) * Number(qry("quit_quantity")));

            profitValueCID = parseInt(coalesceZero(qry("quit_profitvalue_cid"), 0));
        }
    });   

    var totalProfitMargin = 0;
    if (lineTotalSum > 0) {
        totalProfitMargin = ((profitValuesTotal / lineTotalSum) * 100).toFixed(2);
    }

    SetValuesInQuote(quoteID, profitValuesTotal, totalProfitMargin, profitValueCID);
}

function SetValuesInQuote(quoteID, profitValuesTotal, totalProfitMargin, cid) {
     writeToFile("***** SetValuesInQuote");
     var a = typeof profitValuesTotal;
     writeToFile(a + "");
    var sql = "UPDATE Quotes SET quot_profitvalue=" + profitValuesTotal + ", ";
    sql += "quot_profitvalue_cid=" + cid + ", ";
    sql += "quot_profitmargin=" + totalProfitMargin + " where quot_orderquoteid=" + quoteID;
    writeToFile("**********");
    writeToFile(sql);
    try {
        CRM.ExecSql(sql);
    } catch (e) {
        writeToFile(e.message);
    }
}

function GetVatRate(option) {
    switch (option) {
        case "1":
            return parseFloat(0).toFixed(2);
        case "20":
            return parseFloat(20).toFixed(2);
        default:
            return parseFloat(0).toFixed(2);
    }
}

function coalesceZero(input, dp) {
    if (input == null) {
        if (dp > 0) {
            return parseFloat(0).toFixed(2);
        } else {
            return parseInt(0);
        }
    } else {
        return input;
    }
}
// *** COPY THIS INTO CRM METADATA ***
/*
function InsertRecord() {
QuoteItems_CalculateLine_InsertRecord();
}

function PostInsertRecord(){
QuoteItems_CalculateLine_PostInsertRecord();
}

function UpdateRecord() {
QuoteItems_CalculateLine_UpdateRecord();
}

function DeleteRecord(){
QuoteItems_CalculateLine_DeleteRecord();
}
//*/

//*************************
// Entity : Opportunity 
// Script : CombineEnqRefandProjRef 
//*************************
function Opportunity_CombineEnqRefandProjRef_InsertRecord() {
    try {

    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function Opportunity_CombineEnqRefandProjRef_PostInsertRecord() {
    try {
        CombineRefAndDescription();
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function Opportunity_CombineEnqRefandProjRef_UpdateRecord() {
    try {
        CombineRefAndDescription();
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function Opportunity_CombineEnqRefandProjRef_DeleteRecord() {
    try {

    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function CombineRefAndDescription() {

    var oppo = eWare.FindRecord("Opportunity", WhereClause);
    var enqReference = oppo.oppo_EnqRef;
    var projRef = oppo.oppo_ProjectReference + "";
    if (projRef === "undefined") projRef = "";
    var projRefStr = "";
    if (projRef.length > 0) {
        projRefStr = " : " + projRef;
    }
    var descripStr = enqReference + projRefStr;

    //writeToFile(descripStr);

    var sql = 'UPDATE Opportunity SET oppo_Description =\'' + descripStr + '\' WHERE oppo_opportunityid=' + oppo.oppo_opportunityid;
    eWare.ExecSql(sql);
}

// *** COPY THIS INTO CRM METADATA ***
// function InsertRecord() {
//     Opportunity_CombineEnqRefandProjRef_InsertRecord();
// }

// function PostInsertRecord() {
//     Opportunity_CombineEnqRefandProjRef_PostInsertRecord();
// }

// function UpdateRecord() {
//     Opportunity_CombineEnqRefandProjRef_UpdateRecord();
// }

// function DeleteRecord() {
//     Opportunity_CombineEnqRefandProjRef_DeleteRecord();
// }



