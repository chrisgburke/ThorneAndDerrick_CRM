$(document).ready(function(){

    var _href = window.location.href;
    if(_href.indexOf("&Frame=email") != -1 && _href.indexOf("Act=1469") == -1){
        var _hrefNu = _href.replace("&Frame=email", "");
        window.location.href = _hrefNu;
    }
    
})