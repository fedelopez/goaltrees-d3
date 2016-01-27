var boxW = 50;
var boxH = 50;
var maxBoxH = boxH * 2;

var baseLineW = boxW * 7;
var baseLineH = 10;

var craneW = 10;
var craneH = 40;

var magnetHookW = 30;
var magnetHookH = 15;

var terrainW = baseLineW;
var terrainH = maxBoxH * 3;

var runApp = function () {
    var container = d3.select("#app")
        .append("svg")
        .attr("width", terrainW)
        .attr("height", terrainH);

    //BASELINE
    container.append("rect")
        .attr("x", 0)
        .attr("y", terrainH - baseLineH)
        .attr("width", baseLineW)
        .attr("height", baseLineH)
        .style("fill", "lightgrey");

    //CRANE
    container.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", baseLineW)
        .attr("height", baseLineH)
        .style("fill", "black");
    container.append("rect")
        .attr("id", "crane")
        .attr("x", (terrainW / 2) - craneW / 2)
        .attr("y", baseLineH)
        .attr("width", craneW)
        .attr("height", craneH)
        .style("fill", "black");
    container.append("rect")
        .attr("id", "magnet")
        .attr("x", (terrainW / 2) - magnetHookW / 2)
        .attr("y", baseLineH + craneH)
        .attr("width", magnetHookW)
        .attr("height", magnetHookH)
        .style("fill", "black");

    //BOXES
    container.selectAll("#box")
        .data(boxes)
        .enter()
        .append("rect")
        .attr("id", "box")
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
        })
        .on("click", function (box) {
            console.log("Box " + box.name + " clicked.");
        });
};

var dropCrane = function () {
    d3.selectAll("#crane")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("height", terrainH - baseLineH - (2 * boxH) - magnetHookH);
    d3.selectAll("#magnet")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("y", terrainH - baseLineH - 2 * boxH - magnetHookH);
};


