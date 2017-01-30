<!-- #include file ="..\crmwizard.js" -->

<%

CurrentPersonID=CRM.GetContextInfo("Person", "Pers_PersonId");

var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );

List=CRM.GetBlock("OppportunityLinkPersonList");
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

if( CurrentPersonID != null && CurrentPersonID != '' )
{
  CRM.AddContent(container.Execute("Opli_Person="+CurrentPersonID));
}
else
{
  CRM.AddContent(container.Execute("Opli_Person IS NULL"));
}

Response.Write(CRM.GetPage('Opportunity'));

%>





