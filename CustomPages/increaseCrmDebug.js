<%

/*
To enable server-side debugging of ASP:

In IIS, at the SERVER level, go into the ASP settings and drill into 'Debugging Properties'.  Set up so that pretty much everything is 'true' except for "Log Errors to NT Log"

Switch the flag in the DebugOn() function to return true and off you go.  **Remember to switch this off on Production sites.**
*/

function DebugOn()
{
	//change this to globally affect debugging
	return false;
}

function ASPLoggingOn() {
	
	//change this to globally allow ASP logging
	return false;
}

function ScreenLoggingOn() {
	
	//change this to globally allow logging to screen
	return false;
}

function Log(message) {
	if(ASPLoggingOn()){
        try {  
			var log_path = Server.MapPath("Logs") + "\\"; 
			var log_name = logFileName();
			var fso = new ActiveXObject("Scripting.FileSystemObject");
            if( !fso.FileExists(log_path + log_name)){
				var newFile = fso.CreateTextFile(  log_path + log_name );
        		newFile.Close();
        		newFile = null;
			}
			fso = null;
			fso = new ActiveXObject("Scripting.FileSystemObject");
			var s = fso.OpenTextFile(log_path + log_name, 8, true);
            s.writeline("< " + new Date().toTimeString() + " - " + message + " >");
            s.writeline("");
            s.Close();
            fso = null;
        }catch(error){
            Response.Write(error.message);
			throw {
				name:'AspLoggingError',
				message: message,
				remedy : function(){
					Response.Write(message);
				}
			}
        }        
    }		
}

//Normal screen log
function LogToScreen(message, isErr) {
	if(ScreenLoggingOn()) {
		var className = 'InfoContent';
		if(isErr) className = 'ErrorContent'
		var screenContent = "<span class='" + className + "' width='100%'>"  + new Date().toTimeString() + " - "  + message + "</span>";
		Response.Write(screenContent + "</br></br></br>");
	}
}

//Error screen log
function LogErrorToScreen(message) {
	LogToScreen(message, true);
}

//This is the path and filename of the ASP log file
function logFileName() {
    //return "D:\\CRM2017\\CRM2017\\Logs\\aspScriptLog.txt";
	return "IncreaseAspLog.txt";
}

function SleepMainThread(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

%>

