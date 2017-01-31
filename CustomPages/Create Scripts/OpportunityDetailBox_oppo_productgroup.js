//make sure that user_teamcode exists on the User entity!

Required = true;
var userObj = CRM.FindRecord("User", "user_userid=" + CurrentUser.user_userid);
var lookupFamily = "oppo_productgroup_" + userObj.user_teamcode;
LookupFamily = lookupFamily;