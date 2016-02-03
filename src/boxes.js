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

var boxes = [
    new Box("B1", "#0000FF", 1, 1, 1, 1),
    new Box("G1", "#008000", 1, 0, 1, 1),
    new Box("R1", "#FF0000", 2, 0, 2, 1),
    new Box("O1", "orange", 3, 0, 1, 1),
    new Box("B2", "#0000FF", 4, 0, 2, 2),
    new Box("G2", "#008000", 6, 0, 1, 2),
    new Box("R2", "#FF0000", 8, 0, 1, 1),
    new Box("O2", "orange", 9, 0, 2, 1)
];