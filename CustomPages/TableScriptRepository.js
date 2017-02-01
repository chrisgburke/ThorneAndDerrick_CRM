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

//*************************
// Entity : QuoteItems 
// Script : CalculateLine 
//*************************
function QuoteItems_CalculateLine_InsertRecord() {
    try {
        OnInsert();
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_PostInsertRecord() {
    try {

    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_UpdateRecord() {
    try {
        OnInsert();
    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function QuoteItems_CalculateLine_DeleteRecord() {
    try {

    } catch (error) {
        writeToFile("ERROR: " + error.message);
    }
}

function OnInsert() {
    var salesprice = Values("quit_salesprice");
    writeToFile("Sales Price = " + salesprice);

    var vatRate = GetVatRate(coalesceZero(Values("quit_vatrate"), 0));
    var vatAmt = Values("quit_vatamount");
    writeToFile("Vat Rate is " + vatRate + " and Vat Amount is " + vatAmt);

    var discount = Values('quit_discount');
    writeToFile("Discount =" + discount);

    var quantity = Values("quit_quantity");
    var discountPercent = Values("quit_discountpercent");

    //Values("quit_quotedpricetotal") = parseFloat(salesprice * quantity, 2);
    writeToFile("Discount Sum = " + Values("quit_discountsum"));

    var vatRate = GetVatRate(coalesceZero(Values("quit_vatrate"), 0));
    var vatAmt = Values("quit_vatamount");
    writeToFile("Vat Rate is " + vatRate + " and Vat Amount is " + vatAmt);

    writeToFile("We have calculated the line total to be : " + Values("quit_quotedpricetotal"));
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
    var projRef = new String(oppo.oppo_ProjectReference);
    var projRefStr = "";
    if(projRef.length > 0){
        projRefStr = " : " + projRef;
    }
    var descripStr = enqReference + projRefStr;
    
    writeToFile(descripStr);

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



