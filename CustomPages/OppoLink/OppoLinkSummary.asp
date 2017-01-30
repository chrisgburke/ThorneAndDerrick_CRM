<!-- #include file ="..\crmwizard.js" -->
<!-- #include file ="..\increaseCrmDebug.js" -->
<!-- #include file ="..\IncreaseCrmCommonServerFunctions.js" -->

<%
if(DebugOn())
{
	debugger;
}

if( CRM.Mode != Save ){
  F=Request.QueryString("F");
  if( F == "OppoLinkNew.asp" ) CRM.Mode=Edit;
}

Container=CRM.GetBlock("container");
Entry=CRM.GetBlock("OppoLinkNewEntry");
Entry.Title="OppoLink";
Container.AddBlock(Entry);
Container.DisplayButton(1)=false;

var Id = new String(Request.Querystring("Opli_OppoLinkID"));

if (Id.toString() == 'undefined') {
  Id = new String(Request.Querystring("Key58"));
  if (Id.toString() == 'undefined') {
    Id = new String(Request.Querystring("Key0"));
  }
}

var oppoID = "";

var UseId = 0;

if (Id.indexOf(',') > 0) {
   var Idarr = Id.split(",");
   UseId = Idarr[0];
}
else if (Id != '') 
  UseId = Id;


if (UseId != 0) {

   var Idarr = Id.split(",");

   CRM.SetContext("OppoLink", UseId);

   record = CRM.FindRecord("OppoLink", "Opli_OppoLinkID="+UseId);
   oppoID = record.opli_opportunityid;

   //if were deleting
   if( Request.Querystring("em") == 3 )
   {
     record.DeleteRecord = true;
     record.SaveChanges();

     // need to redirect back to the place where we got to the summary from
     // -- but we cant refresh the top frame easily so just go back to find
     // -- every time
     PrevCustomURL = new String(Request.QueryString("F"));
     URLarr=PrevCustomURL.split(",");
     if(URLarr[0].toUpperCase() != "OppoLinkNew.asp")
       Response.Redirect(CRM.URL("OppoLink/OppoLinkFind.asp?J=OppoLink/OppoLinkFind.asp&E=OppoLink"));
     else
       Response.Redirect(CRM.URL("OppoLinkNew.asp?J=OppoLinkNew.asp&E=OppoLink"));
   }
   else
   {
     if( true )
     {   
       Container.ShowWorkflowButtons = true;
       Container.WorkflowTable = "OppoLink";
     }

     if(CRM.Mode == Edit)
     {
       Container.DisplayButton(Button_Continue) = true;
       Container.AddButton(CRM.Button("Delete", "delete.gif", "javascript:x=location.href;i=x.search('&em=');if (i >= 0) {   x=x.substr(0,i)+x.substr(i+2+3,x.length);}x=x+'&'+'em'+'='+'3';location.href=x", "OppoLink", "DELETE"));
       Container.AddButton(CRM.Button("Save", "save.gif", "javascript:x=location.href;if (x.charAt(x.length-1)!='&')if (x.indexOf('?')>=0) x+='&'; else x+='?';x+='Opli_OppoLinkID="+UseId+"';document.EntryForm.action=x;document.EntryForm.submit();", "OppoLink", "EDIT"));
     }
     else
     {
       //if we are in the 'doing links' mode then we will addd a 'Add another' button....
       var doLink = Request.Querystring("DO_LINK");
       if(HasValue(doLink)){
         Container.AddButton(CRM.Button("Add another..", "new.gif", CRM.URL("OppoLink/OppoLinkNew.asp?OppoID=" + oppoID + "&DO_LINK=Y")));
       }
       var continueUrl = CRM.Url("260");
       continueUrl += "&Key7=" + oppoID;
       Container.AddButton(
          CRM.Button("Continue", "continue.gif", continueUrl));
       Container.AddButton(CRM.Button("Change","edit.gif","javascript:x=location.href;if (x.charAt(x.length-1)!='&')if (x.indexOf('?')>=0) x+='&'; else x+='?';x+='Opli_OppoLinkID="+UseId+"&History=T';document.EntryForm.action=x;document.EntryForm.submit();", "OppoLink", "EDIT"));
     }

     CRM.AddContent(Container.Execute(record));
  }
  CRM.GetCustomEntityTopFrame("OppoLink");
  Response.Write(CRM.GetPage());
}

%>







