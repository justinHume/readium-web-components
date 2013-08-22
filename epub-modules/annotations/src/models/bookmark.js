EpubAnnotations.Bookmark = Backbone.Model.extend({

    defaults : {
        "isVisible" : false,
        "bookmarkCenteringAdjustment" : 15,
        "bookmarkTopAdjustment" : 45
    },

    initialize : function (attributes, options) {

        // Figure out the top and left of the bookmark
        // This should include the additional offset provided by the annotations object
    },

    getAbsoluteTop : function () {

        var targetElementTop = $(this.get("targetElement")).offset().top;
        var bookmarkAbsoluteTop = this.get("offsetTopAddition") + targetElementTop - this.get("bookmarkTopAdjustment");
        return bookmarkAbsoluteTop;
    },

    getAbsoluteLeft : function () {

        var targetElementLeft = $(this.get("targetElement")).offset().left;
        var bookmarkAbsoluteLeft = this.get("offsetLeftAddition") + targetElementLeft - this.get("bookmarkCenteringAdjustment");
        return bookmarkAbsoluteLeft;
    },

    toInfo : function () {

        return {

            id : this.get("id"),
            type : "bookmark",
            CFI : this.get("CFI")
        };
    }
});