$(document).ready(function () {    
    getNextLineNumber();
});


function OnProductFamilySelected() {
    var parentEntryForm = getParentEntryForm('quit_productfamilyid');
    if(parentEntryForm.quit_productfamilyid.value == ''){
        crm.fields("quit_description").val("");
    }
}

function OnProductSelected() {

    var parentEntryForm = getParentEntryForm('quit_productid');
    if (parentEntryForm.quit_productid.value != null) {
         GetProductDescription(parentEntryForm.quit_productid.value);
    }
}
//*
function GetProductDescription(prodID) {

    var getProductDataURL = increaseCrmLib.MakeRequestString("GetProductDescription", "prodID=" + prodID);
    increaseCrmLib.MakeSimpleAsyncAjaxRequest(getProductDataURL, function (data) {
        var dataObj =JSON.parse(data);
        crm.fields('quit_description').val(dataObj.name);
        crm.fields('quit_cost').val(dataObj.cost);
        PerformLineCalculations();
    },
    function (e) {
        alert(e.responseText);
    });
}

//*/