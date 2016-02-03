describe("goaltrees-d3", function () {

    var allBoxes;

    beforeEach(function () {
        allBoxes = [
            new Box("B1", "blue", 1, 1, 1, 1),
            new Box("G1", "green", 1, 0, 1, 1),
            new Box("R1", "red", 2, 0, 2, 1),
            new Box("O1", "orange", 3, 0, 1, 1),
            new Box("B2", "blue", 4, 0, 2, 2),
            new Box("G2", "green", 6, 0, 1, 2),
            new Box("R2", "red", 8, 0, 1, 1),
            new Box("O2", "orange", 9, 0, 2, 1)
        ];
    });

    describe("move suite", function () {

        it("should return one operation when both boxes have no other box on top", function () {
            var boxR1 = allBoxes[2];
            var boxR2 = allBoxes[6];
            var moves = moveBox(allBoxes, boxR2, boxR1);
            expect(moves).toEqual([{box: boxR2, x: 2, y: 3}]);
        });

        /**
         * todo
         */
        it("should clear the top of the destination box", function () {
            var boxG1 = allBoxes[1];
            var boxO1 = allBoxes[3];
            var moves = moveBox(allBoxes, boxO1, boxG1);
            expect(moves).toEqual([
                {box: allBoxes[0], x: 0, y: 0},
                {box: boxO1, x: 1, y: 1}
            ]);
        });

    });

    describe("has box above suite", function () {

        it("should return false when a box has no other box above", function () {
            expect(allBoxes[0].hasBoxAbove(allBoxes)).toBeFalsy();
            expect(allBoxes[2].hasBoxAbove(allBoxes)).toBeFalsy();
        });

        it("should return true when a box has another box above", function () {
            expect(allBoxes[1].hasBoxAbove(allBoxes)).toBeTruthy();
        });

    });

});