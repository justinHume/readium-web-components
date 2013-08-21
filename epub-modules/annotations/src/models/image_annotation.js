// Rationale: An image annotation does NOT have a view, as we don't know the state of an image element within an EPUB; it's entirely
//   possible that an EPUB image element could have a backbone view associated with it already, which would cause problems if we 
//   tried to associate another backbone view. As such, this model modifies CSS properties for an annotated image element.
//   
//   An image annotation view that manages an absolutely position element (similar to bookmarks, underlines and highlights) can be
//   added if more functionality is required. 

EpubAnnotations.ImageAnnotation = Backbone.Model.extend({

    initialize : function (attributes, options) {

        // Set handlers here. Can use jquery handlers
        var that = this;
        var $imageElement = $(this.get("imageNode"));
        $imageElement.on("mouseenter", function () {
            that.setMouseenterBorder();
        });
        $imageElement.on("mouseleave", function () {
            that.setMouseleaveBorder();
        });
        $imageElement.on("click", function () {
            that.get("bbPageSetView").trigger("annotationClicked", "image", that.get("CFI"), that.get("id"));
        });
    },

    render : function () {

        this.setCSS();
    },

    setCSS : function () {
        
        $(this.get("imageNode")).css({
            "border" : "5px solid rgb(255, 0, 0)",
            "border" : "5px solid rgba(255, 0, 0, 0.2)",
            "-webkit-background-clip" : "padding-box",
            "background-clip" : "padding-box"
        });
    },

    setMouseenterBorder : function () {

        $(this.get("imageNode")).css({
            "border" : "5px solid rgba(255, 0, 0, 0.4)"
        });
    },

    setMouseleaveBorder : function () {

        $(this.get("imageNode")).css({
            "border" : "5px solid rgba(255, 0, 0, 0.2)"
        });
    }
});