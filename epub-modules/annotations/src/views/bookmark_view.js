EpubAnnotations.BookmarkView = Backbone.View.extend({

    el : "<div class='bookmark'></div>",

    events : {
        "mouseenter" : "setHoverBookmark",
        "mouseleave" : "setBaseBookmark",
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
            "position" : "absolute"
        });
        this.$el.addClass("bookmark");
    },

    setHoverBookmark : function (event) {

        event.stopPropagation();
        this.$el.removeClass("bookmark");
        this.$el.addClass("hover-bookmark");
    },

    setBaseBookmark : function (event) {

        event.stopPropagation();
        this.$el.removeClass("hover-bookmark");
        this.$el.addClass("bookmark");
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