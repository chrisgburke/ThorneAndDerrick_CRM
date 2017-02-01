<!-- #include file ="crmwizard.js" -->
<!-- #include file ="crmconst.js" -->
<!-- #include file ="increaseCrmDebug.js" -->
<!-- #include file ="IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}
var reponseText = "";
var basePath = CleanQueryStringValue("basePath");
if(HasValue(basePath)){
    var sqlStr = "select Parm_Value from Custom_Sysparams where parm_name = 'RelativeDocPath'";
	RunQuery(sqlStr, function(qry){
		var path = qry("parm_value");
        responseText = path;                
	});
    
}

var librID = CleanQueryStringValue("librID");
if(HasValue(librID)){
    var sqlStr = "select Libr_FilePath from Library where Libr_Libraryid = " + librID;
	RunQuery(sqlStr, function(qry){
		var path = qry("Libr_FilePath");
        responseText = path;                  
	});
}

Response.Write(responseText);
%>