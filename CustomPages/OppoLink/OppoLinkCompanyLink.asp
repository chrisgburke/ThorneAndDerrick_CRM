<!-- #include file ="..\crmwizard.js" -->

<%

/* Search for an existing company and link it to the current OppoLink record */


var Id = new String(Request.Querystring("Opli_OppoLinkID"));

if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}



Container=CRM.GetBlock("container");
Group = CRM.GetBlock("entrygroup");

CompanySearch = CRM.GetBlock("entry");

CompanySearch.FieldName = "SearchCompany";
CompanySearch.EntryType = 56;
CompanySearch.LookupFamily = "Company"; 

Group.AddEntry(CompanySearch);
Container.AddBlock(Group);


CRM.SetContext("OppoLink", Id);


if (CRM.Mode < Edit) CRM.Mode = Edit;

if (CRM.Mode == Edit) {

   CRM.GetCustomEntityTopFrame("OppoLink");
   Container.AddButton(CRM.Button("Cancel", "cancel.gif", CRM.URL("OppoLink/OppoLinkCompany.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id));
   CRM.AddContent(Container.Execute());
   Response.Write(CRM.GetPage());

}
else if (CRM.Mode == Save) {
   //Set the foreign key on the selected company record to link back to this OppoLink
   CompanyId = Request.Form("SearchCompany");
   if (CompanyId != '') {
      sql = "Update Company SET Comp_OppoLinkId=" + Id + " WHERE Comp_CompanyId=" + CompanyId;
      CRM.ExecSql(sql);
   }

   //redirect to the OppoLinkCompany.asp page that shows the list of companies for this OppoLink
   var Url = CRM.URL("OppoLink/OppoLinkCompany.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id
   Response.Redirect(Url);
   

}



%>







