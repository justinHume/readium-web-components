EpubAnnotations.Highlighter = Backbone.Model.extend({

    defaults : function () {
        return {
            "selectedNodes" : [],
            "highlightViews" : []
        };
    },

    initialize : function (attributes, options) {

        this.constructHighlightViews();
    },

    // --------------- PRIVATE HELPERS ---------------------------------------

    constructHighlightViews : function () {

        var that = this;
        _.each(this.get("selectedNodes"), function (node, index) {

            var range = document.createRange();
            range.selectNodeContents(node);
            var rects = range.getClientRects();

            _.each(rects, function (rect, index) {

                var highlightTop = rect.top;
                var highlightLeft = rect.left;
                var highlightHeight = rect.height;
                var highlightWidth = rect.width;

                var highlightView = new EpubAnnotations.HighlightView({
                    CFI : that.get("CFI"),
                    top : highlightTop + that.get("offsetTopAddition"),
                    left : highlightLeft + that.get("offsetLeftAddition"),
                    height : highlightHeight,
                    width : highlightWidth
                });

                that.get("highlightViews").push(highlightView);
            });
        });
    },

    resetHighlights : function (viewportElement, offsetTop, offsetLeft) {

        if (offsetTop) {
            this.set({ offsetTopAddition : offsetTop });
        }
        if (offsetLeft) {
            this.set({ offsetLeftAddition : offsetLeft });
        }

        this.destroyCurrentHighlights();
        this.constructHighlightViews();
        this.renderHighlights(viewportElement);
    },

    // REFACTORING CANDIDATE: Ensure that event listeners are being properly cleaned up. 
    destroyCurrentHighlights : function () { 

        _.each(this.get("highlightViews"), function (highlightView) {
            highlightView.remove();
            highlightView.off();
        });

        this.set({ "highlightViews" : [] });
    },

    renderHighlights : function (viewportElement) {

        _.each(this.get("highlightViews"), function (view, index) {
            $(viewportElement).append(view.render());
        });
    },

    toInfo : function () {

        return {

            id : this.get("id"),
            type : "highlight",
            CFI : this.get("CFI")
        };
    }
});