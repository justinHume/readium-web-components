describe("EpubAnnotations.Annotations", function () {

    beforeEach(function () {

        var iframeOffsetTop = $("body").offset().top;
        var iframeOffsetLeft = $("body").offset().left;
        this.annotations = new EpubAnnotations.Annotations({
            offsetTopAddition : iframeOffsetTop, 
            offsetLeftAddition : iframeOffsetLeft,
            readerBoundElement : $("body")[0]
        });
    });

    describe("initialization", function () {

        it("can be initialized", function () {
            expect(this.annotations).toBeDefined();
        });
    });

    describe("public interface", function () {

        describe("highlights", function () {

            describe("addHighlight()", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("adds the highlight with an id", function () {

                    this.annotations.addHighlight("/2/2/2", undefined, 1);
                    expect(this.annotations.get("highlights").length).toBe(1);
                });

                it("adds the highlight to the annotations hash", function () {

                    this.annotations.addHighlight("/2/2/2", undefined, 1);
                    expect(this.annotations.get("annotationHash")["1"]).toBeDefined();
                });
            });

            describe("getHighlights", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("gets all the highlights", function () {

                    var highlights;
                    this.annotations.addHighlight("/2/2/2", undefined, 1);
                    this.annotations.addHighlight("/2/2/2", undefined, 2);
                    this.annotations.addHighlight("/2/2/2", undefined, 3);

                    highlights = this.annotations.getHighlights();

                    expect(highlights[0]).toBeDefined();
                    expect(highlights[1]).toBeDefined();
                    expect(highlights[2]).toBeDefined();
                });
            });

            describe("getHighlight", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("gets the specified highlight", function () {

                    var highlight;
                    this.annotations.addHighlight("/2/2/2", undefined, 1);
                    this.annotations.addHighlight("/2/2/2", undefined, 7);
                    this.annotations.addHighlight("/2/2/2", undefined, 2);

                    highlight = this.annotations.getHighlight(7);
                    expect(highlight.id).toBe("7");
                });
            });
        });

        describe("bookmarks", function () {

            describe("addBookmark()", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("can add a bookmark", function () {

                    var $injectedTarget = $("<div id='target'>TARGET</div>");
                    $("body").append($injectedTarget[0]);
                    this.annotations.addBookmark("/2/2/2", $("#target")[0], 1);

                    expect(this.annotations.get("bookmarkViews").length).toBe(1);
                });

                it("can add a bookmark with an id", function () {

                    this.annotations.addBookmark("/2/2/2", $("#target")[0], 7);
                    expect(this.annotations.get("bookmarkViews")[0].id).toBe("7");
                });
            });

            describe("getBookmarks", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("gets all the bookmarks", function () {

                    var bookmarks;
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 1);
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 2);
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 3);

                    bookmarks = this.annotations.getBookmarks();
                    expect(bookmarks[0]).toBeDefined();
                    expect(bookmarks[1]).toBeDefined();
                    expect(bookmarks[2]).toBeDefined();
                });
            });

            describe("getBookmark", function () {

                beforeEach(function () {

                    var offsetTop = $("body").offset().top;
                    var offsetLeft = $("body").offset().left;
                    this.annotations = new EpubAnnotations.Annotations({
                        offsetTopAddition : offsetTop, 
                        offsetLeftAddition : offsetLeft,
                        readerBoundElement : $("body")[0]
                    });
                });

                it("gets the specified bookmark", function () {

                    var bookmark;
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 2);
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 6);
                    this.annotations.addBookmark("/1/2/1/2", $("#target")[0], 8);

                    bookmark = this.annotations.getBookmark(2);
                    expect(bookmark.id).toBe("2");
                });
            });
        });
    });
});