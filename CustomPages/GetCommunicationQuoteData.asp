<!-- #include file ="crmwizard.js" -->
<!-- #include file ="crmconst.js" -->
<!-- #include file ="increaseCrmDebug.js" -->
<!-- #include file ="IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}
var responseText = "";
var reqType = String(CleanQueryStringValue("reqType"));
var recordID = CleanQueryStringValue("recordID");

if(HasValue(reqType) && HasValue(recordID)){

    var queryString = "";
    var fieldName  = "";
     switch(reqType){
         case "c":
            queryString = "select comp_name from Company where comp_companyid = " + recordID;
            fieldName = "comp_name";
         break;
         case "p":
            queryString = "select pers_fullname from vPersonList where Pers_PersonId =" + recordID;
            fieldName = "pers_fullname";
         break;
         case "q":
            queryString = "select quot_reference from Quotes where quot_orderquoteid = " + recordID;
            fieldName = "quot_reference";
         break;
         default:
         break;
     }

     if(queryString.length > 0){
        RunQuery(queryString, function(qObj){
            responseText = qObj(fieldName);
        });
     }  
}



Response.Write(responseText);
%>