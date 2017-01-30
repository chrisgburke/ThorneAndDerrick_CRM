<!-- #include file ="..\crmwizard.js" -->

<%

var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );

Container=CRM.GetBlock("container");

List=CRM.GetBlock("PersonGrid");
List.prevURL=sURL;
var Id = new String(Request.Querystring("Opli_OppoLinkID"));
if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}

if (Id.toString() != 'undefined') {

   CRM.SetContext("OppoLink", Id);

   //If dedupe is turned on, change action below from 141 to 1201 to get the new individual dedupe screen

   Container.AddBlock(List);
   Container.AddButton(CRM.Button("New", "new.gif", CRM.URL(141)+"&Key-1="+iKey_CustomEntity+"&PrevCustomURL="+List.prevURL+"&E=OppoLink", 'Person', 'insert'));
   Container.AddButton(CRM.Button("Link", "perslink.gif", CRM.URL("OppoLink/OppoLinkPersonLink.asp"+"?J=OppoLink/OppoLinkPerson.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id));
   Container.DisplayButton(1)=false;
 
   if( Id != '')
   {
     CRM.AddContent(Container.Execute("Pers_OppoLinkId="+Id));
   }
}

CRM.GetCustomEntityTopFrame("OppoLink");
Response.Write(CRM.GetPage());

%>




