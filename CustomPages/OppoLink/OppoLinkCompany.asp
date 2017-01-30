<!-- #include file ="..\crmwizard.js" -->

<%

var sURL=new String( Request.ServerVariables("URL")() + "?" + Request.QueryString );

Container=CRM.GetBlock("container");

List=CRM.GetBlock("CompanyGrid");
List.prevURL=sURL;
var Id = new String(Request.Querystring("Opli_OppoLinkID"));
if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}

if (Id.toString() != 'undefined') {

   CRM.SetContext("OppoLink", Id);

   //If dedupe is turned on, change action below from 140 to 1200 to get the new company dedupe screen

   Container.AddBlock(List);
   Container.AddButton(CRM.Button("New", "new.gif", CRM.URL(140)+"&Key-1="+iKey_CustomEntity+"&PrevCustomURL="+List.prevURL+"&E=OppoLink", 'company', 'insert'));
   Container.AddButton(CRM.Button("Link", "complink.gif", CRM.URL("OppoLink/OppoLinkCompanyLink.asp"+"?J=OppoLink/OppoLinkCompany.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id));
   Container.DisplayButton(1)=false;

   if( Id != '')
   {
     CRM.AddContent(Container.Execute("Comp_OppoLinkId="+Id));
   }
}

CRM.GetCustomEntityTopFrame("OppoLink");
Response.Write(CRM.GetPage());

%>




