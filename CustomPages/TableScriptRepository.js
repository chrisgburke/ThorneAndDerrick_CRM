//<%
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

/*
function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while (!qry.eof) {
        processFn(qry);
        qry.NextRecord();
    }
}
//*/

//Utility function to coalesce a null or undefined string:
function CoalesceString(inputString) {
    if (inputString) {
        return inputString;
    }
    else {
        return "-";
    }
}

//Utility function to test if something we have 
//picked off QueryString has a meaningful value
function HasValue(inputVal) {
    if (inputVal) {
        var s = "" + inputVal + "";
        if (s == "null") return false;
        if (s == "undefined") return false;
        if (s.length === 0) return false;
        return true;
    } else {
        return false;
    }
}

//sometimes Request.Querystring("X") will return an object with more than one value in it.
//This sanitises anything we get down to a single useable value:
function CleanQueryStringValue(key) {
    var thing = String(Request.Querystring(key));
    if (HasValue(thing)) {

        if (thing.indexOf(',') > 0) {
            var Idarr = thing.split(",");
            return Idarr[0];
        } else {
            return thing;
        }
    }
    return thing;
}

//Utility method to make simple queries less of a ballache:
//Use like this:
/*
var sql = "select x, y from table where z = 1";
RunQuery(sql, function(qry){
   var x_value = qry("x");
   var y_value = qry("y");
});

//*/
function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while (!qry.eof) {
        processFn(qry);
        qry.NextRecord();
    }
}


function LogOutActionCodes() {
    writeToFile('_actionid= ' + FormValues('_actionid') + ' _HIDDEN_BEENTHERE =' + FormValues('_HIDDEN_BEENTHERE') + ' NextAction =' + FormValues('NextAction'));
}
//%>
//*************************
// Entity : QuoteItems 
// Script : CalculateLine 
//*************************

//this function makes sure the TS won't run if it's invoked from the Customisation screen:
function okToRun() {
    var actionID = FormValues('_actionid');
    return (actionID != "832" && actionID != "1460");
}

