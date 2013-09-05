EpubAnnotations.HighlightGroup = Backbone.Model.extend({

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

    highlightGroupCallback : function (event) {

        var that = this;
        
        // Trigger this event on each of the highlight views (except triggering event)
        if (event.type === "click") {
            that.get("bbPageSetView").trigger("annotationClicked", "highlight", that.get("CFI"), that.get("id"));
            return;
        }

        // Events that are called on each member of the group
        _.each(this.get("highlightViews"), function (highlightView) {

            if (event.type === "mouseenter") {
                highlightView.setHoverHighlight();    
            }
            else if (event.type === "mouseleave") {
                highlightView.setBaseHighlight();
            }
        });
    },

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
                    width : highlightWidth,
                    highlightGroupCallback : that.highlightGroupCallback,
                    callbackContext : that
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

        // REFACTORING CANDIDATE: Set length to clear the array, rather than initializing a new array (WRONG)
        this.get("highlightViews").length = 0;
        // this.set({ "highlightViews" : [] });
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