<!-- #include file ="..\crmwizard.js" -->

<%

CurrentOpportunityID=CRM.GetContextInfo("Opportunity", "Oppo_OpportunityId");

var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );

List=CRM.GetBlock("OpportunityOppoLinkGrid");
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

if( CurrentOpportunityID != null && CurrentOpportunityID != '' )
{
  CRM.AddContent(container.Execute("Opli_OpportunityId="+CurrentOpportunityID));
}
else
{
  CRM.AddContent(container.Execute("Opli_OpportunityId IS NULL"));
}

Response.Write(CRM.GetPage('Opportunity'));

%>





