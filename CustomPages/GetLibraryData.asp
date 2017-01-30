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
    var sysParamQry = CRM.CreateQueryObj(sqlStr);
	sysParamQry.SelectSql();
	while(!sysParamQry.eof){

        var path = sysParamQry("parm_value");
        responseText = path;                
		sysParamQry.NextRecord();
	}    
    
}

var librID = CleanQueryStringValue("librID");
if(HasValue(librID)){
    var sqlStr = "select Libr_FilePath from Library where Libr_Libraryid = " + librID;
    var librQry = CRM.CreateQueryObj(sqlStr);
	librQry.SelectSql();
	while(!librQry.eof){

        var path = librQry("Libr_FilePath");
        responseText = path;                  
		librQry.NextRecord();
	}    
}

Response.Write(responseText);
%>