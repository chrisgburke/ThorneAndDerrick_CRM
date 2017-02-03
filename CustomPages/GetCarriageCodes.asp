<!-- #include file ="crmwizard.js" -->
<!-- #include file ="crmconst.js" -->
<!-- #include file ="increaseCrmDebug.js" -->
<!-- #include file ="IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}
var strArr = "";
var counter = 0;
var qry = "select prfa_name from ProductFamily where prfa_iscarriage = 'Y'";
RunQuery(qry, function(qObj){
    if(counter > 0){
        strArr += ",";
    }
    strArr += qObj("prfa_name");
    counter++;
});

Response.Write(strArr);
%>