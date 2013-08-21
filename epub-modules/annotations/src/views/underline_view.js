EpubAnnotations.UnderlineView = Backbone.View.extend({

    el : "<div class='underline'> \
             <div class='transparent-part'></div> \
             <div class='underline-part'></div> \
          </div>",

    events : {
        "mouseenter" : "underlineEvent",
        "mouseleave" : "underlineEvent",
        "click" : "underlineEvent"
    },

    initialize : function (options) {

        this.underline = new EpubAnnotations.Underline({
            CFI : options.CFI,
            top : options.top,
            left : options.left,
            height : options.height,
            width : options.width,
            underlineGroupCallback : options.underlineGroupCallback,
            callbackContext : options.callbackContext
        });

        this.$transparentElement = $(".transparent-part", this.$el);
        this.$underlineElement = $(".underline-part", this.$el);
    },

    render : function () {

        this.setCSS();
        return this.el;
    },

    resetPosition : function (top, left, height, width) {

        this.underline.set({
            top : top,
            left : left,
            height : height,
            width : width
        });
        this.setCSS();
    },

    setCSS : function () {

        this.$el.css({ 
            "top" : this.underline.get("top") + "px",
            "left" : this.underline.get("left") + "px",
            "height" : this.underline.get("height") + "px",
            "width" : this.underline.get("width") + "px",
            "position" : "absolute",
        });

        // Transparent part
        this.$transparentElement.css({
            "position" : "relative",
            "background-color" : "transparent",
            "height" : "85%"
        });

        // Underline part
        this.$underlineElement.css({
            "position" : "relative",
            "height" : "15%",
            "background-color" : "red",
            "opacity" : "0.2"
        });
    },

    underlineEvent : function (event) {

        event.stopPropagation();
        var underlineGroupCallback = this.underline.get("underlineGroupCallback");
        var underlineGroupContext = this.underline.get("callbackContext");
        underlineGroupContext.underlineGroupCallback(event);
    },

    setMouseenterColor : function () {

        this.$underlineElement.css({
            "opacity" : "0.4"
        });
    },

    setMouseleaveColor : function () {

        this.$underlineElement.css({
            "opacity" : "0.2"
        });
    }
});