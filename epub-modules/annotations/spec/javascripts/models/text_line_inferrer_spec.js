describe("EpubAnnotations.TextLineInferrer", function () {

    describe("initialization", function () {

        it("can be initialized", function () {

            var lineInferrer = new EpubAnnotations.TextLineInferrer();
            expect(lineInferrer).toBeDefined();
        });
    });

    describe("public interface", function () {

        describe("inferLines()", function () {

            var rects = [
                {
                    top : 10,
                    left : 10,
                    width : 40,
                    height : 8
                },
                {
                    top : 10,
                    left : 50,
                    width : 50,
                    height : 8
                },
                {
                    top : 10,
                    left : 100,
                    width : 60,
                    height : 8
                },
                {
                    top : 20,
                    left : 10,
                    width : 40,
                    height : 8
                },
                {
                    top : 20,
                    left : 80,
                    width : 20,
                    height : 8
                },
                {
                    top : 30,
                    left : 10,
                    width : 40,
                    height : 8
                },
                {
                    top : 40,
                    left : 10,
                    width : 60,
                    height : 8
                }
            ];

            var expectedLines = [
                {
                    left : 10,
                    startTop : 10,
                    width : 150, 
                    avgHeight : 8, 
                    maxTop : 10,
                    maxBottom : 18,
                    numRects : 3
                },
                {
                    left : 10,
                    startTop : 20,
                    width : 40, 
                    avgHeight : 8, 
                    maxTop : 20,
                    maxBottom : 28,
                    numRects : 1
                },
                {
                    left : 80,
                    startTop : 20,
                    width : 20, 
                    avgHeight : 8, 
                    maxTop : 20,
                    maxBottom : 28,
                    numRects : 1
                },
                {
                    left : 10,
                    startTop : 30,
                    width : 40, 
                    avgHeight : 8, 
                    maxTop : 30,
                    maxBottom : 38,
                    numRects : 1
                },
                {
                    left : 10,
                    startTop : 40,
                    width : 60, 
                    avgHeight : 8, 
                    maxTop : 40,
                    maxBottom : 48,
                    numRects : 1
                },
            ];

            it("can infer lines", function () {

                lineInferrer = new EpubAnnotations.TextLineInferrer();
                var inferredLines = lineInferrer.inferLines(rects);

                expect(expectedLines[0]).toEqual(inferredLines[0]);
                expect(expectedLines[1]).toEqual(inferredLines[1]);
                expect(expectedLines[2]).toEqual(inferredLines[2]);
                expect(expectedLines[3]).toEqual(inferredLines[3]);
                expect(expectedLines[4]).toEqual(inferredLines[4]);
            });
        });
    });

    describe("private helpers", function () {

        var lineInferrer;
        beforeEach(function () {
            lineInferrer = new EpubAnnotations.TextLineInferrer();
        });

        describe("rectIsWithinLineVertically()", function () {

            // Curr line : Rect
            //             --------- 
            // ---------   |       |
            // |       |   ---------
            // ---------
            it("is: rectTop < currLineMaxTop & rectBottom < currLineMaxBottom", function () {

                var currLineMaxTop = 50;
                var currLineMaxBottom = 70;
                var rectTop = 40;
                var rectHeight = 20;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(true);
            });

            // Curr line : Rect
            // --------- 
            // |       |   ---------
            // ---------   |       |
            //             ---------
            it("is: rectTop > currLineMaxTop & rectBottom > currLineMaxBottom", function () {

                var currLineMaxTop = 30;
                var currLineMaxBottom = 50;
                var rectTop = 40;
                var rectHeight = 20;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(true);
            });

            // Curr line : Rect
            // --------- 
            // |       |   ---------
            // |       |   ---------
            // ---------
            it("is: rectTop > currLineMaxTop & rectBottom < currLineMaxBottom", function () {

                var currLineMaxTop = 40;
                var currLineMaxBottom = 60;
                var rectTop = 45;
                var rectHeight = 10;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(true);
            });

            // Curr line : Rect
            //             ---------
            // ---------   |       |
            // ---------   |       |
            //             ---------
            it("is: rectTop < currLineMaxTop & rectBottom > currLineMaxBottom", function () {

                var currLineMaxTop = 40;
                var currLineMaxBottom = 45;
                var rectTop = 30;
                var rectHeight = 20;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(true);
            });

            // Curr line : Rect
            //             ---------
            //             ---------
            // ---------
            // ---------
            it("is NOT: rectBottom < currLineMaxTop", function () {

                var currLineMaxTop = 50;
                var currLineMaxBottom = 60;
                var rectTop = 30;
                var rectHeight = 10;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(false);
            });

            // Curr line : Rect
            // ---------
            // ---------
            //             ---------
            //             ---------
            it("is NOT: rectTop > currLineMaxBottom", function () {

                var currLineMaxTop = 20;
                var currLineMaxBottom = 30;
                var rectTop = 40;
                var rectHeight = 10;
                var isOnFirstLine = lineInferrer.rectIsWithinLineVertically(rectTop, rectHeight, currLineMaxTop, currLineMaxBottom);

                expect(isOnFirstLine).toBe(false);
            });
        });

        describe("rectIsWithinLineHorizontally()", function () {

            it("YES: gap > 2 * avg line height", function () {

                var currLineLeft = 10;
                var currLineWidth = 40;
                var currLineAvgHeight = 10;
                var rectLeft = 60; 
                var shouldBeAppended = lineInferrer.rectIsWithinLineHorizontally(rectLeft, currLineLeft, currLineWidth, currLineAvgHeight);

                expect(shouldBeAppended).toBe(true);
            });

            it("NO: gap < 2 * avg line height", function () {

                var currLineLeft = 10;
                var currLineWidth = 40;
                var currLineAvgHeight = 10;
                var rectLeft = 80; 
                var shouldBeAppended = lineInferrer.rectIsWithinLineHorizontally(rectLeft, currLineLeft, currLineWidth, currLineAvgHeight);

                expect(shouldBeAppended).toBe(false);
            });
        });

        describe("createNewLine()", function () {

            it("inits a new line", function () {

                var rectLeft = 10;
                var rectTop = 30;
                var rectWidth = 50;
                var rectHeight = 20;

                var lineMaxTop = 30;
                var lineMaxBottom = 50;
                var lineAvgHeight = 20;
                var numRects = 1;

                var newLine = lineInferrer.createNewLine(rectLeft, rectTop, rectWidth, rectHeight);

                expect(newLine.left).toBe(10);
                expect(newLine.startTop).toBe(30);
                expect(newLine.width).toBe(50);
                expect(newLine.avgHeight).toBe(lineAvgHeight);
                expect(newLine.maxTop).toBe(lineMaxTop);
                expect(newLine.maxBottom).toBe(lineMaxBottom);
                expect(newLine.numRects).toBe(numRects);
            });
        });

        describe("expandLine()", function () {

            var currLine;
            beforeEach(function () {

                currLine = {
                    left : 10,
                    startTop : 20,
                    width : 40, 
                    avgHeight : 40, 
                    maxTop : 15,
                    maxBottom : 50,
                    numRects : 4
                };
            });

            it("updates the average line height", function () {

                var rectLeft = 50;
                var rectTop = 10;
                var rectWidth = 30;
                var rectHeight = 50;
                var updatedLine = lineInferrer.expandLine(currLine, rectLeft, rectTop, rectWidth, rectHeight);

                expect(updatedLine.avgHeight).toBe(42);
            });

            it("updates the number of rects in the line", function () {

                var rectLeft = 50;
                var rectTop = 10;
                var rectWidth = 30;
                var rectHeight = 50;
                var updatedLine = lineInferrer.expandLine(currLine, rectLeft, rectTop, rectWidth, rectHeight);

                expect(updatedLine.numRects).toBe(5);
            });

            it("updates the max top: rectTop < currentLine.maxTop", function () {

                var rectLeft = 50;
                var rectTop = 10;
                var rectWidth = 30;
                var rectHeight = 50;
                var updatedLine = lineInferrer.expandLine(currLine, rectLeft, rectTop, rectWidth, rectHeight);

                expect(updatedLine.maxTop).toBe(10);
            });

            it("updates the max bottom: rectBottom > currentLine.maxBottom", function () {

                var rectLeft = 50;
                var rectTop = 10;
                var rectWidth = 30;
                var rectHeight = 50;
                var updatedLine = lineInferrer.expandLine(currLine, rectLeft, rectTop, rectWidth, rectHeight);

                expect(updatedLine.maxBottom).toBe(60);
            });

            it("updates the line width", function () {

                var rectLeft = 50;
                var rectTop = 10;
                var rectWidth = 30;
                var rectHeight = 50;
                var updatedLine = lineInferrer.expandLine(currLine, rectLeft, rectTop, rectWidth, rectHeight);

                expect(updatedLine.width).toBe(70);
            });
        });
    });
});