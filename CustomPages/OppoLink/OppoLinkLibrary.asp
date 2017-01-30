<!-- #include file ="..\crmwizard.js" -->
<!-- #include file ="..\crmconst.js" -->

<%
var user_agent = new String(Request.ServerVariables("HTTP_USER_AGENT"));
var ie_browser = user_agent.indexOf("MSIE");
if ( ie_browser < 0 ) {
	ie_browser = user_agent.indexOf("Trident/7");
}


var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );
var PersonKey = '';
var CompanyKey = '';
var OpportinityKey = '';
var HasCommunication = '';

Container=CRM.GetBlock("container");

List=CRM.GetBlock("LibraryList");
List.prevURL=sURL;

var Id = new String(Request.Querystring("Opli_OppoLinkID"));

if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}

CRM.SetContext("OppoLink", Id);

if (Id != 0 && ( false || false || true) ) {

   record = CRM.FindRecord("OppoLink", "Opli_OppoLinkID=" + Id);

   if ( false && record.Item("Opli_CompanyId") != null)	
      CompanyKey = "&Key" + iKey_CompanyId + "=" + record.Item("Opli_CompanyId");	
   if ( false && record.Item("Opli_PersonId") != null)	
      PersonKey = "&Key" + iKey_PersonId + "=" + record.Item("Opli_PersonId");	   	
   if ( true && record.Item("Opli_OpportunityId") != null)	
      OpportinityKey = "&Key" + iKey_OpportunityId + "=" + record.Item("Opli_OpportunityId");
}

if (false)
{
   HasCommunication = "&MakeCommunicationYN=Y";
}

Container.AddBlock(List);

var caption = "FileUpload";
if (ie_browser < 0 ) {
	// The "FILEUPLOAD" string below is NOT  a CAPTION - it is a constant to indicate to the COM object that a FILEUPLOAD button is expected
	caption = "FILEUPLOAD";
}
	Container.AddButton(CRM.Button(caption, "FileUpload.gif", CRM.URL(343)+"&Key-1="+iKey_CustomEntity+PersonKey+CompanyKey+OpportinityKey+HasCommunication+"&PrevCustomURL="+List.prevURL+"&E=OppoLink"));

	/*
if (ie_browser.toString() == "-1" ) {
	// The "FILEUPLOAD" string below is NOT  a CAPTION - it is a constant to indicate to the COM object that a FILEUPLOAD button is expected
	Container.AddButton(CRM.Button("FILEUPLOAD", "FileUpload.gif", CRM.URL(343)+"&Key-1="+iKey_CustomEntity+PersonKey+CompanyKey+OpportinityKey+HasCommunication+"&PrevCustomURL="+List.prevURL+"&E=OppoLink"));
}
else
{
	Container.AddButton(CRM.Button("FileUpload", "FileUpload.gif", CRM.URL(343)+"&Key-1="+iKey_CustomEntity+PersonKey+CompanyKey+OpportinityKey+HasCommunication+"&PrevCustomURL="+List.prevURL+"&E=OppoLink"));
} */

Container.DisplayButton(1)=false;
if (false){
  Container.AddButton(CRM.Button("MergeToWord", "MailMergeDOC.gif", CRM.URL(542)));
  Container.AddButton(CRM.Button("MergeToPDF", "MailMergePDF.gif", CRM.URL(6101)));
}


if( Id != '')
{
  CRM.AddContent(Container.Execute("Libr_OppoLinkId="+Id));
}

CRM.GetCustomEntityTopFrame("OppoLink");
Response.Write(CRM.GetPage());

%>









