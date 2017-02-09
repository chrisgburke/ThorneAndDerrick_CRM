$(document).ready(function () {
   
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
        crm.fields('quit_description').val(data);
    },
    function (e) {

    });
}

//*/