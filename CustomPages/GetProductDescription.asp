<!-- #include file ="crmwizard.js" -->
<!-- #include file ="crmconst.js" -->
<!-- #include file ="increaseCrmDebug.js" -->
<!-- #include file ="IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}
var prodID = CleanQueryStringValue("prodID");
var prodDescription = "";
var prodCost = 0;
var prodCostCID = 0;

if(HasValue(prodID)){
    var qry = "select prod_name, prod_Cost, prod_Cost_CID  from NewProduct WHERE Prod_ProductID =" + prodID;
    RunQuery(qry, function(qObj){
        var prodDescriptionRaw = qObj("prod_name");
        prodDescription = prodDescriptionRaw.replace(/"/g, '\\"');
        prodCost = qObj("prod_cost");
        prodCostCID = qObj("prod_Cost_CID");
    });
}

var jsonString = "{ \"name\":\"" + prodDescription + "\", \"cost\":" + prodCost + ", \"costCID\":" + prodCostCID +"}";
Response.Write(jsonString);
%>