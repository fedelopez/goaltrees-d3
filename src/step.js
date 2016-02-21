if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {

    var _box, _dstX, _dstY;

    function Step(box, dstX, dstY) {
        _box = box;
        _dstX = dstX;
        _dstY = dstY;
    }

    Step.prototype.getBox = function () {
        return _box;
    };

    Step.prototype.getDstX = function () {
        return _dstX;
    };

    Step.prototype.getDstY = function () {
        return _dstY;
    };

    return Step;

});