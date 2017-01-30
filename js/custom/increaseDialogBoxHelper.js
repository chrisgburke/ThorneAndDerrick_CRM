/*
All of the generic functions that allow us to create JQuery UI dialog boxes in the CRM UI live in this file.
The assumption is that there exists, somewhere on the document, a DIV called 'confirm_hook'.  The 'addConfirmHook' function
is there to help do this.
*/
increaseDialogBoxHelper = {
	
	fnOpenConfirmDialog : function (messageToShow, title, okFunc, cancelFunc) {
    
		//if($("#confim_hook").length == false) alert('no hook');
		$("#confim_hook").html(messageToShow);

		// Define the Dialog and its properties.
        $("#confim_hook").dialog({
            resizable: false,
            modal: true,
            title: title,
            height: 250,
            width: 400,
            buttons: {
                "Yes": function () {
	    			$(this).dialog('close');
                    okFunc();
	    			
                },
                "No": function () {
	    			 $(this).dialog('close');  
	    			cancelFunc();
                                 
                }
            }
        });
	},
	
	fnOpenSelectDialog : function (innerHtml, title, okFunc, cancelFunc) {
		$("#select_hook").html(innerHtml);
		$("#select_hook").dialog({
            resizable: false,
            modal: true,
            title: title,
            height: 150,
            width: 400,
            buttons: {
                "OK": function () {
	    			$(this).dialog('close');
                    okFunc();
	    			
                },
                "Cancel": function () {
	    			 $(this).dialog('close');  
	    			cancelFunc();
                                 
                }
            }
        });

	},
	
	fnOpenConfirmDialogAsDeferred : function(hook, messageToShow, title, okFunc, cancelFunc){
		$(hook).html(messageToShow);
		let deferred = $.Deferred();
		// Define the Dialog and its properties.
        $(hook).dialog({
            resizable: false,
            modal: true,
            title: title,
            height: 250,
            width: 400,
            buttons: {
                "Yes": function () {
	    			$(this).dialog('close');
                    deferred.resolve(okFunc());
	    			
                },
                "No": function () {
	    			 $(this).dialog('close');  
	    			deferred.resolve(cancelFunc());
                                 
                }
            }
        });
		return deferred.promise();
	},
	
	fnOpenErrorDialog : function(messageToShow, title, h, w, extraFunction) {
		var height = 150;
		var width = 400;
		if(h)height = h;
		if(w)width = w;
		$("#confim_hook").html(messageToShow);
		$("#confim_hook").dialog({
			resizable: false,
			modal: true,
			title: title,
			height: height,
			width: width,
			buttons: {
				"OK": function () {
					$(this).dialog('close');
					if(typeof(extraFunction) == "function"){
						extraFunction();
					}              
				}
			}
		});
	},
	
	addConfirmHook : function(elementToAppendTo) {
		
		if(elementToAppendTo && elementToAppendTo.length > 0){
		
			$("#" + elementToAppendTo).append("<div id='confim_hook'></div>");
			$("#confim_hook").html("");     
		}
	},
	
	addSelectHook : function(elementToAppendTo) {
		if(elementToAppendTo && elementToAppendTo.length > 0){
		
			$("#" + elementToAppendTo).append("<div id='select_hook'></div>");
			$("#select_hook").html("");     
		}
	},
	
	addConfirmHooks : function(elementToAppendTo) {
		if(elementToAppendTo && elementToAppendTo.length > 0){
		
			$("#" + elementToAppendTo).append("<div id='confim_hook'></div>");
			$("#confim_hook").html("");  
			$("#" + elementToAppendTo).append("<div id='confim_hook2'></div>");
			$("#confim_hook2").html("");  			
		}
	}
}