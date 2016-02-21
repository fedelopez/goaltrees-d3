if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {

    function Box(name, color, x, y, height, width) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    Box.prototype.getName = function () {
        return this.name;
    };
    Box.prototype.getColor = function () {
        return this.color;
    };
    Box.prototype.getX = function () {
        return this.x;
    };
    Box.prototype.getY = function () {
        return this.y;
    };
    Box.prototype.getHeight = function () {
        return this.height;
    };
    Box.prototype.getWidth = function () {
        return this.width;
    };

    return Box;
});
