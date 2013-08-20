EpubAnnotations.HighlightView = Backbone.View.extend({

    el : "<div class='highlight'></div>",

    events : {
        "hover .highlight" : "setHoverOpacity"
    },

    initialize : function (options) {

        this.highlight = new EpubAnnotations.Highlight({
            CFI : options.CFI,
            top : options.top,
            left : options.left,
            height : options.height,
            width : options.width
        });
    },

    render : function () {

        this.setCSS();
        return this.el;
    },

    resetPosition : function (top, left, height, width) {

        this.highlight.set({
            top : top,
            left : left,
            height : height,
            width : width
        });
        this.setCSS();
    },

    setCSS : function () {

        this.$el.css({ 
            "top" : this.highlight.get("top") + "px",
            "left" : this.highlight.get("left") + "px",
            "height" : this.highlight.get("height") + "px",
            "width" : this.highlight.get("width") + "px",
            "position" : "absolute",
            "background-color" : "red",
            "opacity" : "0.2"
        });
    },

    liftHighlight : function () {

        this.$el.toggleClass("highlight");
        this.$el.toggleClass("liftedHighlight");
    },

    setHoverOpacity : function () {

        this.$el.css({
            "opacity" : "0.1"
        });
    }
});