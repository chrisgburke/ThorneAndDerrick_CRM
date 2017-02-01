$(document).ready(function(){
    
    var baseFilePath = GetBaseFilePath();

    // var server = crm.installUrl().split('/')[3];
    // var loadCss = function(href) {
	// 		var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
	// 		$("head").append(cssLink);		
	// 	};
    // loadCss("/" + server + "/Themes/CustomCSS/tooltipsy.css");
    var copyColumnIndex = crm.grids(0).columnIndex("libr_copypath");
    var fileNameColumnIndex = crm.grids(0).columnIndex("libr_filename");

    var counter = 0;

    crm.grids(0).rows(":gt(0)", true).cells().exec(function(index, key){
        counter = index;
        if(key.cellIndex == (copyColumnIndex + 1)){
          var rowIndex = $(key).parent().index() - 1;
          var celltext = this.getCellText(rowIndex, fileNameColumnIndex).trim();
          
          if(celltext.length > 0){
              var cellHtml = this.getCellHtml(rowIndex, fileNameColumnIndex).trim();
              var libraryid = extractLibraryId(cellHtml);
              var directory = getDocumentDirectory(libraryid);
              crm.grids(0).setCellHtml(rowIndex, copyColumnIndex, "<a class='WEBLINK' target='EWAREVISITS' data-clipboard-text='" + PutOnClipboard(baseFilePath, directory, celltext) +"' href='javascript:CopyToClipboard()'>Copy</a>");
          }
        }
    });

    var clipboard = new Clipboard('.WEBLINK');
    clipboard.on('success', function(e){
        $(e.trigger).attr('title', 'Copied to clipboard!');
        $(e.trigger).tooltipsy({
            offset: [2, 0],
            css: {
                'padding': '10px',
                'max-width': '200px',
                'color': '#303030',
                'background-color': '#EBEDEF',
                'border': '1px solid #34B23F'
            }
        });
        
        $(e.trigger).data('tooltipsy').show();    
        $(e.trigger).on({
            mouseleave: function() {
                $(e.trigger).data('tooltipsy').destroy();     
            }
        });
        
    });
});


function PutOnClipboard(baseFilePath, libraryFolder, fileName){
    //var strArr = fileName.split('eware.dll/');
    if(libraryFolder.slice(-1) === "\\"){
        libraryFolder = libraryFolder.substr(0, libraryFolder.length - 1);
    }
    return baseFilePath + libraryFolder + "\\" + fileName;
}

function CopyToClipboard(){
//does nothing - just a placeholder....
}

function extractLibraryId(cellHtml){
    return QryStr("Libr_LibraryId", cellHtml)
}

function getDocumentDirectory(librID){
    var basePathUrl = increaseCrmLib.MakeRequestString("GetLibraryData", "librID=" + librID);
    return increaseCrmLib.MakeSimpleAjaxRequest(basePathUrl);
}

function QryStr(key, queryStr){
var m=new String(queryStr).match(new RegExp("([?&;]" + key + "=)([^&]*)", "i"));

 return (m)?m[2]:"";
}


function GetBaseFilePath(){
    //call to server...
    var basePathUrl = increaseCrmLib.MakeRequestString("GetLibraryData", "basePath=Y");
    return increaseCrmLib.MakeSimpleAjaxRequest(basePathUrl);
}