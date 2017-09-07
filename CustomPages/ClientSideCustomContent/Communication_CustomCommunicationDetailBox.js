$(document).ready(function () {

    var doLogging = true;
    var _log;

    // if (typeof (log4javascript) != "undefined") {

    //     // Create the logger
    //     _log = log4javascript.getLogger();

    //     // Create a PopUpAppender with default options
    //     var popUpAppender = new log4javascript.PopUpAppender();
    //     popUpAppender.setThreshold(log4javascript.Level.DEBUG);
    //     // Change the desired configuration options
    //     popUpAppender.setFocusPopUp(true);
    //     popUpAppender.setNewestMessageAtTop(true);

    //     // Add the appender to the logger
    //     _log.addAppender(popUpAppender);

    //     // Test the logger
    //     _log.debug("LOG START");
    // }

    var arg = crm.getArg("Act");
    var dft = crm.getArg("DFT");

    writeToLog(_log, "Act = " + arg + " DFT = " + dft);

    if (arg == "546") {
        doAction546(_log);
    }
    if (arg == "361" && dft == "1") {
        doAction361FollowOn(_log);
    }
});


function doAction361FollowOn(_log) {

    writeToLog(_log, "doAction361FollowOn START");

    $("#comm_subject").focus();

    var compSet = true, perSet = false, quotSet = false;
    var baseURL = increaseCrmLib.MakeRequestString("GetCommunicationQuoteData", "");

    var compID = crm.getArg("Key1");
    $("#_HIDDENcmli_comm_companyid").val(compID);
    $("#cmli_comm_companyid").val(compID);


    var persID = crm.getArg("Key2");
    $("#_HIDDENcmli_comm_personid").val(persID);
    $("#cmli_comm_personid").val(persID);


    var quoteID = crm.getArg("Key86");
    $("#_HIDDENcomm_opportunityid").val(quoteID);
    $("#comm_opportunityid").val(quoteID);
    $("#_HIDDENSearchFieldcomm_opportunityid").val("comm_quoteid");

    $("#EntryForm  tr.GridHeader:first").hide();
    $("#EntryForm  tr.CONTENT:first").hide();

    writeToLog(_log, "doAction361FollowOn COMPLETE");
}

function doAction546(_log) {

    writeToLog(_log, "doAction546 START");

    var trToAddTo = $("#_HIDDENcomm_percentcomplete").parent();
    trToAddTo.append(makeHtml());

    var formAction = $("#StandardForm").attr("action");
    formAction += "&DFT=1";

    writeToLog(_log, "Form Action is : " + formAction);

    $("#StandardForm").attr("action", formAction);

    writeToLog(_log, $("#StandardForm").attr("action"));
    writeToLog(_log, "doAction546 COMPLETE");
}

function makeHtml() {

    var htmlStr = '<tr class="VIEWBOXCAPTION"><td><input type="checkbox" id="DoFollowUpTask" name="DoFollowUpTask" value="Y" onclick="javascript:if (checked) document.EntryForm.DoFollowUpAppt.checked=!checked;"></td><td><div style="cursor:hand" onclick="javascript:document.EntryForm.DoFollowUpTask.click();">Create Follow-up Task</div></td></tr>';
    return htmlStr;
}

function writeToLog(_log, msg) {
    if (typeof(_log) != "undefined") {
        _log.debug(msg);
    }
}

