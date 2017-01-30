function OpliPersonChange() {
    var personID = crm.fields("opli_person").val();
    var companyID = crm.fields("opli_company").val();
    if (personID && companyID) {

        var urlObj = {};
        urlObj.Target = "FindDefaultAddressForCompanyAndPerson.asp"
        urlObj.Params = [{ 'arg': 'companyID', 'val': companyID }, { 'arg': 'personID', 'val': personID }];
        var url = increaseCrmLib.MakeAjaxUrl(urlObj);
        var returnValue = increaseCrmLib.MakeSimpleAjaxRequest(url);
        if (returnValue === "MULTIPLE") {
            //do nothing...
            return;
        } else {
            $("#opli_addressTEXT").val(returnValue);
			$("#SearchSmallAdvopli_address").trigger("click");
        }
    }
}