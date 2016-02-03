var boxW = 50;
var boxH = 50;
var maxBoxH = boxH * 2;

var baseLineW = boxW * 10;
var baseLineH = 10;

var craneW = 10;
var craneH = 40;

var magnetHookW = 30;
var magnetHookH = 15;

var terrainW = baseLineW;
var terrainH = maxBoxH * 3;

var runApp = function () {
    d3.select("#app").selectAll("*").remove();

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
    container.selectAll("[id^=box]")
        .data(boxes)
        .enter()
        .append("rect")
        .attr("id", function (box) {
            return "box-" + box.name;
        })
        .attr("x", function (box) {
            return box.x * boxW;
        })
        .attr("y", function (box) {
            return terrainH - baseLineH - (boxH * box.height) - (boxH * box.height * box.y);
        })
        .attr("width", function (box) {
            return box.width * boxW;
        })
        .attr("height", function (box) {
            return box.height * boxH;
        })
        .style("cursor", "pointer")
        .style("stroke", "lightgrey")
        .style("fill", "none")
        .style("stroke-width", 1)
        .style("fill", function (box) {
            return box.color;
        })
        .on("click", function (box) {
            console.log("Box " + box.name + " clicked.");
            dropCrane(box);
        });
};

var dropCrane = function (targetBox) {
    var boxElement = document.getElementById("box-" + targetBox.name);
    d3.selectAll("#crane")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - craneW / 2)
        .each("end", function () {
            console.log("Crane engaged");
        })
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("height", terrainH - baseLineH - (boxH * targetBox.height) - (boxH * targetBox.y) - magnetHookH)
        .each("end", function () {
            console.log("Crane dropped");
        });
    d3.selectAll("#magnet")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
        .each("end", function () {
            console.log("Magnet engaged");
        })
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("y", terrainH - baseLineH - (boxH * targetBox.height) - (boxH * targetBox.y) - magnetHookH)
        .each("end", function () {
            console.log("Magnet attached");
        });
};

var moveBox = function (allBoxes, srcBox, destBox) {
    if (!srcBox.hasBoxAbove(allBoxes) && !destBox.hasBoxAbove(allBoxes)) {
        return [{box: srcBox, x: destBox.x, y: 1 + destBox.y + destBox.height}];
    } else {
        return null;
    }
};

