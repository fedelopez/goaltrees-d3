if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function (require) {

    const boxW = 50;
    const boxH = 50;
    const maxBoxH = boxH * 2;

    const xLimit = 10;
    const baseLineW = boxW * xLimit;
    const baseLineH = 10;

    const craneW = 10;
    const craneH = 40;

    const magnetHookW = 30;
    const magnetHookH = 15;

    const terrainW = baseLineW;
    const terrainH = maxBoxH * 3;

    var Box = require("./box");
    var BoxPile = require("./box_pile");
    var MoveCommand = require("./move_command");
    var d3 = require("lib/d3");

    const boxes = [
        new Box("B1", "#0000FF", 1, 1, 1, 1),
        new Box("G1", "#008000", 1, 0, 1, 1),
        new Box("R1", "#FF0000", 2, 0, 2, 1),
        new Box("O1", "orange", 3, 0, 1, 1),
        new Box("B2", "#0000FF", 4, 0, 2, 2),
        new Box("G2", "#008000", 6, 0, 1, 2),
        new Box("R2", "#FF0000", 8, 0, 1, 1),
        new Box("O2", "orange", 9, 0, 2, 1)
    ];
    const terrain = new BoxPile(boxes, terrainW, terrainH);
    var moveCommand = new MoveCommand();

    function runApp() {
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
                var boxElement = document.getElementById("box-" + box.name);
                console.log("Box " + box.name + " clicked." + d3.mouse(this)[0] + "," + d3.mouse(this)[1]);

                moveCommand.setBox(box);
                var y = d3.mouse(this)[1];
                var onTop = (y < (Number(boxElement.getAttribute("y")) + Number(boxElement.getAttribute("height") / 2)));
                if (onTop) {
                    moveCommand.setWhere("on top of");
                } else {
                    moveCommand.setWhere("below");
                }
                d3.select("#command").text(moveCommand.getText());
            });
    }

    function attachCrane(steps, dstX, dstY, callback) {
        var targetBox = steps[0].getBox();
        var boxElement = document.getElementById("box-" + targetBox.name);
        d3.select("#crane")
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
        d3.select("#magnet")
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
                liftCrane(steps, dstX, dstY, callback);
            });
    }

    function liftCrane(steps, dstX, dstY, callback) {
        var targetBox = steps[0].getBox();
        console.log("About to lift " + targetBox.name);
        d3.select("#crane")
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("height", craneH)
            .each("end", function () {
                console.log("Crane lifted");
            });
        d3.select("#magnet")
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("y", baseLineH + craneH)
            .each("end", function () {
                console.log("Magnet lifted");
            });
        d3.select("#box-" + targetBox.name)
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("y", baseLineH + craneH + magnetHookH)
            .each("end", function () {
                console.log("Box lifted");
                dropPayload(steps, dstX, dstY, callback);
            });
    }

    function dropPayload(steps, dstX, dstY, callback) {
        var targetBox = steps[0].getBox();
        d3.select("#crane")
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("x", (steps[0].getDstX() * boxW) + ((boxW * targetBox.width) / 2) - (craneW / 2))
            .each("end", function () {
                console.log("Crane engaged");
            })
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("height", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
            .each("end", function () {
                console.log("Crane dropped");
            });

        d3.select("#magnet")
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("x", (boxW * steps[0].getDstX()) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
            .each("end", function () {
                console.log("Magnet engaged");
            })
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
            .each("end", function () {
                console.log("Magnet dropped");
            });

        d3.select("#box-" + targetBox.name)
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("x", boxW * steps[0].getDstX())
            .transition()
            .duration(2000)
            .ease("linear")
            .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height))
            .each("end", function () {
                console.log("Box dropped");
                steps.shift();
                if (steps.length > 0) {
                    attachCrane(steps, dstX, dstY, callback);
                } else {
                    callback();
                }
            });
    }

    function moveBoxClicked() {
        if (moveCommand.canMove()) {
            var dstX = moveCommand.getDstBox().x;
            var dstY = moveCommand.getDstBox().height * (moveCommand.getWhere().indexOf("top") ? moveCommand.getDstBox().y + 1 : moveCommand.getDstBox().y);
            var steps = BoxPile.moveBox(new State(terrain), moveCommand.getSrcBox(), dstX, dstY);
            console.log("Number of steps: " + steps.length);
            attachCrane(steps.slice(), dstX, dstY, function () {
                steps.forEach(function (step) {
                    var box = terrain.getBoxByName(step.getBox().name);
                    box.x = step.getDstX();
                    box.y = step.getDstY();
                });
            });
        }
    }

    var resetButton = document.getElementById("resetBtn");
    resetButton.onclick = function () {
        runApp();
    };
    var moveButton = document.getElementById("moveBtn");
    moveButton.onclick = function () {
        moveBoxClicked();
    };

    runApp();
});