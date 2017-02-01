<%
//Utility function to coalesce a null or undefined string:
function CoalesceString(inputString) {
	if(inputString){
		return inputString;
	}
	else {
		return "-";
	}
}

//Utility function to test if something we have 
//picked off QueryString has a meaningful value
function HasValue(inputVal) {
	if(inputVal){
		var s = "" + inputVal + "";
		if(s == "null") return false;
		if(s == "undefined") return false;
		if(s.length === 0) return false;
		return true;
	}else{
		return false;
	}
}

function CleanQueryStringValue(key){
	var thing = new String(Request.Querystring(key));
    if(HasValue(thing)) {

		if (thing.indexOf(',') > 0) {
			var Idarr = thing.split(",");
			return Idarr[0];
		}else{
			return thing;
		}
	}
	return thing;
}

function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while(!qry.eof){
        processFn(qry);
        qry.NextRecord();
    }
}
%>