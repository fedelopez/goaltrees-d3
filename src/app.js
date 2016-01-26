var runApp = function () {

    var boxW = 50;
    var boxH = 50;
    var maxBoxH = boxH * 2;

    var baseLineW = boxW * boxes.length;
    var baseLineH = 10;

    var terrainW = baseLineW;
    var terrainH = maxBoxH * 2 + baseLineH;

    var container = d3.select("#app")
        .append("svg")
        .attr("width", terrainW)
        .attr("height", terrainH);

    container.append("rect")
        .attr("x", 0)
        .attr("y", terrainH - baseLineH)
        .attr("width", baseLineW)
        .attr("height", baseLineH)
        .style("fill", "lightgrey");

    container.selectAll("rect")
        .data(boxes)
        .enter()
        .append("rect")
        .attr("x", function (box) {
            return box.x * boxW;
        })
        .attr("y", function (box) {
            return terrainH - baseLineH - (boxH * box.height) - (boxH * box.height * box.y);
        })
        .attr("width", boxW)
        .attr("height", function (box) {
            return box.height * boxH;
        })
        .style("stroke", "lightgrey")
        .style("fill", "none")
        .style("stroke-width", 1)
        .style("fill", function (box) {
            return box.color;
        });
};


