if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

require(["box_pile", "move_command", "state", "./lib/d3"], function (BoxPile, MoveCommand, State, d3) {
    const timeout = 1500;

    const boxW = 80;
    const boxH = 80;
    const maxBoxH = boxH * 2;

    const xLimit = 10;
    const baseLineW = boxW * xLimit;
    const baseLineH = 15;

    const craneW = 20;
    const craneH = 80;

    const magnetHookW = 50;
    const magnetHookH = 15;

    const terrainW = baseLineW;
    const terrainH = maxBoxH * 4;

    var terrain = BoxPile.createTerrain(terrainW, terrainH);
    var moveCommand = new MoveCommand();

    function runApp() {
        d3.select("#app").selectAll("*").remove();

        var container = d3.select("#app")
            .append("svg")
            .attr("style", "display: block;margin: auto")
            .attr("width", terrainW)
            .attr("height", terrainH);

        //BASELINE
        container.append("rect")
            .attr("x", 0)
            .attr("y", terrainH - baseLineH)
            .attr("width", baseLineW)
            .attr("height", baseLineH)
            .style("fill", "Sienna");

        //CRANE
        container.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", baseLineW)
            .attr("height", baseLineH)
            .style("fill", "DarkSlateGray");
        container.append("rect")
            .attr("id", "crane")
            .attr("x", (terrainW / 2) - craneW / 2)
            .attr("y", baseLineH)
            .attr("width", craneW)
            .attr("height", craneH)
            .style("fill", "DarkSlateGray");
        container.append("rect")
            .attr("id", "magnet")
            .attr("x", (terrainW / 2) - magnetHookW / 2)
            .attr("y", baseLineH + craneH)
            .attr("width", magnetHookW)
            .attr("height", magnetHookH)
            .style("fill", "DarkSlateGray");

        //BOXES
        container.selectAll("[id^=box]")
            .data(terrain.getBoxes())
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
            .duration(timeout)
            .ease("linear")
            .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - craneW / 2)
            .each("end", function () {
                console.log("Crane engaged");
            })
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("height", terrainH - baseLineH - (boxH * targetBox.height) - (boxH * targetBox.y) - magnetHookH)
            .each("end", function () {
                console.log("Crane dropped");
            });
        d3.select("#magnet")
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
            .each("end", function () {
                console.log("Magnet engaged");
            })
            .transition()
            .duration(timeout)
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
            .duration(timeout)
            .ease("linear")
            .attr("height", craneH)
            .each("end", function () {
                console.log("Crane lifted");
            });
        d3.select("#magnet")
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("y", baseLineH + craneH)
            .each("end", function () {
                console.log("Magnet lifted");
            });
        d3.select("#box-" + targetBox.name)
            .transition()
            .duration(timeout)
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
            .duration(timeout)
            .ease("linear")
            .attr("x", (steps[0].getDstX() * boxW) + ((boxW * targetBox.width) / 2) - (craneW / 2))
            .each("end", function () {
                console.log("Crane engaged");
            })
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("height", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
            .each("end", function () {
                console.log("Crane dropped");
            });

        d3.select("#magnet")
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("x", (boxW * steps[0].getDstX()) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
            .each("end", function () {
                console.log("Magnet engaged");
            })
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
            .each("end", function () {
                console.log("Magnet dropped");
            });

        d3.select("#box-" + targetBox.name)
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("x", boxW * steps[0].getDstX())
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height))
            .each("end", function () {
                console.log("Box dropped");
                steps.shift();
                resetCrane(function () {
                    if (steps.length > 0) {
                        attachCrane(steps, dstX, dstY, callback);
                    } else {
                        callback();
                    }
                });
            });
    }

    function resetCrane(callback) {
        d3.select("#crane")
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("height", craneH);
        d3.select("#magnet")
            .transition()
            .duration(timeout)
            .ease("linear")
            .attr("y", baseLineH + craneH)
            .each("end", function () {
                if (callback) {
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

    var moveButton = document.getElementById("moveBtn");
    moveButton.onclick = function () {
        moveBoxClicked();
    };

    runApp();
});