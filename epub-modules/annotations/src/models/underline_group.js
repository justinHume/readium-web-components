EpubAnnotations.UnderlineGroup = Backbone.Model.extend({

    defaults : function () {
        return {
            "selectedNodes" : [],
            "underlineViews" : []
        };
    },

    initialize : function (attributes, options) {

        this.constructUnderlineViews();
    },

    // --------------- PRIVATE HELPERS ---------------------------------------

    underlineGroupCallback : function (event) {

        // Trigger this event on each of the underline views (except triggering event)
        _.each(this.get("underlineViews"), function (underlineView) {

            if (event.type === "mouseenter") {
                underlineView.setMouseenterColor();
            }
            else if (event.type === "mouseleave") {
                underlineView.setMouseleaveColor();
            }
        });
    },

    constructUnderlineViews : function () {

        var that = this;
        _.each(this.get("selectedNodes"), function (node, index) {

            var range = document.createRange();
            range.selectNodeContents(node);
            var rects = range.getClientRects();

            _.each(rects, function (rect, index) {

                var underlineTop = rect.top;
                var underlineLeft = rect.left;
                var underlineHeight = rect.height;
                var underlineWidth = rect.width;

                var underlineView = new EpubAnnotations.UnderlineView({
                    CFI : that.get("CFI"),
                    top : underlineTop + that.get("offsetTopAddition"),
                    left : underlineLeft + that.get("offsetLeftAddition"),
                    height : underlineHeight,
                    width : underlineWidth,
                    underlineGroupCallback : that.underlineGroupCallback,
                    callbackContext : that
                });

                that.get("underlineViews").push(underlineView);
            });
        });
    },

    resetUnderlines : function (viewportElement, offsetTop, offsetLeft) {

        if (offsetTop) {
            this.set({ offsetTopAddition : offsetTop });
        }
        if (offsetLeft) {
            this.set({ offsetLeftAddition : offsetLeft });
        }

        this.destroyCurrentUnderlines();
        this.constructUnderlineViews();
        this.renderUnderlines(viewportElement);
    },

    // REFACTORING CANDIDATE: Ensure that event listeners are being properly cleaned up. 
    destroyCurrentUnderlines : function () { 

        _.each(this.get("underlineViews"), function (underlineView) {
            underlineView.remove();
            underlineView.off();
        });

        // REFACTORING CANDIDATE: Set length to clear the array, rather than initializing a new array (WRONG)
        this.set({ "underlineViews" : [] });
    },

    renderUnderlines : function (viewportElement) {

        _.each(this.get("underlineViews"), function (view, index) {
            $(viewportElement).append(view.render());
        });
    },

    toInfo : function () {

        return {

            id : this.get("id"),
            type : "underline",
            CFI : this.get("CFI")
        };
    }
});