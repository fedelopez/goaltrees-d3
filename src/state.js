if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {

    var Step = require('./step');

    function State(boxPile) {
        this.step = null;
        this._boxPile = boxPile;
    }

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

    State.prototype.nextState = function (srcBox, dstX, dstY) {
        var topMostBoxSrc, topMostBoxDst;
        if (this._boxPile.isBoxAbove(srcBox)) {
            topMostBoxSrc = this._boxPile.topmostBoxAbove(srcBox);
            return createNeighbor(this._boxPile, topMostBoxSrc, dstX);
        }
        topMostBoxDst = this._boxPile.boxAt(dstX, dstY);
        if (topMostBoxDst) {
            topMostBoxDst = this._boxPile.topmostBoxAbove(topMostBoxDst) || topMostBoxDst;
            return createNeighbor(this._boxPile, topMostBoxDst, srcBox.x);
        }
        if (!topMostBoxSrc && !topMostBoxDst) {
            var state = new State(this._boxPile);
            state.step = new Step(srcBox, dstX, dstY);
            return state;
        }
        return null;
    };

    State.prototype.getBoxPile = function () {
        return this._boxPile;
    };

    State.prototype.getStep = function () {
        return this.step;
    };

    return State;

});