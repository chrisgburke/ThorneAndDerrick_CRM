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

//sometimes Request.Querystring("X") will return an object with more than one value in it.
//This sanitises anything we get down to a single useable value:
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

//Utility method to make simple queries less of a ballache:
//Use like this:
/*
var sql = "select x, y from table where z = 1";
RunQuery(sql, function(qry){
   var x_value = qry("x");
   var y_value = qry("y");
});

//*/
function RunQuery(sqlString, processFn) {
    var qry = CRM.CreateQueryObj(sqlString);
    qry.SelectSql();
    while(!qry.eof){
        processFn(qry);
        qry.NextRecord();
    }
}
%>