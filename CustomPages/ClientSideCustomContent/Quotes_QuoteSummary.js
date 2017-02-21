$(document).ready(function () {

    var getProductDataURL = increaseCrmLib.MakeRequestString("GetCarriageCodes", "");
    increaseCrmLib.MakeSimpleAsyncAjaxRequest(getProductDataURL, function (data) {
        window.carriageCodesLookup = data.split(',');
    },
    function (e) {

    });

    removeAjaxCacheFromButtonClickMethods();

    var fromWorkflow = crm.getArg("AUTOWORKFLOWED");
    if(fromWorkflow == 'Y'){
        increaseCrmLib.ReplaceSaveButtonClickMethod("Button_Cancel", "UndoWorkflow");
    }
    
});

function UndoWorkflow(orig){

    var url = increaseCrmLib.MakeRequestString("Quotes/NewQuoteWorkflow", "Cancel=523");
     document.location.href = url;

}

function removeAjaxCacheFromButtonClickMethods(){
    $(".er_buttonItem").each(function (i, o){
        var onclick = $(this).attr("onclick");
        if(onclick && onclick.length > 0 && onclick.indexOf("cache: true") != -1){
            var newOnClick = onclick.replace("cache: true", "cache: false");
            $(this).attr("onclick", newOnClick);
        }
    });
}