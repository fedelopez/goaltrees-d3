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

var State = function (boxPile) {
    this.step = null;

    var createNeighbor = function (pile, box, dstX) {
        var point = pile.firstFreeCoordinate(box, dstX);
        var pileCopy = pile.copy();
        var boxAt = pileCopy.boxAt(box.x, box.y);
        boxAt.x = point.x;
        boxAt.y = point.y;
        var state = new State(pileCopy);
        state.step = new Step(box, point.x, point.y);
        return state;
    };

    this.nextState = function (srcBox, dstX, dstY) {
        var topMostBoxSrc, topMostBoxDst;
        if (boxPile.isBoxAbove(srcBox)) {
            topMostBoxSrc = boxPile.topmostBoxAbove(srcBox);
            return createNeighbor(boxPile, topMostBoxSrc, dstX);
        }
        topMostBoxDst = boxPile.boxAt(dstX, dstY);
        if (topMostBoxDst) {
            topMostBoxDst = boxPile.topmostBoxAbove(topMostBoxDst) || topMostBoxDst;
            return createNeighbor(boxPile, topMostBoxDst, srcBox.x);
        }
        if (!topMostBoxSrc && !topMostBoxDst) {
            var state = new State(boxPile);
            state.step = new Step(srcBox, dstX, dstY);
            return state;
        }
        return null;
    };

    this.getBoxPile = function () {
        return boxPile;
    };

    this.getStep = function () {
        return this.step;
    }
};

var Step = function (box, dstX, dstY) {

    this.getBox = function () {
        return box;
    };

    this.getDstX = function () {
        return dstX;
    };

    this.getDstY = function () {
        return dstY;
    };
};

var Box = function (name, color, x, y, height, width) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
};

var BoxPile = function (allBoxes, width, height) {
    var self = this;

    this.isBoxAbove = function (box) {
        return allBoxes.some(function (candidateBox) {
            return box.y < candidateBox.y && box.x === candidateBox.x
        });
    };

    this.topmostBoxAbove = function (srcBox) {
        var topMostBox = undefined;

        allBoxes.filter(function (box) {
            return box != srcBox && box.x === srcBox.x && box.y > srcBox.y;
        }).forEach(function (box) {
            if (topMostBox === undefined || box.y > topMostBox.y) topMostBox = box;
        });
        return topMostBox;
    };

    this.firstFreeCoordinate = function (box, excludedAbscissa) {
        var abscissas = allBoxes.map(function (b) {
            return b.x;
        });
        abscissas.sort();
        for (var x = 0; x < this.getWidth(); x++) {
            if (x !== excludedAbscissa && abscissas.indexOf(x) < 0) {
                return {"x": x, "y": 0};
            }
        }
        var result = allBoxes.filter(function (currentBox) {
            return (!self.isBoxAbove(currentBox) && currentBox.x != box.x && currentBox.x != excludedAbscissa && currentBox.y < self.getHeight() - 1);
        }).sort(function (a, b) {
            return a.x - b.x;
        });
        if (result.length > 0) {
            return {"x": result[0].x, "y": result[0].y + 1};
        }
        return undefined;
    };

    this.getWidth = function () {
        return width;
    };

    this.getHeight = function () {
        return height;
    };

    this.boxAt = function (x, y) {
        var boxes = allBoxes.filter(function (box) {
            return (box.x === x && box.y === y);
        });
        if (boxes.length > 0) return boxes[0];
        else return undefined;
    };

    this.copy = function () {
        const boxes = allBoxes.map(function (box) {
            return new Box(box.name, box.color, box.x, box.y, box.height, box.width);
        });
        return new BoxPile(boxes, this.getWidth(), this.getHeight());
    };
};

var MoveCommand = function () {

    const template = "Move [box1] [on top of / below] [box2]";

    var srcBox = {box: undefined, text: "[box1]"},
        dstBox = {box: undefined, text: "[box2]"},
        where = "[on top of / below]";

    var isBox1 = true;

    this.getText = function () {
        isBox1 = !isBox1;
        return template.replace("[box1]", srcBox.text).replace("[box2]", dstBox.text).replace("[on top of / below]", where);
    };

    this.setBox = function (newBox) {
        if (isBox1) {
            srcBox = {box: newBox, text: newBox.name};
            dstBox = {box: undefined, text: "[box2]"};
        } else {
            dstBox = {box: newBox, text: newBox.name};
        }

    };

    this.setWhere = function (newWhere) {
        if (isBox1) {
            where = "[on top of / below]";
        } else {
            where = newWhere;
        }
    };

    this.canMove = function () {
        return srcBox.box !== undefined && dstBox.box !== undefined;
    };

    this.getSrcBox = function () {
        return srcBox.box;
    };

    this.getDstBox = function () {
        return dstBox.box;
    };

    this.getWhere = function () {
        return where;
    };
};

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

function attachCrane(targetBox, callback) {
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
            callback();
        });
}

function liftCrane(targetBox, callback) {
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
            callback();
        });
}

function dropPayload(targetBox, dstX, dstY) {
    d3.select("#crane")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("x", (dstX * boxW) + ((boxW * targetBox.width) / 2) - (craneW / 2))
        .each("end", function () {
            console.log("Crane engaged");
        })
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("height", terrainH - baseLineH - (boxH * dstY) - (boxH * targetBox.height) - magnetHookH)
        .each("end", function () {
            console.log("Crane dropped");
        });

    d3.select("#magnet")
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("x", (boxW * dstX) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
        .each("end", function () {
            console.log("Magnet engaged");
        })
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("y", terrainH - baseLineH - (boxH * dstY) - (boxH * targetBox.height) - magnetHookH)
        .each("end", function () {
            console.log("Magnet dropped");
        });

    d3.select("#box-" + targetBox.name)
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("x", boxW * dstX)
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("y", terrainH - baseLineH - (boxH * dstY) - (boxH * targetBox.height))
        .each("end", function () {
            console.log("Box dropped");
        });
}

function moveBox(initialState, srcBox, dstX, dstY) {
    var steps = [];
    var currentState = initialState;
    var keepGoing = true;
    while (keepGoing) {
        currentState = currentState.nextState(srcBox, dstX, dstY);
        if (!currentState) {
            throw "No solution";
        }
        var step = currentState.getStep();
        steps.push(step);
        if (step.getBox().name === srcBox.name && step.getDstX() === dstX && step.getDstY() === dstY) {
            keepGoing = false;
        }
    }
    return steps;
}

function moveBoxClicked() {
    if (moveCommand.canMove()) {
        var dstX = moveCommand.getDstBox().x;
        var dstY = moveCommand.getWhere().indexOf("top") ? moveCommand.getDstBox().y + 1 : moveCommand.getDstBox().y;
        var steps = moveBox(new State(new BoxPile(boxes, terrainW, terrainH)), moveCommand.getSrcBox(), dstX, dstY);
        console.log("steps: " + steps.length);
        attachCrane(steps[0].getBox(), function () {
            liftCrane(steps[0].getBox(), function () {
                dropPayload(steps[0].getBox(), dstX, dstY);
            })
        });
    }
}


