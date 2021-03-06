<!-- #include file ="../crmwizard.js" -->
<!-- #include file ="../crmconst.js" -->
<!-- #include file ="../increaseCrmDebug.js" -->
<!-- #include file ="../IncreaseCrmCommonServerFunctions.js" -->
<!-- #include file ="../IncreaseWorkflowHelpers.js" -->
<%
if(DebugOn())
{
	debugger;
}

try{
    Log("At top of file");
    var workFlowInstanceID = CleanQueryStringValue("Key50");
    var wkInfo = GetWFInstanceInfo(workFlowInstanceID);
    
    var referrer = new String( Request.ServerVariables("HTTP_REFERER") );
    Response.Write("Referrer is : " + referrer + "<br/>");

    if(referrer.indexOf("Cancel=523") != -1 || wkInfo.CurrentStateID == 60){

        Log("Cancelling....");

        var qCount = 0;
        var quoteCheckSql = "select COUNT(quot_orderquoteid) as NumberOfQuotes from Quotes where Quotes.Quot_opportunityid =" + wkInfo.CurrentRecordID + " and Quot_Deleted IS NULL";
        Log("Running COUNT quoery :");
        Log(quoteCheckSql);

        RunQuery(quoteCheckSql, function(qry){
            qCount = qry("NumberOfQuotes");
        });
        Log("Found " + qCount + " existing quotes for this Opportunity");
        
        if(qCount == 0){
            Log("About to set the wokflow instance back to 58 : Instance ID is " + workFlowInstanceID);
            UpdateWorkflowState(workFlowInstanceID, 58);
            UpdateOpportunity(wkInfo.CurrentRecordID, "oppo_stage", "NotQuoted");
        }
        var oppoSummaryURL = CRM.Url("260");
        oppoSummaryURL += "&Key7=" + wkInfo.CurrentRecordID;
        Response.Redirect(oppoSummaryURL);

    }else{

        var workFlowInstance = CRM.FindRecord("WorkflowInstance", "WkIn_InstanceID=" + workFlowInstanceID);
        var workflowRuleID = CleanQueryStringValue("Key27");

        UpdateWorkflowState(workFlowInstanceID, 60);
        UpdateOpportunity(wkInfo.CurrentRecordID, "oppo_stage", "Quoted");
        var rawUrl = CRM.Url("1448");
        rawUrl += "&Key27=10182&AUTOWORKFLOWED=Y";

        Response.Redirect(rawUrl);
    }
}
catch(e){
   Response.Write(e.message);
   if(e.name == "AspLoggingError"){
       e.remedy();
   }
}
%>