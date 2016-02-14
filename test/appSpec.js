describe("goaltrees-d3", function () {

    describe("state: neighbors", function () {

        it("should return the first empty spot to get rid of the box on top", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 2, 0, 1, 1),
                o1 = new Box("O1", "orange", 3, 0, 1, 1),
                b2 = new Box("B2", "blue", 4, 0, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 5, 2)).getNeighbors(g1, 2, 1);
            expect(actual.length).toBe(1);
            expect(actual[0].getBoxPile().boxAt(0, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(1, 0).name).toBe(b1.name);
        });

        it("should propose getting rid of the box of the top to get it out of the way", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 0, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 3, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 4, 2)).getNeighbors(g1, 2, 1);
            expect(actual.length).toBe(1);
            expect(actual[0].getBoxPile().boxAt(0, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(1, 1).name).toBe(b1.name);
        });

        it("should propose getting rid of the boxes of the top to get it out of the way", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 2, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 3, 3)).getNeighbors(g1, 2, 1);
            expect(actual.length).toBe(2);

            expect(actual[0].getBoxPile().boxAt(1, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(0, 1).name).toBe(r1.name);

            expect(actual[1].getBoxPile().boxAt(2, 1)).toBeUndefined();
            expect(actual[1].getBoxPile().boxAt(0, 2).name).toBe(b2.name);
        });

        it("should know how to get rid of large boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 2, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 3, 3)).getNeighbors(g1, 2, 1);
            expect(actual.length).toBe(2);

            expect(actual[0].getBoxPile().boxAt(1, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(0, 1).name).toBe(r1.name);

            expect(actual[1].getBoxPile().boxAt(2, 1)).toBeUndefined();
            expect(actual[1].getBoxPile().boxAt(0, 2).name).toBe(b2.name);
        });

        it("should propose the next abscissa when the first option is already full of boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                b2 = new Box("B2", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                w1 = new Box("W1", "white", 3, 0, 1, 1);
            var boxes = [b1, g1, r1, o1, b2, w1];

            var actual = new State(new BoxPile(boxes, 4, 2)).getNeighbors(b1, 2, 1);
            expect(actual.length).toBe(1);

            expect(actual[0].getBoxPile().boxAt(0, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(3, 1).name).toBe(b2.name);
        });

        it("should propose the next abscissa when the first options are already full of boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                b2 = new Box("B2", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                g2 = new Box("G2", "green", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                o2 = new Box("O2", "orange", 2, 1, 1, 1),
                w1 = new Box("W1", "white", 3, 0, 1, 1),
                p1 = new Box("P1", "purple", 4, 0, 1, 1);
            var boxes = [b1, g1, g2, o1, o2, b2, w1, p1];

            var actual = new State(new BoxPile(boxes, 5, 2)).getNeighbors(b1, 2, 1);
            expect(actual.length).toBe(2);

            expect(actual[0].getBoxPile().boxAt(0, 1)).toBeUndefined();
            expect(actual[0].getBoxPile().boxAt(3, 1).name).toBe(b2.name);

            expect(actual[1].getBoxPile().boxAt(2, 1)).toBeUndefined();
            expect(actual[1].getBoxPile().boxAt(4, 1).name).toBe(o2.name);
        })
    });

    describe("box pile suite", function () {
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

    describe("move suite", function () {

        it("should clear the top of the source box", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 2, 0, 1, 1),
                o1 = new Box("O1", "orange", 3, 0, 1, 1),
                b2 = new Box("B2", "blue", 4, 0, 1, 1);
            var pile = new BoxPile([b1, g1, r1, o1, b2], 4, 2);

            var actions = moveBox(new State(pile), g1, 1, 0);
            expect(actions.length).toBe(2);

            var action1 = actions[0];
            expect(action1.getBox().name).toBe(b1.name);
            expect(action1.getDstX()).toBe(2);
            expect(action1.getDstY()).toBe(1);

            var action2 = actions[1];
            expect(action2.getBox().name).toBe(g1.name);
            expect(action2.getDstX()).toBe(1);
            expect(action2.getDstY()).toBe(0);
        });

    });
});