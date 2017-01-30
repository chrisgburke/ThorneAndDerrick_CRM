<!-- #include file ="..\crmwizard.js" -->

<%

/* Search for an existing person and link it to the current OppoLink record */


var Id = new String(Request.Querystring("Opli_OppoLinkID"));
if (Id.toString() == 'undefined') {
   Id = new String(Request.Querystring("Key58"));
}


Container=CRM.GetBlock("container");
Group = CRM.GetBlock("entrygroup");

PersonSearch = CRM.GetBlock("entry");

PersonSearch.FieldName = "SearchPerson";
PersonSearch.EntryType = 56;
PersonSearch.LookupFamily = "Person"; 

Group.AddEntry(PersonSearch);
Container.AddBlock(Group);


CRM.SetContext("OppoLink", Id);


if (CRM.Mode < Edit) CRM.Mode = Edit;

if (CRM.Mode == Edit) {

   CRM.GetCustomEntityTopFrame("OppoLink");
   Container.AddButton(CRM.Button("Cancel", "cancel.gif", CRM.URL("OppoLink/OppoLinkPerson.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id));
   CRM.AddContent(Container.Execute());
   Response.Write(CRM.GetPage());

}
else if (CRM.Mode == Save) {
   //Set the foreign key on the selected person record to link back to this OppoLink
   PersonId = Request.Form("SearchPerson");
   if (PersonId != '') {
      sql = "Update Person SET Pers_OppoLinkId=" + Id + " WHERE Pers_PersonId=" + PersonId;
      CRM.ExecSql(sql);
   }

   //redirect to the OppoLinkPerson.asp page that shows the list of people for this OppoLink
   var Url = CRM.URL("OppoLink/OppoLinkPerson.asp")+"&E=OppoLink&Opli_OppoLinkID="+Id
   Response.Redirect(Url);
   

}



%>







