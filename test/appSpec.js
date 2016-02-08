describe("goaltrees-d3", function () {

    var allBoxes, boxPile;

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
        boxPile = new BoxPile(allBoxes, 10, 3);
    });

    describe("move suite", function () {

        it("should return one operation when both boxes have no other box on top", function () {
            var boxR1 = allBoxes[2];
            var boxR2 = allBoxes[6];
            var state = new State(allBoxes, boxR2, boxR1);
            var moves = moveBox(state);
            expect(moves.length).toBe(1);
            expect(moves[0].getBoxName()).toBe(boxR2.name);
            expect(moves[0].getDstX()).toBe(2);
            expect(moves[0].getDstY()).toBe(3);
        });

        /**
         * todo
         */
        it("should clear the top of the destination box", function () {
            var boxG1 = allBoxes[1];
            var boxO1 = allBoxes[3];
            var moves = moveBox(new State(allBoxes, boxO1, boxG1));
            expect(moves.length).toBe(2);

            expect(moves[0].getBoxName()).toBe(allBoxes[0].name);
            expect(moves[0].getDstX()).toBe(0);
            expect(moves[0].getDstY()).toBe(0);

            expect(moves[1].getBoxName()).toBe(boxO1.name);
            expect(moves[1].getDstX()).toBe(1);
            expect(moves[1].getDstY()).toBe(1);

        });

    });

    describe("state suite", function () {

        it("should propose getting rid of the box of the top to get it out of the way", function () {
            var g1 = allBoxes[1];
            var r1 = allBoxes[2];
            var neighbors = new State(boxPile, g1, r1.x, r1.y + 1).getNeighbors();
            expect(neighbors.length).toBe(1);

            expect(neighbors[0].getBoxName()).toBe("B1");
            expect(neighbors[0].getDstX()).toBe(0);
            expect(neighbors[0].getDstY()).toBe(0);
        });

        //todo make another test where it proposes a place on top of a box

    });

    describe("box pile suite", function () {

        it("should return false when a box has no other box above", function () {
            expect(boxPile.isBoxAbove(allBoxes[0])).toBeFalsy();
            expect(boxPile.isBoxAbove(allBoxes[2])).toBeFalsy();
        });

        it("should return true when a box has another box above", function () {
            expect(boxPile.isBoxAbove(allBoxes[1])).toBeTruthy();
        });

        it("should return undefined when a box no topmost box above", function () {
            expect(boxPile.topmostBoxAbove(allBoxes[0])).toBeUndefined();
        });

        it("should return the topmost box above a given box", function () {
            expect(boxPile.topmostBoxAbove(allBoxes[1])).toBe(allBoxes[0]);
        });

    });

});