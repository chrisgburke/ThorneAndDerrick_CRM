var increaseCrmLib = {
	MakeRequestString: function(aspPage, queryString) {
		var strQS = location.href.split(/\?/)[1]; 
		var strAddr;
   
		if (window.location.toString().toLowerCase().search('eware.dll')==-1) 
		{
			strAddr = window.location.toString().split('CustomPages')[0];
		} else {
			strAddr = window.location.toString().split('eware.dll')[0];
		}
 
		var strURL = strAddr + 'CustomPages/' + aspPage + '.asp';
		strURL += '?' + queryString;
		strURL += '&' + strQS; 
		return strURL;
	},	
	MakeAjaxUrlObject: function(target) {
		var args = Array.prototype.slice.call(arguments, 1);
		return { "Target" : target, "Params" : args };
	},
	MakeAjaxUrl: function(urlObject){
	    var strQS = location.href.split(/\?/)[1]; 
		var strAddr;   
		if (window.location.toString().toLowerCase().search('eware.dll')==-1) 
		{
			strAddr = window.location.toString().split('CustomPages')[0];
		} else {
			strAddr = window.location.toString().split('eware.dll')[0];
		}
		var baseURL = "CustomPages/";
		baseURL += urlObject.Target + "?";
		for(var prm in urlObject.Params){
			baseURL += urlObject.Params[prm].arg;
			baseURL += "=";
			baseURL += urlObject.Params[prm].val;
			baseURL += "&";
		}
		return strAddr + baseURL + strQS;
	},
	MakeSimpleAjaxRequest: function(url) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('GET', url, false);
		xmlHttp.setRequestHeader('Content-Type', 'text/xml');
		xmlHttp.send(null);
		
		var strResponse = xmlHttp.responseText;
		xmlHttp = null;
		return strResponse;
	},
	MakeSimpleAsyncAjaxRequest: function(url, successFn, errorFn) {
		$.ajax({
			url: url,
			dataType: 'text',
			success: successFn,
			error: errorFn,
			type: 'GET'
		});		
	},
	ReplaceSaveButtonClickMethod: function(btnName, saveName) {
		var _newMethod = 'CustomSave';
		if(typeof(saveName) != 'undefined') {
			_newMethod = saveName;
		}
		var existingFunction = $("#" + btnName + "").attr("href");
		$("a[id='" + btnName + "']").attr("href", 'javascript:' + _newMethod + '("' + existingFunction + '")');
	}
};