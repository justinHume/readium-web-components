EpubAnnotations.Annotations = Backbone.Model.extend({

    defaults : function () {
        return {
            "bookmarkViews" : [],
            "highlights" : [],
            "annotationHash" : {},
            "offsetTopAddition" : 0,
            "offsetLeftAddition" : 0,
            "readerBoundElement" : undefined
        };
    },

    initialize : function (attributes, options) {},

    redrawAnnotations : function (offsetTop, offsetLeft) {

        var that = this;
        _.each(this.get("highlights"), function (highlighter) {
            highlighter.resetHighlights(that.get("readerBoundElement"), offsetTop, offsetLeft);
        });  

        _.each(this.get("bookmarkViews"), function (bookmarkView) {
            bookmarkView.resetBookmark(offsetTop, offsetLeft);
        });
    },

    getBookmark : function (id) {

        var bookmarkView = this.get("annotationHash")[id];
        if (bookmarkView) {
            return bookmarkView.bookmark.toInfo();
        }
        else {
            return undefined;
        }
    },

    getHighlight : function (id) {

        var highlight = this.get("annotationHash")[id];
        if (highlight) {
            return highlight.toInfo();
        }
        else {
            return undefined;
        }
    },

    getBookmarks : function () {

        var bookmarks = [];
        _.each(this.get("bookmarkViews"), function (bookmarkView) {

            bookmarks.push(bookmarkView.bookmark.toInfo());
        });
        return bookmarks;
    },

    getHighlights : function () {

        var highlights = [];
        _.each(this.get("highlights"), function (highlight) {

            highlights.push(highlight.toInfo());
        });
        return highlights;
    },

    addBookmark : function (CFI, targetElement, annotationId, offsetTop, offsetLeft) {

        if (!offsetTop) {
            offsetTop = this.get("offsetTopAddition");
        }
        if (!offsetLeft) {
            offsetLeft = this.get("offsetLeftAddition");
        }

        annotationId = annotationId.toString();
        this.validateAnnotationId(annotationId);

        var bookmarkView = new EpubAnnotations.BookmarkView({
            CFI : CFI,
            targetElement : targetElement, 
            offsetTopAddition : offsetTop,
            offsetLeftAddition : offsetLeft,
            id : annotationId.toString()
        });
        this.get("annotationHash")[annotationId] = bookmarkView;
        this.get("bookmarkViews").push(bookmarkView);
        $(this.get("readerBoundElement")).append(bookmarkView.render());
    },

    addHighlight : function (CFI, highlightedTextNodes, annotationId, offsetTop, offsetLeft) {

        if (!offsetTop) {
            offsetTop = this.get("offsetTopAddition");
        }
        if (!offsetLeft) {
            offsetLeft = this.get("offsetLeftAddition");
        }

        annotationId = annotationId.toString();
        this.validateAnnotationId(annotationId);

        var highlighter = new EpubAnnotations.Highlighter({
            CFI : CFI,
            selectedNodes : highlightedTextNodes,
            offsetTopAddition : offsetTop,
            offsetLeftAddition : offsetLeft,
            id : annotationId
        });
        this.get("annotationHash")[annotationId] = highlighter;
        this.get("highlights").push(highlighter);
        highlighter.renderHighlights(this.get("readerBoundElement"));
    },

    // REFACTORING CANDIDATE: Some kind of hash lookup would be more efficient here, might want to 
    //   change the implementation of the annotations as an array
    validateAnnotationId : function (id) {

        if (this.get("annotationHash")[id]) {
            throw new Error("That annotation id already exists; annotation not added");
        }
    }
});