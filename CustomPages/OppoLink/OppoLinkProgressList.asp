<!-- #include file ="..\crmwizard.js" -->

<%

Container=CRM.GetBlock("container");
List=CRM.GetBlock("OppoLinkProgressList");
Container.AddBlock(List);
Container.DisplayButton(1)=false;

var Id = new String(Request.Querystring("Opli_OppoLinkID"));

if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}

var Idarr = Id.split(",");

CRM.SetContext("OppoLink", Idarr[0]);

CRM.AddContent(Container.Execute('Opli_OppoLinkID='+Idarr[0]));
CRM.GetCustomEntityTopFrame("OppoLink");
Response.Write(CRM.GetPage());


%>











