var PersonBoxLongGlobal = {};

$(document).ready(function () {

    var inPopup = false;
    //do we know if we're in a popup?
    if (crm.getArg("PopupWin", crm.url()) === "Y") {
        resizePopup();
        inPopup = true;
    }

    if ($("#persEmai_EmailAddressBusiness").length > 0) {

        PersonBoxLongGlobal.emailElement = "#persEmai_EmailAddressBusiness";
        PersonBoxLongGlobal.emailAddressField = "persEmai_EmailAddressBusiness";
        PersonBoxLongGlobal.emailFieldPrefix = "persEmai";
        PersonBoxLongGlobal.emailFieldName = "EmailAddressBusiness";
    }

    if ($("#emai_emailaddressbusiness").length > 0 && $("#emai_emailaddressbusiness").is(":visible")) {

        PersonBoxLongGlobal.emailElement = "#emai_emailaddressbusiness";
        PersonBoxLongGlobal.emailAddressField = "emai_emailaddressbusiness";
        PersonBoxLongGlobal.emailFieldPrefix = "emai";
        PersonBoxLongGlobal.emailFieldName = "emailaddressbusiness";
    }

    if (!inPopup) {
        increaseCrmLib.ReplaceSaveButtonClickMethod("Button_Save", "ValidateAndSave");
    } else {
        increaseCrmLib.ReplaceSaveButtonClickMethod("Button_Save", "ValidateAndSavePopup");
    }
    if ($(PersonBoxLongGlobal.emailElement).length > 0) {
        $(PersonBoxLongGlobal.emailElement).parent().after(increaseFieldValidationHelper.makeRequiredAsteriskFlag());
    }

    //if we have emai_emailaddressprivate then remove it...
    if ($("#emai_emailaddressprivate").length > 0) {
        $("#emai_emailaddressprivate").parent().parent().hide();
    }

});

function resizePopup() {
    var w = $(window), d = $(document), b = $('body');
    window.resizeBy(((screen.availWidth - w.width()) - 500), 0);
}

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

function ValidateAndSavePopup(orig) {
    crm.errorMessage("");
    if (ValidateEmailValid(PersonBoxLongGlobal.emailAddressField)) {
        standardValidateOK(PersonBoxLongGlobal.emailAddressField);
        crm.errorMessage("");
        var fnStr = orig.substring(11);
        var savefn = new Function(fnStr);
        savefn();
    } else {
        emailValidateError(PersonBoxLongGlobal.emailAddressField);
        crm.errorMessage("Validation Errors - Please correct the highlighted entries");
    }
}

function ValidateMandatoryFields() {

    //var server = crm.installUrl().split('/')[3];
    var compValidation = false;
    var persValidation = false;
    var persEmaiValidation = false;

    if ($("#comp_name").length > 0) {
        var fieldsList_Comp = {
            columnPrefix: "comp",
            fields: [
                { fieldName: "name", validate: "" },
                { fieldName: "indcode", validate: "" },
                { fieldName: "type", validate: "" },
                { fieldName: "country", validate: "" }
            ]
        }
        compValidation = increaseFieldValidationHelper.validate(fieldsList_Comp, standardValidateOK, standardValidateError);
    } else {
        compValidation = true;
    }
    if ($("#pers_firstname").length > 0) {
        var fieldsList_Pers = {
            columnPrefix: "pers",
            fields: [
                { fieldName: "firstname", validate: "" },
                { fieldName: "lastname", validate: "" }
            ]
        }
        persValidation = increaseFieldValidationHelper.validate(fieldsList_Pers, standardValidateOK, standardValidateError);
    } else {
        persValidation = true;
    }
    if ($(PersonBoxLongGlobal.emailElement).length > 0) {
        var fieldsList_PersEmai = {
            columnPrefix: PersonBoxLongGlobal.emailFieldPrefix,
            fields: [
                { fieldName: PersonBoxLongGlobal.emailFieldName, validate: "" }
            ]
        }
        var persEmaiValidation = increaseFieldValidationHelper.validate(fieldsList_PersEmai, standardValidateOK, emailValidateError);//emailValidateOK, emailValidateError);
        if (persEmaiValidation) {
            persEmaiValidation = ValidateEmailValid(PersonBoxLongGlobal.emailAddressField);
            if (persEmaiValidation) {
                standardValidateOK(PersonBoxLongGlobal.emailAddressField);
            } else {
                emailValidateError(PersonBoxLongGlobal.emailAddressField);
            }
        }
    } else {
        persEmaiValidation = true;
    }
    return compValidation && persValidation && persEmaiValidation;

}

function standardValidateError(fieldName) {
    var elemName = "#" + fieldName;
    if ($("#reqd" + fieldName).length == 0) {
        $(increaseFieldValidationHelper.makeErrorContent(fieldName)).insertAfter(elemName);
    }
}

function emailValidateError(fieldName) {
    //$("#persEmai_EmailAddressBusiness").parent().parent().children("td:first").css("color", "red");
    var elemName = "#" + fieldName;
    if ($("#reqd" + fieldName).length == 0) {
        $(elemName).parent().after(increaseFieldValidationHelper.makeErrorContent(fieldName));
        //$(makeErrorContent(fieldName)).insertAfter(elemName);
    }
}

function standardValidateOK(fieldName) {
    var elemName = "#reqd" + fieldName;
    $(elemName).remove();
}

function ValidateEmailValid(field) {
    var isValidEmail = crm.validateEmail(field);

    return isValidEmail;
}