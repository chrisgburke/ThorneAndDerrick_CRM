$(document).ready(function () {

    var arg = crm.getArg("Act");
    var dft = crm.getArg("DFT");
    if (arg == "546") {
        doAction546();
    }
    if (arg == "361" && dft == "1") {
        doAction361FollowOn();
    }
});


function doAction361FollowOn() {

    var compSet, perSet, quotSet;
    var baseURL = increaseCrmLib.MakeRequestString("GetCommunicationQuoteData", "");

    var compID = crm.getArg("Key1");

    increaseCrmLib.MakeSimpleAsyncAjaxRequest(baseURL + "&reqType=c&recordID=" + compID, function (data) {
        $("#cmli_comm_companyidTEXT").val(data);
        $("#SearchSmallAdvcmli_comm_companyid").click();
    },
        function (e) {

        });



    var persID = crm.getArg("Key2");
    increaseCrmLib.MakeSimpleAsyncAjaxRequest(baseURL + "&reqType=p&recordID=" + persID, function (data) {
        $("#cmli_comm_personidTEXT").val(data);
        $("#SearchSmallAdvcmli_comm_personid").click();
    },
        function (e) {

        });

    var quoteID = crm.getArg("Key86");
    increaseCrmLib.MakeSimpleAsyncAjaxRequest(baseURL + "&reqType=q&recordID=" + quoteID, function (data) {
        $("#_HIDDENcomm_opportunityid").val(quoteID);
        $("#comm_opportunityid").val(quoteID);
        $("#_HIDDENSearchFieldcomm_opportunityid").val("comm_quoteid");
        $("#_HIDDENcomm_opportunityidTEXT").val(data);
        $("#comm_opportunityidTEXT").val(data);
    },
        function (e) {

        });
    // crm.sdata({
    //     entity: "quotes",
    //     id: quoteID,
    //     success: function (d) {
    //         $("#_HIDDENcomm_opportunityid").val(quoteID);
    //         $("#comm_opportunityid").val(quoteID);
    //         $("#_HIDDENSearchFieldcomm_opportunityid").val("comm_quoteid");
    //         $("#_HIDDENcomm_opportunityidTEXT").val(d.quot_reference);
    //         $("#comm_opportunityidTEXT").val(d.quot_reference);
    //     }
    // });
}

function doAction546() {
    var trToAddTo = $("#_HIDDENcomm_percentcomplete").parent();
    trToAddTo.append(makeHtml());

    var formAction = $("#StandardForm").attr("action");
    formAction += "&DFT=1";
    $("#StandardForm").attr("action", formAction);
}

function makeHtml() {

    var htmlStr = '<tr class="VIEWBOXCAPTION"><td><input type="checkbox" id="DoFollowUpTask" name="DoFollowUpTask" value="Y" onclick="javascript:if (checked) document.EntryForm.DoFollowUpAppt.checked=!checked;"></td><td><div style="cursor:hand" onclick="javascript:document.EntryForm.DoFollowUpTask.click();">Create Follow-up Task</div></td></tr>';
    return htmlStr;
}