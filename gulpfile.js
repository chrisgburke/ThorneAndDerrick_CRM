var databaseName = "CRM2017";

var gulp = require("gulp"),
  watch = require("gulp-watch"),
  sqlRun = require("child_process").exec;

gulp.task("default", function() {
  //does nowt
});

gulp.task("clientSideCustomContent", function() {
  //does nowt
});

gulp.task("watch", function() {
  watch("./CustomPages/ClientSideCustomContent/*.js", function() {
    gulp.start("clientSideCustomContent");
  }).on("change", function(file) {
    try {
      var fileParts = file.split("\\");
      var fileName = fileParts[fileParts.length - 1];
      var patt = /^[\w]+(?=.js)/;
      var fileName2 = fileName.match(patt);
      if (fileName2) {
        var arr = fileName2[0].split("_");
        var sqlStatement =
          "USE " +
          databaseName +
          ";UPDATE Custom_ScreenObjects SET Cobj_CustomContent='";
        sqlStatement +=
          "<script src=''../CustomPages/ClientSideCustomContent/" +
          fileName +
          "''></script>' ";
        sqlStatement +=
          "WHERE Cobj_EntityName = '" +
          arr[0] +
          "' AND Cobj_Name = '" +
          arr[1] +
          "'";
        var sqlRunnerCommand = 'sqlcmd -Q "' + sqlStatement + '"';
        sqlRun(sqlRunnerCommand);
      }
    } catch (e) {
      console.log(e.message);
    }
  });
});
