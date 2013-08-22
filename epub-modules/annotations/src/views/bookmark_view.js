EpubAnnotations.BookmarkView = Backbone.View.extend({

    el : "<div class='bookmark'> \
        <img src='images/comment_clickable_icon.png'></img> \
        </div>",

    events : {
        "mouseenter" : "mouseEnterHandler",
        "mouseleave" : "mouseLeaveHandler",
        "click" : "clickHandler"
    },

    initialize : function (options) {

        this.bookmark = new EpubAnnotations.Bookmark({
            CFI : options.CFI,
            targetElement : options.targetElement, 
            offsetTopAddition : options.offsetTopAddition,
            offsetLeftAddition : options.offsetLeftAddition,
            id : options.id,
            bbPageSetView : options.bbPageSetView
        });
    },

    resetBookmark : function (offsetTop, offsetLeft) {

        if (offsetTop) {
            this.bookmark.set({ offsetTopAddition : offsetTop });
        }

        if (offsetLeft) {
            this.bookmark.set({ offsetLeftAddition : offsetLeft });
        }
        this.setCSS();
    },

    render : function () {

        this.setCSS();
        return this.el;
    },

    setCSS : function () {

        var absoluteTop = this.bookmark.getAbsoluteTop();
        var absoluteLeft = this.bookmark.getAbsoluteLeft();
        this.$el.css({ 
            "top" : absoluteTop + "px",
            "left" : absoluteLeft + "px",
            "width" : "50px",
            "height" : "50px",
            // "border-left" : "20px solid transparent",
            // "border-right" : "20px solid transparent",
            // "border-top" : "20px solid #f00",
            "position" : "absolute",
            "opacity" : "0.4"
        });
    },

    mouseEnterHandler : function (event) {

        event.stopPropagation();
        this.$el.css({ 
            "opacity" : "1"
        });
    },

    mouseLeaveHandler : function (event) {

        event.stopPropagation();
        this.$el.css({ 
            "opacity" : "0.4"
        });
    },

    clickHandler : function (event) {

        event.stopPropagation();
        this.bookmark.get("bbPageSetView").trigger("annotationClicked", 
            "bookmark", 
            this.bookmark.get("CFI"), 
            this.bookmark.get("id"),
            this.$el.css("top"),
            this.$el.css("left")
        );
    }
});