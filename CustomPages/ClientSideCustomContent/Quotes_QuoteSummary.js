$(document).ready(function () {
    
    var getProductDataURL = increaseCrmLib.MakeRequestString("GetCarriageCodes", "");
    increaseCrmLib.MakeSimpleAsyncAjaxRequest(getProductDataURL, function (data) {
        window.carriageCodesLookup = data.split(',');
    },
    function (e) {

    });

    var fromWorkflow = crm.getArg("AUTOWORKFLOWED");
    if(fromWorkflow == 'Y'){
        increaseCrmLib.ReplaceSaveButtonClickMethod("Button_Cancel", "UndoWorkflow");
    }
    // setInterval(function(){
    //     refreshProfitValues();
    // }, 5000);
});

function UndoWorkflow(orig){

    var url = increaseCrmLib.MakeRequestString("Quotes/NewQuoteWorkflow", "Cancel=523");
     document.location.href = url;

}
/*
function refreshProfitValues() {
    var key86 = crm.getArg("Key86");
    if (key86 != '') {
        var _url = increaseCrmLib.MakeRequestString("GetQuoteHeaderValues", "quoteID=" + key86);
        increaseCrmLib.MakeSimpleAsyncAjaxRequest(_url, function (data) {
            if (data && data.length > 0) {
                var vals = data.split('~');
                if (vals.length == 2) {
                    setHeaderValues("_Dataquot_profitvalue", vals[0]);
                    setHeaderValues("_Dataquot_profitmargin", vals[1]);
                }
            }
        },
            function (e) {

            });
    }
    //var profitValuesURL =
}

function setHeaderValues(spanID, newValue) {
    var your_div = document.getElementById(spanID);
    var text_to_change = your_div.childNodes[0];
    text_to_change.nodeValue = newValue;
}

//*/