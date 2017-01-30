<!-- #include file ="..\crmwizard.js" -->

<%

CurrentCompanyID=CRM.GetContextInfo("Company", "Comp_CompanyId");

var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );

List=CRM.GetBlock("OpportunityLinkList");
List.prevURL=sURL;

container = CRM.GetBlock('container');
container.AddBlock(List);

if( !(false) )
{
  container.AddButton(CRM.Button("New", "new.gif", CRM.URL("OppoLink/OppoLinkNew.asp")+"&E=OppoLink", 'OppoLink', 'insert'));
}

container.DisplayButton(Button_Default) = false;

if( false )
{
  container.WorkflowTable = 'OppoLink';
  container.ShowNewWorkflowButtons = true;
}

if( CurrentCompanyID != null && CurrentCompanyID != '' )
{
  CRM.AddContent(container.Execute("Opli_Company="+CurrentCompanyID));
}
else
{
  CRM.AddContent(container.Execute("Opli_Company IS NULL"));
}

Response.Write(CRM.GetPage('Opportunity'));

%>





