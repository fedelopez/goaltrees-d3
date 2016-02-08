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


var State = function (boxPile, srcBox, dstX, dstY) {

    this.isGoal = function () {
        function isBoxPresent(box) {
            return box.x === dstX && box.y === dstY;
        }

        return !boxPile.hasBoxAbove(srcBox) && !boxPile.every(isBoxPresent)
    };

    this.getSrcBox = function () {
        return srcBox;
    };

    this.getDstX = function () {
        return dstX;
    };

    this.getDstY = function () {
        return dstY;
    };

    this.getNeighbors = function () {
        var neighbors = [];
        if (boxPile.isBoxAbove(srcBox)) {
            const topMostBox = boxPile.topmostBoxAbove(srcBox);
            const point = boxPile.firstFreeCoordinate(topMostBox, dstX);
            neighbors.push(new Action(topMostBox.name, point.x, point.y));
        }
        return neighbors;
    };
};

var Action = function (boxName, x, y) {

    this.getBoxName = function () {
        return boxName;
    };

    this.getDstX = function () {
        return x;
    };

    this.getDstY = function () {
        return y;
    };

};

var Box = function (name, color, x, y, height, width) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;

    var self = this;

    function onTopOf(candidateBox) {
        return self.y < candidateBox.y && self.x === candidateBox.x
    }

    this.hasBoxAbove = function (allBoxes) {
        return allBoxes.some(onTopOf)
    };
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
            console.log(box.name);
            if (topMostBox === undefined || box.y > topMostBox.y) topMostBox = box;
        });
        return topMostBox;
    };

    this.firstFreeCoordinate = function (box, excludedAbscissa) {
        for (var x = 0; x < this.getWidth(); x++) {
            const emptySpot = allBoxes.every(function (currentBox) {
                return currentBox.x != x;
            });
            if (emptySpot) {
                return {"x": x, "y": 0};
            } else {
                const result = allBoxes.filter(function (currentBox) {
                    return (!self.isBoxAbove(currentBox) && currentBox.x != box.x && currentBox.x != excludedAbscissa);
                });
                if (result.length > 0) return {"x": result[0].x, "y": result[0].y + 1}
            }
        }
        return undefined;
    };

    this.getWidth = function () {
        return width;
    }
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
            console.log("Box " + box.name + " clicked.");
            dropCrane(box);
        });
}

function dropCrane(targetBox) {
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
}

function moveBox(initialState) {

    var doMoveBox = function (visited, frontier) {
        if (frontier.length == 0) throw "No solution";
        else {
            var path = frontier[0];
            var state = path[0];
            if (state.isGoal()) {
                var x = state.getDstBox().x;
                var y = 1 + state.getDstBox().y + state.getDstBox().height;
                var boxName = state.getSrcBox().name;
                return [new Action(boxName, x, y)];
            } else {
                var neighbors = [];
                return null;
            }

        }
    };
    return doMoveBox([], [[initialState]]);
}


