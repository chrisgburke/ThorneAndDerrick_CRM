<!-- #include file ="..\crmwizard.js" -->
<!-- #include file ="..\crmconst.js" -->
<!-- #include file ="..\increaseCrmDebug.js" -->
<!-- #include file ="..\IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}
CRM.AddContent("<script src='OppoLinkNew.js'></script>");
var Now=new Date();


if (CRM.Mode<Edit) CRM.Mode=Edit;

record=CRM.CreateRecord("OppoLink");
if( true )
  record.SetWorkFlowInfo("OppoLink Workflow", "Logged");

EntryGroup=CRM.GetBlock("OppoLinkNewEntry");
EntryGroup.Title="OppoLink";
EntryGroup.CopyErrorsToPageErrorContent = true;
EntryGroup.ShowValidationErrors = false;

context=Request.QueryString("context");
if(!Defined(context) )
  context=Request.QueryString("Key0");

if( !false )
  //CRM.SetContext("New");

if( context == iKey_CompanyId && false )
{
  CompId = CRM.GetContextInfo('Company','Comp_CompanyId');
  if ((Defined(CompId)) && (CompId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_CompanyId");
    Entry.DefaultValue = CompId;
  }
}
else if( context == iKey_PersonId && false )
{
  PersId = CRM.GetContextInfo('Person','Pers_PersonId');
  if ((Defined(PersId)) && (PersId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_PersonId");
    Entry.DefaultValue = PersId;
  }
}
else if( context == iKey_UserId && false )
{
  UserId = CRM.GetContextInfo('User', 'User_UserId');
  if ((Defined(UserId)) && (UserId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_UserId");
    Entry.DefaultValue = UserId;
  }
}
else if( context == iKey_ChannelId && false )
{
  ChanId = CRM.GetContextInfo('Channel', 'Chan_ChannelId');
  if ((Defined(ChanId)) && (ChanId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_ChannelId");
    Entry.DefaultValue = ChanId;
  }
}
else if( context == iKey_LeadId && false )
{
  LeadId = CRM.GetContextInfo('Lead','Lead_LeadId');
  if ((Defined(LeadId)) && (LeadId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_LeadId");
    Entry.DefaultValue = LeadId;
  }
}
else if( context == iKey_OpportunityId && true )
{
  OppoId = CRM.GetContextInfo('Opportunity','Oppo_OpportunityId');
  if ((Defined(OppoId)) && (OppoId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_OpportunityId");
    Entry.DefaultValue = OppoId;
  }
}
else if( context == iKey_OrderId && false )
{
  OrderId = CRM.GetContextInfo('Orders','Orde_OrderQuoteId');
  if ((Defined(OrderId)) && (OrderId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_OrderId");
    Entry.DefaultValue = OrderId;
  }
}
else if( context == iKey_QuoteId && false )
{
  QuoteId = CRM.GetContextInfo('Quotes','Quot_OrderQuoteId');
  if ((Defined(QuoteId)) && (QuoteId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_QuoteId");
    Entry.DefaultValue = QuoteId;
  }
}
else if( context == iKey_CaseId && false )
{
  CaseId = CRM.GetContextInfo('Case','Case_CaseId');
  if ((Defined(CaseId)) && (CaseId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_CaseId");
    Entry.DefaultValue = CaseId;
  }
}
else if( context == iKey_AccountId && false )
{
  AccountId = CRM.GetContextInfo('Account','Acc_AccountId');
  if ((Defined(AccountId)) && (AccountId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_AccountId");
    Entry.DefaultValue = AccountId;
  }
}

var oppoID = CleanQueryStringValue("OppoID");
if(!HasValue(oppoID)){
  oppoID = CleanQueryStringValue("Key7");
}
if(HasValue(oppoID)){
    Entry = EntryGroup.GetEntry("Opli_OpportunityId");
    Entry.DefaultValue = oppoID;
}

names = Request.QueryString("fieldname");
if( Defined(names) )
{
  vals = Request.QueryString("fieldval");
  //get values from dedupe box
  for( i = 1; i <= names.Count; i++)
  {
    Entry = EntryGroup.GetEntry(names(i));
    if( Entry != null ){
      Entry.DefaultValue = vals(i);
	 }
  }
}

container=CRM.GetBlock("container");
container.AddBlock(EntryGroup);

if(false){
	container.AddButton(
   CRM.Button("Cancel", "cancel.gif", 
      "OppoLinkDedupe.asp?J=OppoLink/OppoLinkDedupe.asp&F=OppoLink/OppoLinkNew.asp&E=OppoLinkT=new&T=new"+Request.QueryString));
} else {
  var doLink = Request.Querystring("DO_LINK");
  var buttonCaption = "Cancel";
  if(HasValue(doLink)){
    buttonCaption = "Continue";
  }
  var continueUrl = "";
  if(HasValue(oppoID)) {
	  continueUrl = CRM.Url("260");
    continueUrl += "&Key7=" + oppoID;
  }else{
    continueUrl = CRM.Url("OppoLink/OppLinkFind.asp");
  }
  container.AddButton(
          CRM.Button(buttonCaption, "continue.gif", continueUrl));
}

if( true )
{
  container.ShowWorkflowButtons = true;
  container.WorkflowTable = 'OppoLink';
}

try
{
  CRM.AddContent(container.Execute(record));
}
catch(err)
{
  if(CRM.Mode==Save) {
    CRM.Mode = Edit;
    CRM.AddContent(container.Execute(record));
  }
}

if(CRM.Mode==Save)
  Response.Redirect("OppoLinkSummary.asp?J=OppoLink/OppoLinkSummary.asp&E=OppoLink&Opli_OppoLinkID="+record("Opli_OppoLinkID")+"&"+Request.QueryString);
else
{
  RefreshTabs=Request.QueryString("RefreshTabs");
  if( RefreshTabs = 'Y' )
    Response.Write(CRM.GetPage('New'));
  else
    Response.Write(CRM.GetPage());
}

%>




















