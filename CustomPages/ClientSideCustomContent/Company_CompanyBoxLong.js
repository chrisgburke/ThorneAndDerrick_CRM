$(document).ready(function () {
    $("#StandardForm table:eq(0) > tbody:eq(0) > tr:eq(8)").hide();
    increaseCrmLib.ReplaceSaveButtonClickMethod("Button_Save", "ValidateAndSave");
});

function ValidateAndSave(orig) {
    if (ValidateMandatoryFields()) {
        crm.errorMessage("");
        var fnStr = orig.substring(11);
        var savefn = new Function(fnStr);
        savefn();
    } else {
        crm.errorMessage("Validation Errors - Please correct the highlighted entries");
    }

}

function ValidateMandatoryFields() {

    var fieldsList_Comp = {
        columnPrefix: "comp",
        fields: [
            { fieldName: "name", validate: "" },
            { fieldName: "indcode", validate: "" },
            { fieldName: "type", validate: "" },
            { fieldName: "country", validate: "" }
        ]
    }
    var compValidation = increaseFieldValidationHelper.validate(fieldsList_Comp);//, standardValidateOK, standardValidateError); 
    
    var fieldsList_Pers = {
        columnPrefix: "pers",
        fields: [
            { fieldName: "firstname", validate:"" },
            { fieldName: "lastname", validate:"" }
        ]
    }
    var persValidation = increaseFieldValidationHelper.validate(fieldsList_Pers);//, standardValidateOK, standardValidateError);
    
    var fieldsList_PersEmai = {
        columnPrefix: "persEmai",
        fields: [
            { fieldName: "EmailAddressBusiness", validate:"" }            
        ]
    }
    var persEmaiValidation = increaseFieldValidationHelper.validate(fieldsList_PersEmai, emailValidateOK, emailValidateError);
    if(persEmaiValidation){
       persEmaiValidation = ValidateEmailValid("persEmai_EmailAddressBusiness");
       if(persEmaiValidation){
           emailValidateOK("");
       }else{
           emailValidateError("");
       }
    }
    return compValidation && persValidation && persEmaiValidation;

}

function emailValidateOK(fieldName){
   $("#persEmai_EmailAddressBusiness").parent().parent().children("td:first").css("color", "");
}

function emailValidateError(fieldName){
    $("#persEmai_EmailAddressBusiness").parent().parent().children("td:first").css("color", "red");
}


function ValidateEmailValid(field){
   var isValidEmail = crm.validateEmail(field);
   
   return isValidEmail;
}