function QuoteItems_CalculateLine_InsertRecord() {
    try {
        if (okToRun()) {

            writeToFile("***** Insert Record");
            OnInsertOrUpdate(false);
        }

    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_PostInsertRecord() {
    try {
        if (okToRun()) {
            OnLineDeleteOrAfterInsert(WhereClause, false);
        }
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_UpdateRecord() {
    try {
        if (okToRun()) {
            writeToFile("***** Update Record");
            
            var profitValue = Values("quit_profitvalue");
            var profitMargin = Values("quit_profitmargin");
            var vatAmt = Values("quit_vatamount");
            var quotedPriceTotalNet = Values("quit_linetotalnet");
            var lineTotalGross = (parseFloat(quotedPriceTotalNet) + parseFloat(vatAmt)).toFixed(2);
            var discount = Values("quit_itemlinediscount");
            var salesCid = GetQuoteCurrency(Values("quit_orderquoteid"));

            forceValuesIntoDatabase(WhereClause, profitValue, profitMargin, lineTotalGross, vatAmt, discount, salesCid);

            writeToFile("The profit value after update is " + Values("quit_profitvalue"));
            OnInsertOrUpdate(true);
        }
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

    var lineType = Values("quit_linetype");
    writeToFile("The line type is '" + lineType + "'");
    if (lineType !== "c") {
        var quoteID = Values("quit_orderquoteid");
        CalculateLineValues();
        if (doHeader) {
            var hCid = CalculateQuoteHeaderProfitValues(quoteID);
            CalculateQuoteHeaderGrossAndDiscountValues(quoteID, hCid);
        }
    }
}

function forceValuesIntoDatabase(whereClause, profitValue, profitMargin, lineTotalGross, vatAmount, discount, cid) {
    var updateSql = "UPDATE QuoteItems SET quit_profitvalue=" + profitValue + ", quit_profitvalue_cid=" + cid;
    updateSql += ", quit_profitmargin=" + profitMargin;
    updateSql += ", quit_linetotalgross=" + lineTotalGross + ", quit_linetotalgross_cid=" + cid;
    updateSql += ", quit_Vatamount=" + vatAmount;
    updateSql += ", quit_itemlinediscount=" + discount;
    updateSql += " where " + whereClause;
    writeToFile(updateSql);
    CRM.ExecSql(updateSql);
}
function OnLineDeleteOrAfterInsert(whereClause, isDeleting) {
    writeToFile("***** OnLineDeleteOrAfterInsert");
    var lineType = Values("quit_linetype");
    writeToFile("The line type is '" + lineType + "'");
    if (lineType !== "c") {
        var sql = "SELECT quit_orderquoteid FROM quoteitems with (NOLOCK) where " + whereClause;
        writeToFile(sql);
        var quoteID;
        RunQuery(sql, function (qry) {
            quoteID = qry("quit_orderquoteid");
        });
        if (isDeleting) {
            var quoteItemID = whereClause.split("=")[1];
            var hCid = CalculateQuoteHeaderProfitValues(quoteID, function () {
                return " and quit_LineItemID <> " + quoteItemID;
            });
            CalculateQuoteHeaderGrossAndDiscountValues(quoteID, hCid, function () {
                return " and quit_LineItemID <> " + quoteItemID;
            });
        } else {

            var hCid = CalculateQuoteHeaderProfitValues(quoteID);
            CalculateQuoteHeaderGrossAndDiscountValues(quoteID, hCid);
        }
    }
}

function CalculateLineValues() {
    writeToFile("***** CalculateLineValues");

    var quantity = Values("quit_quantity");
    //writeToFile("Quantity = " + quantity);

    var salesprice = Values("quit_salesprice");
    var quoteCID = GetQuoteCurrency(Values("quit_orderquoteid"));
    Values("quit_salesprice_cid") = quoteCID;
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
    Values("quit_linetotalgross_cid") = quoteCID;

    //quit_quotedpricetotal gets the discounted net value to participate in the 'Quote Total' on the opportunity:
    Values("quit_quotedpricetotal") = quotedPriceTotalNet;
    Values("quit_quotedpricetotal_cid") = quoteCID;

    //writeToFile("We have calculated the line total to be : " + Values("quit_quotedpricetotal"));
}

function GetCarriageProductFamilies() {
    var strArr = "";
    var counter = 0;
    var qry = "select PrFa_ProductFamilyID from ProductFamily where prfa_iscarriage = 'Y'";
    RunQuery(qry, function (qObj) {
        if (counter > 0) {
            strArr += ",";
        }
        strArr += qObj("PrFa_ProductFamilyID");
        counter++;
    });
    return strArr;
}

function GetQuoteCurrency(orderQuoteID){
    var currency;
    var sql = "select quot_currency from Quotes where Quot_OrderQuoteID=" + orderQuoteID;
    RunQuery(sql, function(qry){
        currency = qry("quot_currency");
    }); 
    return currency;
}

function CalculateQuoteHeaderProfitValues(quoteID, whereClauseFunction) {
    writeToFile("***** CalculateQuoteHeaderProfitValues");
    var carriageFamiliesStr = GetCarriageProductFamilies();
    writeToFile("THESE ARE THE CARRIAGE FAMILIES : " + carriageFamiliesStr);
    var profitValuesTotal = 0;
    var lineTotalSum = 0;
    var cogsSum = 0;
    var profitValueCID = 0;
    var sql = "SELECT SUM(quit_cost) as TotalCost,SUM(quit_quantity) as TotalQty,SUM(quit_linetotalnet) as TotalNet,";
    sql += "SUM(quit_profitvalue) as TotalProfitValue,MAX(quit_ProfitValue_CID) as CID ";
    sql += "from QuoteItems with (NOLOCK) where quit_orderquoteid=" + quoteID + " and quit_deleted IS NULL";
    if (typeof whereClauseFunction === "function") {
        sql += whereClauseFunction();
    }
    if (carriageFamiliesStr.length > 0) {
        sql += " and (quit_productfamilyid NOT IN (" + carriageFamiliesStr + ") or quit_LineType='f')";
    }
    writeToFile(sql);
    RunQuery(sql, function (qry) {
        lineTotalSum = Number(qry("TotalNet"));
        if (isNaN(lineTotalSum)) {
            lineTotalSum = 0;
        }
        profitValuesTotal = Number(qry("TotalProfitValue"));
        if (isNaN(profitValuesTotal)) {
            profitValuesTotal = 0;
        }
        var totalCost = Number(qry("TotalCost"));
        if (isNaN(totalCost)) {
            totalCost = 0;
        }
        var totalQty = Number(qry("TotalQty"));
        if (isNaN(totalQty)) {
            totalQty = 0;
        }
        cogsSum = totalCost * totalQty;
        profitValueCID = GetQuoteCurrency(quoteID);//parseInt(coalesceZero(qry("CID"), 0));
    });
    var totalProfitMargin = 0;
    if (lineTotalSum > 0) {
        totalProfitMargin = ((profitValuesTotal / lineTotalSum) * 100).toFixed(2);
    }

    var cidOut = SetProfitValuesInQuote(quoteID, profitValuesTotal, totalProfitMargin, profitValueCID);
    writeToFile("cidOut is equal to " + cidOut);
    return cidOut;
}

function CalculateQuoteHeaderGrossAndDiscountValues(quoteID, hCid, whereClauseFunction) {
    writeToFile("** IN CalculateQuoteHeaderGrossAndDiscountValues and the cid value passed in is " + hCid);

    var grossAmount, vatAmount, discountAmount, cid;
    var sql = "select SUM(quit_linetotalgross) as Gross, SUM(quit_VATAmount) as VAT, SUM(quit_itemlinediscount) as Disc, MAX(quit_ProfitValue_CID) as CID ";
    sql += "from QuoteItems with (NOLOCK) where QuIt_orderquoteid = " + quoteID + " and quit_deleted IS NULL";
    if (typeof whereClauseFunction === "function") {
        sql += whereClauseFunction();
    }
    writeToFile(sql);
    RunQuery(sql, function (qry) {
        grossAmount = Number(qry("Gross"));
        if (isNaN(grossAmount)) {
            grossAmount = 0;
        }
        vatAmount = Number(qry("VAT"));
        if (isNaN(vatAmount)) {
            vatAmount = 0;
        }
        discountAmount = Number(qry("Disc"));
        if (isNaN(discountAmount)) {
            discountAmount = 0;
        }
        cid = parseInt(coalesceZero(qry("CID"), 0));
    });
    SetHeaderValuesInQuote(quoteID, grossAmount, vatAmount, discountAmount, hCid);
}

/*
function CalculateQuoteHeaderProfitValuesOLD(quoteID, whereClauseFunction) {
     writeToFile("***** CalculateQuoteHeaderProfitValues");
    var carriageFamiliesStr = GetCarriageProductFamilies();
    writeToFile("THESE ARE THE CARRIAGE FAMILIES : " + carriageFamiliesStr);
    var profitValuesTotal = 0;
    var lineTotalSum = 0;
    var cogsSum = 0;
    var profitValueCID = 0;
    var sql = "SELECT quit_productfamilyid, quit_cost, quit_quantity, quit_linetotalnet, quit_profitvalue, quit_profitvalue_cid from QuoteItems with (NOLOCK) where quit_orderquoteid=" + quoteID;
    sql += " and quit_deleted IS NULL";
    if (typeof whereClauseFunction === "function"){ 
        sql += whereClauseFunction();
    }
     if(carriageFamiliesStr.length > 0){
        sql += " and quit_productfamilyid NOT IN (" + carriageFamiliesStr +")";
    }
    writeToFile(sql);

    RunQuery(sql, function (qry) {

        //var productFamily = qry("quit_productfamilyid");
        if(true){
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

    SetProfitValuesInQuote(quoteID, profitValuesTotal, totalProfitMargin, profitValueCID);
}
//*/
function SetProfitValuesInQuote(quoteID, profitValuesTotal, totalProfitMargin, cid) {
    writeToFile("***** SetProfitValuesInQuote");
    writeToFile("..and cid is " + cid);

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

    writeToFile("Returning a cid of " + cid);
    return cid;
}

function SetHeaderValuesInQuote(quoteID, gross, vat, discount, cid) {
    writeToFile("***** SetHeaderValuesInQuote");
    writeToFile("...and cid is " + cid);

    var sql = "UPDATE Quotes SET ";
    sql += "quot_grosstotal=" + gross + ", quot_grosstotal_cid=" + cid + ", ";
    sql += "quot_discounttotal=" + discount + ", quot_discounttotal_cid=" + cid + ", ";
    sql += "quot_totalvat=" + vat + ", quot_totalvat_cid=" + cid + " where quot_orderquoteid=" + quoteID;
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



