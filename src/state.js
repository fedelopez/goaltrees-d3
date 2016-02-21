if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}

define(function () {

    var Step = require('./step');

    function State(boxPile) {
        this._boxPile = boxPile;
        this.step = null;
    }

    State.prototype.nextState = function (srcBox, dstX, dstY) {
        var topMostBoxSrc, topMostBoxDst;
        var boxPile = this.getBoxPile();
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

    State.prototype.getBoxPile = function () {
        return this._boxPile;
    };

    State.prototype.getStep = function () {
        return this.step;
    };

    function createNeighbor(pile, box, dstX) {
        var point = pile.firstFreeCoordinate(box, dstX);
        var pileCopy = pile.copy();
        var boxAt = pileCopy.boxAt(box.x, box.y);
        boxAt.x = point.x;
        boxAt.y = point.y;
        var state = new State(pileCopy);
        state.step = new Step(box, point.x, point.y);
        return state;
    }

    return State;

});