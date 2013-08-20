describe("EpubAnnotations.Highlighter", function () {

    beforeEach(function () {

        // An arbitrary CFI 
        var CFI = "/2/2/2/";

        // A set of text nodes
        var html = jasmine.getFixtures().read("selected_elements.xhtml");
        var $elements = $("p, div", html);
        var selectedNodes = [];

        // Inject elements to give them dimensions
        $.each($elements, function (index, element) {
            $("body", document).append(element);
        });

        $.each($elements, function (index, element) {

            $.each($(element).contents(), function (index, node) {

                if (node.nodeType = Node.TEXT_NODE) {
                    selectedNodes.push(node);
                }
            });
        });

        this.highlighter = new EpubAnnotations.Highlighter({
            CFI : CFI,
            selectedNodes : selectedNodes,
            offsetTopAddition : $("body").offset().top,
            offsetLeftAddition : $("body").offset().left
        });
    });

    describe("initialization", function () {

        it("can be initalized", function () {

            expect(this.highlighter).toBeDefined();
        });

        it("sets a reference to selected nodes", function () {

            expect(this.highlighter.get("selectedNodes").length).toBe(3);
        });
    });

    describe("constructHighlightViews()", function () {

        it("adds a highlight for every rect", function () {

            this.highlighter.constructHighlightViews();
        });

        it("can render highlights", function () {

            this.highlighter.constructHighlightViews();
            this.highlighter.renderHighlights($("body"));
        });
    });
});