EpubAnnotations.BookmarkView = Backbone.View.extend({

    el : "<div></div>",

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
            bbPageSetView : options.bbPageSetView,
            type : options.type
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

        var absoluteTop;
        var absoluteLeft;

        if (this.bookmark.get("type") === "comment") {
            absoluteTop = this.bookmark.getAbsoluteTop();
            absoluteLeft = this.bookmark.getAbsoluteLeft();
            this.$el.css({ 
                "top" : absoluteTop + "px",
                "left" : absoluteLeft + "px",
                "width" : "50px",
                "height" : "50px",
                "position" : "absolute"
            });
            this.$el.addClass("comment");
        }
        else {
            this.$el.addClass("bookmark");
        }
    },

    setHoverBookmark : function (event) {

        event.stopPropagation();
        if (this.$el.hasClass("comment")) {
            this.$el.removeClass("comment");
            this.$el.addClass("hover-comment");
        }
    },

    setBaseBookmark : function (event) {

        event.stopPropagation();
        if (this.$el.hasClass("hover-comment")) {
            this.$el.removeClass("hover-comment");
            this.$el.addClass("comment");
        }
    },

    clickHandler : function (event) {

        event.stopPropagation();
        var type;
        if (this.bookmark.get("type") === "comment") {
            type = "comment";
        }
        else {
            type = "bookmark";
        }

        this.bookmark.get("bbPageSetView").trigger("annotationClicked", 
            type, 
            this.bookmark.get("CFI"), 
            this.bookmark.get("id"),
            this.$el.css("top"),
            this.$el.css("left")
        );
    }
});