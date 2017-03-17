<%
    function GetWFInstanceInfo(instanceID) {
        var wkInfo = {};
        var sql = "select WkIn_CurrentRecordId, WkIn_CurrentStateId from WorkflowInstance where WkIn_InstanceID =" + instanceID;
        RunQuery(sql, function (qry) {
            wkInfo.CurrentRecordID = qry("wkIn_CurrentRecordId");
            wkInfo.CurrentStateID = qry("wkIn_CurrentStateId");
        });
        return wkInfo;
    }

function UpdateWorkflowState(instanceID, newStateID) {
    var success = false;
    try {
        var sql = "UPDATE WorkflowInstance SET WkIn_CurrentStateID=" + newStateID + " WHERE WkIn_InstanceID=" + instanceID;
        CRM.ExecSql(sql);
        success = true;
    } catch (e) {
        success = false;
    }
    return success;
}

function UpdateOpportunity(oppoid, fieldName, fieldValue){
    var success = false;
    try {
        var sql = "UPDATE Opportunity SET " + fieldName +"='" + fieldValue + "' WHERE oppo_opportunityID=" + oppoid;
        CRM.ExecSql(sql);
        success = true;
    } catch (e) {
        success = false;
    }
    return success;
}

function GetTransitionStartPoint(caption, wfID){
    var startPointID = 0;
    try {
        var sql = "select WkTr_TransitionID from vWorkflowTransitionsRules where WkRl_Caption ='" + caption + "' and vWorkflowTransitionsRules.WkTr_WorkflowId = " + wfID;
        RunQuery(sql, function(qry){
            startPointID = qry("WkTr_TransitionID");
        });
    } catch (error) {
        
    }
    return startPointID;
}
/*
function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while(!qry.eof){
        processFn(qry);
        qry.NextRecord();
    }
}
//*/
%>