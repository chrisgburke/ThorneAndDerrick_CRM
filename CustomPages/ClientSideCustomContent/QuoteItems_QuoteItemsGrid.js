$(document).ready(function () {

    //*
    var counter = 0;
    var productNameColumnIndex = crm.grids(0).columnIndex("prod_name");
    var quitDescriptionColumnIndex = crm.grids(0).columnIndex("quit_description");
    var isCommentLine = false;

    crm.grids(0).rows(":gt(0)", true).cells().exec(function (index, key) {
        counter = index;
        if (key.cellIndex == (productNameColumnIndex)) {
            isCommentLine = false;    
            var rowIndex = $(key).parent().index() - 1;
            var quitDescriptionText = this.getCellText(rowIndex, quitDescriptionColumnIndex).trim();
            if (quitDescriptionText.length == 0) {
                quitDescriptionText = this.getCellText(rowIndex, productNameColumnIndex).trim();
                isCommentLine = true;
            }

            var cellHtml = this.getCellHtml(rowIndex, productNameColumnIndex).trim();

            if (cellHtml.length > 0 && cellHtml.substr(0, 2) == "<a") {
                var partA = cellHtml.split('>')[0];
                var partB = ">" + quitDescriptionText + "</a>";
                var newHtml = partA + partB;
                this.setCellHtml(rowIndex, productNameColumnIndex, newHtml);
            }
        }
    });

    //THEN hide the prod_name column
    crm.grids(0).hideColumn("quit_description");
    
    $("td[colname='prod_name'] a").text("Description");
    //*/  
});