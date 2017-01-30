<!-- #include file ="..\crmwizard.js" -->
<!-- #include file ="..\crmconst.js" -->

<%

CRM.SetContext("New");

var Now=new Date();
if (CRM.Mode<1) CRM.Mode=1;

ID=Request.QueryString("Opli_OppoLinkID");

record=CRM.CreateRecord("OppoLink");

context=Request.QueryString("Key0");
EntryGroup=CRM.GetBlock("OppoLinkNewEntry");

if( context == iKey_CompanyId && false )
{
  CompId = CRM.GetContextInfo('Company','Comp_CompanyId');
  if ((Defined(CompId)) && (CompId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_CompanyId");
    Entry.DefaultValue = CompId;
  }
}
else if( context == iKey_AccountId && false )
{
  AccId = CRM.GetContextInfo('Account','Acc_AccountId');
  if ((Defined(AccId)) && (AccId > 0))
  {
    Entry = EntryGroup.GetEntry("Opli_AccountId");
    Entry.DefaultValue = AccId;
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

container=CRM.GetBlock("container");
container.AddBlock(EntryGroup);

container.ShowWorkflowButtons = true;
container.WorkflowTable = 'OppoLink';

CRM.AddContent(container.Execute(record));

if(CRM.Mode==2)
  Response.Redirect("OppoLinkSummary.asp?J=OppoLink/OppoLinkSummary.asp&E=OppoLink&Opli_OppoLinkID="+record("Opli_OppoLinkID")+"&"+Request.QueryString);
else
  Response.Write(CRM.GetPage());

%>















