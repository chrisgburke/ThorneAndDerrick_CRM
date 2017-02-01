$(document).ready(function(){

    PerformLineCalculations();

    $("#quit_salesprice_CID").on("change", function(){
        PerformLineCalculations();
    });

});

function PerformLineCalculations() {
    var line = {};

    line.quantity = coalesceZero(crm.fields("quit_quantity").val(), 0);
    line.salesPrice = coalesceZero(crm.fields("quit_salesprice").val(), 2);
    line.costPrice = coalesceZero(crm.fields("quit_cost").val(), 2);
    line.vatRate = GetVatRate(coalesceZero(crm.fields("quit_vatrate").val(), 0));
    line.discountPercent = coalesceZero(crm.fields("quit_discountpercent").val(), 2);
    line.currencyID = crm.fields("quit_salesprice_CID").val();
    line.currencySymbol = $("#quit_salesprice_CID option:selected").text();
    quoteLineValueCoordinator.clearValues();
    quoteLineValueCoordinator.setValues(line);
    quoteLineValueCoordinator.calculateValues();

    SetLineTotal();
    SetVATValues();
    SetProfitValues();

}

function SetLineTotal(){

    var lineTotal = quoteLineValueCoordinator.getLineTotal();
    var strLineTotal = quoteLineValueCoordinator.formatWithCurrencySymbol(lineTotal);

    $("#_Dataquit_quotedpricetotal").text(quoteLineValueCoordinator.formatWithCurrencySymbol(lineTotal));
    $("#_HIDDENquit_quotedpricetotal").val(lineTotal);
    $("#_HIDDENquit_quotedpricetotal_CID").val(quoteLineValueCoordinator.currencyID);

    var lineItemDiscount = quoteLineValueCoordinator.getLineItemDiscount();
    var strLineItemDiscount = quoteLineValueCoordinator.formatWithCurrencySymbol(lineItemDiscount);

    $("#_Dataquit_discountsum").text(strLineItemDiscount);
    $("#_HIDDENquit_discountsum").val(lineItemDiscount);
    $("#_HIDDENquit_discountsumquit_discountsum_CID").val(quoteLineValueCoordinator.currencyID);

}

function SetVATValues(){

    $("#_Dataquit_vatamount").text(quoteLineValueCoordinator.formatWithCurrencySymbol(quoteLineValueCoordinator.getTaxAmount()));
    $("#_HIDDENquit_vatamount").val(quoteLineValueCoordinator.getTaxAmount());
}

function SetProfitValues(){

    var profitValue = quoteLineValueCoordinator.getProfitValue();
    var strProfitValue = quoteLineValueCoordinator.formatWithCurrencySymbol(profitValue);
    var profitMargin = quoteLineValueCoordinator.getProfitMargin();

    $("#_Dataquit_profitvalue").text(strProfitValue);
    $("#_HIDDENquit_profitvalue").val(profitValue);
    $("#_HIDDENquit_profitvalue_CID").val(quoteLineValueCoordinator.currencyID);

    $("#_Dataquit_profitmargin").text(profitMargin);
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

function CalculateVat(line) {

    var vatAmount = parseFloat((line.salesPrice * (line.vatRate / 100)) * line.quantity).toFixed(2);
    $("#_Dataquit_vatamount").text(vatAmount);
    $("#_HIDDENquit_vatamount").val(vatAmount);
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