//Usage:

//Pass in an object which describes the fields you want to validate.
//Example:
/*
var fieldsList = {
columnPrefix:"vede",
fields: [
{ fieldName:"name", validate:"" },
{ fieldName:"personid", validate:"_HIDDEN{v}TEXT"},
{ fieldName:"companyid", validate:"_HIDDEN{v}TEXT"}
]} 

The 'fieldName' is the actual column name that crm.fields(X) will find.  The 'validate' - if provided - is a
string in which to interpolate the actual field name in order to determine the name of the field we need
to check for values.  If this isn't provided then it'll be set the same as the field name.
*/

increaseFieldValidationHelper = (function () {

	var validatePrivate = function (fl, onOK, onError) {
		var bOk = true;
		var counter = 0;
		var f = fl.fields.map(function (fn) {
			var fullFieldName = fl.columnPrefix + "_" + fn.fieldName;
			var validationFieldName = "";
			if (fn.validate.length > 0) {
				validationFieldName = interpolate(fn.validate, { v: fullFieldName });
			} else {
				validationFieldName = fullFieldName;
			}
			return { f1: validationFieldName, f2: fullFieldName };
		});
		counter = f.reduce(function (c, o) {
			bOK = true;
			if (checkf(o.f1)) {
				if (typeof onOK === "function") {
					onOK(o.f2);
				} else {
					crm.fields(o.f2).caption().color(false);
				}
			} else {
				c++;
				bOK = false;
				if (typeof onError === "function") {
					onError(o.f2);
				} else {
					crm.fields(o.f2).caption().color("red");
				}
			}
			return c;
		}, 0);
		if (counter > 0) {
			return false;
		} else {
			return true;
		}
	};

	function interpolate(s, v) {
		return s.replace(/\{([^{}]*)}/g,
			function (a, b) {
				var r = v[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			}
		);
	};

	function checkf(f) {
		var fVal = $("#" + f).val();
		if (fVal && fVal.toString().length > 0) {
			return true;
		} else {
			return false;
		}
	};

	return {
		validate: validatePrivate
	};
})();