EpubAnnotations.BookmarkView = Backbone.View.extend({

    el : "<div class='bookmark'></div>",

    initialize : function (options) {

        this.bookmark = new EpubAnnotations.Bookmark({
            CFI : options.CFI,
            targetElement : options.targetElement, 
            offsetTopAddition : options.offsetTopAddition,
            offsetLeftAddition : options.offsetLeftAddition,
            id : options.id
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
            "width" : "0",
            "height" : "0",
            "border-left" : "20px solid transparent",
            "border-right" : "20px solid transparent",
            "border-top" : "20px solid #f00",
            "position" : "absolute",
            "opacity" : "0.2"
        });
    }
});