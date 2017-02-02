$(document).ready(function(){

    PerformLineCalculations();

    $("#quit_salesprice_CID").on("change", function(){
        PerformLineCalculations();
    });

});

function OnProductFamilySelectedCommon(){
 var parentEntryForm = getParentEntryForm('quit_productfamilyid');
    if(parentEntryForm.quit_productfamilyid.value != ''){
        var fam = $("#_HIDDENquit_productfamilyidTEXT").val();
        PerformLineCalculations(fam);
    }
}

function PerformLineCalculations(fam) {
    var line = {};
    if (fam) {
        line.productFamily = fam;
    } else {
        line.productFamily = $("#_HIDDENquit_productfamilyidTEXT").val();
    }
    line.quantity = coalesceZero(crm.fields("quit_quantity").val(), 0);
    line.salesPrice = coalesceZero(crm.fields("quit_salesprice").val(), 2);
    line.costPrice = coalesceZero(crm.fields("quit_cost").val(), 2);
    line.vatRate = GetVatRate(coalesceZero(crm.fields("quit_vatrate").val(), 0));
    line.discountPercent = coalesceZero(crm.fields("quit_discountpercent").val(), 2);
    line.currencyID = $("#quit_salesprice_CID option:selected").val();//$("_HIDDENquit_salesprice_CID").val();////crm.fields("quit_salesprice_CID").val();
    line.currencySymbol = $("#quit_salesprice_CID option:selected").text();
    quoteLineValueCoordinator.clearValues();
    quoteLineValueCoordinator.setValues(line);
    quoteLineValueCoordinator.calculateValues();

    SetLineTotal();
    SetVATValues();
    SetProfitValues();

}

function SetLineTotal(){

//line total net:
    var lineTotal = quoteLineValueCoordinator.getLineTotal();   
    setTextInDataSpan("_Dataquit_linetotalnet", lineTotal, true);
    $("#_HIDDENquit_linetotalnet").val(lineTotal);
    $("#_HIDDENquit_linetotalnet_CID").val(quoteLineValueCoordinator.getCurrencyID());

//line item discount:
    var lineItemDiscount = quoteLineValueCoordinator.getLineItemDiscount();
    setTextInDataSpan("_Dataquit_itemlinediscount", lineItemDiscount, true);
    $("#_HIDDENquit_itemlinediscount").val(lineItemDiscount);
    $("#_HIDDENquit_itemlinediscount_CID").val(quoteLineValueCoordinator.getCurrencyID());

}

function SetVATValues(){

    var vatAmount = quoteLineValueCoordinator.getTaxAmount();
    setTextInDataSpan("_Dataquit_vatamount", vatAmount, true);
    $("#_HIDDENquit_vatamount").val(vatAmount);
}

function SetProfitValues(){

    var profitValue = quoteLineValueCoordinator.getProfitValue();
    setTextInDataSpan("_Dataquit_profitvalue", profitValue, true);
    $("#_HIDDENquit_profitvalue").val(profitValue);
    $("#_HIDDENquit_profitvalue_CID").val(quoteLineValueCoordinator.getCurrencyID());
    
    var profitMargin = quoteLineValueCoordinator.getProfitMargin();
    setTextInDataSpan("_Dataquit_profitmargin", profitMargin, false);
    $("#_HIDDENquit_profitmargin").val(profitMargin);

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

// function CalculateVat(line) {

//     var vatAmount = parseFloat((line.salesPrice * (line.vatRate / 100)) * line.quantity).toFixed(2);
//     $("#_Dataquit_vatamount").text(vatAmount);
//     $("#_HIDDENquit_vatamount").val(vatAmount);
// }

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

function setTextInDataSpan(spanID, newValue, convert) {
    var newTextValue = "";
    if(convert){
        newTextValue = quoteLineValueCoordinator.formatWithCurrencySymbol(newValue);
    }else{
        newTextValue = newValue;
    }
    var your_div = document.getElementById(spanID);
    var text_to_change = your_div.childNodes[0];
    text_to_change.nodeValue = newTextValue;
}