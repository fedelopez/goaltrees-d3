describe("goaltrees-d3", function () {

    describe("move suite", function () {

        it("should return empty path when both boxes have no other box on top", function () {
            var boxR1 = boxes[2];
            var boxR2 = boxes[6];
            var moves = move(boxes, boxR2, boxR1);
            expect(moves).toEqual([]);
        });

    });

    describe("has box above suite", function () {

        it("should return false when a box has no other box above", function () {
            expect(hasBoxAbove(boxes, boxes[0])).toBe(false);
            expect(hasBoxAbove(boxes, boxes[2])).toBe(false);
        });

        it("should return true when a box has another box above", function () {
            expect(hasBoxAbove(boxes, boxes[1])).toBe(true);
        });

    });

});