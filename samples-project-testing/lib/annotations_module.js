var EpubAnnotationsModule = function (contentDocumentDOM, bbPageSetView) {
    
    var EpubAnnotations = {};

    // Rationale: The order of these matters
    EpubAnnotations.Highlight = Backbone.Model.extend({

    defaults : {
        "isVisible" : false
    },

    initialize : function (attributes, options) {}
});
    EpubAnnotations.HighlightGroup = Backbone.Model.extend({

    defaults : function () {
        return {
            "selectedNodes" : [],
            "highlightViews" : []
        };
    },

    initialize : function (attributes, options) {

        this.constructHighlightViews();
    },

    // --------------- PRIVATE HELPERS ---------------------------------------

    highlightGroupCallback : function (event) {

        var that = this;
        
        // Trigger this event on each of the highlight views (except triggering event)
        if (event.type === "click") {
            that.get("bbPageSetView").trigger("annotationClicked", "highlight", that.get("CFI"), that.get("id"));
            return;
        }

        // Events that are called on each member of the group
        _.each(this.get("highlightViews"), function (highlightView) {

            if (event.type === "mouseenter") {
                highlightView.setMouseenterColor();    
            }
            else if (event.type === "mouseleave") {
                highlightView.setMouseleaveColor();
            }
        });
    },

    constructHighlightViews : function () {

        var that = this;
        _.each(this.get("selectedNodes"), function (node, index) {

            var range = document.createRange();
            range.selectNodeContents(node);
            var rects = range.getClientRects();

            _.each(rects, function (rect, index) {

                var highlightTop = rect.top;
                var highlightLeft = rect.left;
                var highlightHeight = rect.height;
                var highlightWidth = rect.width;

                var highlightView = new EpubAnnotations.HighlightView({
                    CFI : that.get("CFI"),
                    top : highlightTop + that.get("offsetTopAddition"),
                    left : highlightLeft + that.get("offsetLeftAddition"),
                    height : highlightHeight,
                    width : highlightWidth,
                    highlightGroupCallback : that.highlightGroupCallback,
                    callbackContext : that
                });

                that.get("highlightViews").push(highlightView);
            });
        });
    },

    resetHighlights : function (viewportElement, offsetTop, offsetLeft) {

        if (offsetTop) {
            this.set({ offsetTopAddition : offsetTop });
        }
        if (offsetLeft) {
            this.set({ offsetLeftAddition : offsetLeft });
        }

        this.destroyCurrentHighlights();
        this.constructHighlightViews();
        this.renderHighlights(viewportElement);
    },

    // REFACTORING CANDIDATE: Ensure that event listeners are being properly cleaned up. 
    destroyCurrentHighlights : function () { 

        _.each(this.get("highlightViews"), function (highlightView) {
            highlightView.remove();
            highlightView.off();
        });

        // REFACTORING CANDIDATE: Set length to clear the array, rather than initializing a new array (WRONG)
        this.set({ "highlightViews" : [] });
    },

    renderHighlights : function (viewportElement) {

        _.each(this.get("highlightViews"), function (view, index) {
            $(viewportElement).append(view.render());
        });
    },

    toInfo : function () {

        return {

            id : this.get("id"),
            type : "highlight",
            CFI : this.get("CFI")
        };
    }
});
    EpubAnnotations.Underline = Backbone.Model.extend({

    defaults : {
        "isVisible" : false
    },

    initialize : function (attributes, options) {}
});
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

        var that = this;

        // Trigger this event on each of the underline views (except triggering event)
        if (event.type === "click") {
            that.get("bbPageSetView").trigger("annotationClicked", "underline", that.get("CFI"), that.get("id"));
            return;
        }

        // Events that are called on each member of the group
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
    EpubAnnotations.ReflowableAnnotations = Backbone.Model.extend({

    initialize : function (attributes, options) {
        
        this.epubCFI = new EpubCFIModule();
        this.annotations = new EpubAnnotations.Annotations({
            offsetTopAddition : 0, 
            offsetLeftAddition : 0, 
            readerBoundElement : $("html", this.get("contentDocumentDOM"))[0],
            bbPageSetView : this.get("reflowableView")
        });
    },

    redraw : function () {

        var leftAddition = -this.getPaginationLeftOffset();
        this.annotations.redrawAnnotations(0, leftAddition);
    },

    addHighlight : function (CFI, id, type) {

        var CFIRangeInfo;
        var range;
        var rangeStartNode;
        var rangeEndNode;
        var selectedElements;
        var leftAddition;
        var startMarkerHtml = this.getRangeStartMarker(CFI, id);
        var endMarkerHtml = this.getRangeEndMarker(CFI, id);

        try {
            CFIRangeInfo = this.epubCFI.injectRangeElements(
                CFI,
                this.get("contentDocumentDOM"),
                startMarkerHtml,
                endMarkerHtml,
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
                );

            // Get start and end marker for the id, using injected into elements
            // REFACTORING CANDIDATE: Abstract range creation to account for no previous/next sibling, for different types of
            //   sibiling, etc. 
            rangeStartNode = CFIRangeInfo.startElement.nextSibling ? CFIRangeInfo.startElement.nextSibling : CFIRangeInfo.startElement;
            rangeEndNode = CFIRangeInfo.endElement.previousSibling ? CFIRangeInfo.endElement.previousSibling : CFIRangeInfo.endElement;
            range = document.createRange();
            range.setStart(rangeStartNode, 0);
            range.setEnd(rangeEndNode, rangeEndNode.length);

            selectionInfo = this.getSelectionInfo(range);
            leftAddition = -this.getPaginationLeftOffset();

            if (type === "highlight") {
                this.annotations.addHighlight(CFI, selectionInfo.selectedElements, id, 0, leftAddition);
            }
            else if (type === "underline") {
                this.annotations.addUnderline(CFI, selectionInfo.selectedElements, id, 0, leftAddition);
            }

            return {
                CFI : CFI, 
                selectedElements : selectionInfo.selectedElements
            };

        } catch (error) {
            console.log(error.message);
        }
    },

    addBookmark : function (CFI, id) {

        var selectedElements;
        var bookmarkMarkerHtml = this.getBookmarkMarker(CFI, id);
        var $injectedElement;
        var leftAddition;

        try {
            $injectedElement = this.epubCFI.injectElement(
                CFI,
                this.get("contentDocumentDOM"),
                bookmarkMarkerHtml,
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
                );

            // Add bookmark annotation here
            leftAddition = -this.getPaginationLeftOffset();
            this.annotations.addBookmark(CFI, $injectedElement[0], id, 0, leftAddition);

            return {

                CFI : CFI, 
                selectedElements : $injectedElement[0]
            };

        } catch (error) {
            console.log(error.message);
        }
    },

    addImageAnnotation : function (CFI, id) {

        var selectedElements;
        var bookmarkMarkerHtml = this.getBookmarkMarker(CFI, id);
        var $targetImage;

        try {
            $targetImage = this.epubCFI.getTargetElement(
                CFI,
                this.get("contentDocumentDOM"),
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
            );
            this.annotations.addImageAnnotation(CFI, $targetImage[0], id);

            return {

                CFI : CFI, 
                selectedElements : $targetImage[0]
            };

        } catch (error) {
            console.log(error.message);
        }
    },

    addSelectionHighlight : function (id, type) {

        var highlightRange;
        var selectionInfo;
        var leftAddition;
        var currentSelection = this.getCurrentSelectionRange();
        if (currentSelection) {

            highlightRange = this.injectHighlightMarkers(currentSelection);
            selectionInfo = this.getSelectionInfo(highlightRange);
            leftAddition = -this.getPaginationLeftOffset();

            if (type === "highlight") {
                this.annotations.addHighlight(selectionInfo.CFI, selectionInfo.selectedElements, id, 0, leftAddition);
            }
            else if (type === "underline") {
                this.annotations.addUnderline(selectionInfo.CFI, selectionInfo.selectedElements, id, 0, leftAddition);
            }
            
            return selectionInfo;
        }
        else {
            throw new Error("Nothing selected");
        }
    },

    addSelectionBookmark : function (id) {

        var marker;
        var partialCFI;
        var leftAddition;
        var currentSelection = this.getCurrentSelectionRange();
        if (currentSelection) {

            partialCFI = this.generateCharOffsetCFI(currentSelection);
            marker = this.injectBookmarkMarker(currentSelection);
            leftAddition = -this.getPaginationLeftOffset();
            this.annotations.addBookmark("", marker, id, 0, leftAddition);

            return {
                CFI : partialCFI,
                selectedElements : marker
            };
        }
        else {
            throw new Error("Nothing selected");
        }
    },

    addSelectionImageAnnotation : function (id) {

        var partialCFI;
        var currentSelection = this.getCurrentSelectionRange();
        var selectedImages;
        var firstSelectedImage;
        if (currentSelection) {

            selectedImages = this.getSelectionInfo(currentSelection, ["img"]).selectedElements;
            firstSelectedImage = selectedImages[0];
            partialCFI = this.epubCFI.generateElementCFIComponent(
                firstSelectedImage,
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
            );
            this.annotations.addImageAnnotation("", firstSelectedImage, id);

            return {
                CFI : partialCFI,
                selectedElements : firstSelectedImage
            };
        }
        else {
            throw new Error("Nothing selected");
        }
    },

    getSelectionInfo : function (selectedRange, elementType) {

        // Generate CFI for selected text
        var CFI = this.generateRangeCFI(selectedRange);
        var intervalState = {
            startElementFound : false,
            endElementFound : false
        };
        var selectedElements = [];

        if (!elementType) {
            var elementType = ["text"];
        }

        this.findSelectedElements(
            selectedRange.commonAncestorContainer, 
            selectedRange.startContainer, 
            selectedRange.endContainer,
            intervalState,
            selectedElements, 
            elementType
        );

        // Return a list of selected text nodes and the CFI
        return {
            CFI : CFI,
            selectedElements : selectedElements
        };
    },

    generateRangeCFI : function (selectedRange) {

        var startNode = selectedRange.startContainer;
        var endNode = selectedRange.endContainer;
        var startOffset;
        var endOffset;
        var rangeCFIComponent;

        if (startNode.nodeType === Node.TEXT_NODE && endNode.nodeType === Node.TEXT_NODE) {

            startOffset = selectedRange.startOffset;
            endOffset = selectedRange.endOffset;

            rangeCFIComponent = this.epubCFI.generateCharOffsetRangeComponent(
                startNode, 
                startOffset, 
                endNode, 
                endOffset,
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
                );
            return rangeCFIComponent;
        }
        else {
            throw new Error("Selection start and end must be text nodes");
        }
    },

    generateCharOffsetCFI : function (selectedRange) {

        // Character offset
        var startNode = selectedRange.startContainer;
        var startOffset = selectedRange.startOffset;
        var charOffsetCFI;

        if (startNode.nodeType === Node.TEXT_NODE) {
            charOffsetCFI = this.epubCFI.generateCharacterOffsetCFIComponent(
                startNode,
                startOffset,
                ["cfi-marker"],
                [],
                ["MathJax_Message"]
                );
        }
        return charOffsetCFI;
    },

    findExistingLastPageMarker : function ($visibleTextNode) {

        // Check if a last page marker already exists on this page
        try {
            
            var existingCFI = undefined;
            $.each($visibleTextNode.parent().contents(), function () {

                if ($(this).hasClass("last-page")) {
                    lastPageMarkerExists = true;
                    existingCFI = $(this).attr("data-last-page-cfi");

                    // Break out of loop
                    return false;
                }
            });

            return existingCFI;
        }
        catch (e) {

            console.log("Could not generate CFI for non-text node as first visible element on page");

            // No need to execute the rest of the save position method if the first visible element is not a text node
            return undefined;
        }
    },

    // REFACTORING CANDIDATE: Convert this to jquery
    findSelectedElements : function (currElement, startElement, endElement, intervalState, selectedElements, elementTypes) {

        if (currElement === startElement) {
            intervalState.startElementFound = true;
        }

        if (intervalState.startElementFound === true) {
            this.addElement(currElement, selectedElements, elementTypes);
        }

        if (currElement === endElement) {
            intervalState.endElementFound = true;
            return;
        }

        if (currElement.firstChild) {
            this.findSelectedElements(currElement.firstChild, startElement, endElement, intervalState, selectedElements, elementTypes);
            if (intervalState.endElementFound) {
                return;
            }
        }

        if (currElement.nextSibling) {
            this.findSelectedElements(currElement.nextSibling, startElement, endElement, intervalState, selectedElements, elementTypes);
            if (intervalState.endElementFound) {
                return;
            }
        }
    },

    addElement : function (currElement, selectedElements, elementTypes) {

        // Check if the node is one of the types
        _.each(elementTypes, function (elementType) {

            if (elementType === "text") {
                if (currElement.nodeType === Node.TEXT_NODE) {
                    selectedElements.push(currElement);
                }
            }
            else {
                if ($(currElement).is(elementType)) {
                    selectedElements.push(currElement);    
                }
            }
        });
    },

    // REFACTORING CANDIDATE: The methods here inject bookmark/highlight markers for the current selection, after
    //   which information for the selected range is generated and returned in an annotation "info" object. The 
    //   injectedHighlightMarkers method leverages parts of the CFI library that should be private to that library; this
    //   is not ideal, and adds redundant, complex, code to the annotations delegate. A better method here would be to generate
    //   selection info, get the generated range CFI, and use that to inject markers. The only reason this wasn't done is 
    //   because the CFI library did not support CFI range generation or injection when selection and highlighting was done.
    injectBookmarkMarker : function (selectionRange, id) {

        var startNode = selectionRange.startContainer;
        var startOffset = selectionRange.startOffset;
        var $bookmarkMarker = $(this.getBookmarkMarker("", id));
        var highlightRange;

        this.epubCFI.injectElementAtOffset(
            $(startNode), 
            startOffset,
            $bookmarkMarker
        );

        return $bookmarkMarker[0];        
    },
 
    injectHighlightMarkers : function (selectionRange, id) {

        var highlightRange;
        if (selectionRange.startContainer === selectionRange.endContainer) {
            highlightRange = this.injectHighlightInSameNode(selectionRange, id);
        } else {
            highlightRange = this.injectHighlightsInDifferentNodes(selectionRange, id);
        }

        return highlightRange;
    },

    injectHighlightInSameNode : function (selectionRange, id) {

        var startNode;
        var startOffset = selectionRange.startOffset;
        var endNode = selectionRange.endContainer;
        var endOffset = selectionRange.endOffset;
        var $startMarker = $(this.getRangeStartMarker("", id));
        var $endMarker = $(this.getRangeEndMarker("", id));
        var highlightRange;

        // Rationale: The end marker is injected before the start marker because when the text node is split by the 
        //   end marker first, the offset for the start marker will still be the same and we do not need to recalculate 
        //   the offset for the newly created end node.

        // inject end marker
        this.epubCFI.injectElementAtOffset(
            $(endNode), 
            endOffset,
            $endMarker
        );

        startNode = $endMarker[0].previousSibling;

        // inject start marker
        this.epubCFI.injectElementAtOffset(
            $(startNode), 
            startOffset,
            $startMarker
        );

        // reconstruct range
        highlightRange = document.createRange();
        highlightRange.setStart($startMarker[0].nextSibling, 0);
        highlightRange.setEnd($endMarker[0].previousSibling, $endMarker[0].previousSibling.length - 1);

        return highlightRange;
    },

    injectHighlightsInDifferentNodes : function (selectionRange, id) {

        var startNode = selectionRange.startContainer;
        var startOffset = selectionRange.startOffset;
        var endNode = selectionRange.endContainer;
        var endOffset = selectionRange.endOffset;
        var $startMarker = $(this.getRangeStartMarker("", id));
        var $endMarker = $(this.getRangeEndMarker("", id));
        var highlightRange;

        // inject start
        this.epubCFI.injectElementAtOffset(
            $(startNode), 
            startOffset,
            $startMarker
        );

        // inject end
        this.epubCFI.injectElementAtOffset(
            $(endNode), 
            endOffset,
            $endMarker
        );

        // reconstruct range
        highlightRange = document.createRange();
        highlightRange.setStart($startMarker[0].nextSibling, 0);
        highlightRange.setEnd($endMarker[0].previousSibling, $endMarker[0].previousSibling.length - 1);

        return highlightRange;
    },

    // Rationale: This is a cross-browser method to get the currently selected text
    getCurrentSelectionRange : function () {

        var currentSelection;
        var iframeDocument = this.get("contentDocumentDOM");
        if (iframeDocument.getSelection) {
            currentSelection = iframeDocument.getSelection();

            if (currentSelection.rangeCount) {
                return currentSelection.getRangeAt(0);
            }
        }
        else if (iframeDocument.selection) {
            return iframeDocument.selection.createRange();
        }
        else {
            return undefined;
        }
    },

    getPaginationLeftOffset : function () {

        var $htmlElement = $("html", this.get("contentDocumentDOM"));
        var offsetLeftPixels = $htmlElement.css("left");
        var offsetLeft = parseInt(offsetLeftPixels.replace("px", ""));
        return offsetLeft;
    },

    getBookmarkMarker : function (CFI, id) {

        return "<span class='bookmark-marker cfi-marker' id='" + id + "' data-cfi='" + CFI + "'></span>";
    },

    getRangeStartMarker : function (CFI, id) {

        return "<span class='range-start-marker cfi-marker' id='start-" + id + "' data-cfi='" + CFI + "'></span>";
    },

    getRangeEndMarker : function (CFI, id) {

        return "<span class='range-end-marker cfi-marker' id='end-" + id + "' data-cfi='" + CFI + "'></span>";
    }
});

    EpubAnnotations.Annotations = Backbone.Model.extend({

    defaults : function () {
        return {
            "bookmarkViews" : [],
            "highlights" : [],
            "underlines" : [],
            "imageAnnotations" : [],
            "annotationHash" : {},
            "offsetTopAddition" : 0,
            "offsetLeftAddition" : 0,
            "readerBoundElement" : undefined
        };
    },

    initialize : function (attributes, options) {},

    redrawAnnotations : function (offsetTop, offsetLeft) {

        var that = this;
        // Highlights
        _.each(this.get("highlights"), function (highlightGroup) {
            highlightGroup.resetHighlights(that.get("readerBoundElement"), offsetTop, offsetLeft);
        });  

        // Bookmarks
        _.each(this.get("bookmarkViews"), function (bookmarkView) {
            bookmarkView.resetBookmark(offsetTop, offsetLeft);
        });

        // Underlines
        _.each(this.get("underlines"), function (underlineGroup) {
            underlineGroup.resetUnderlines(that.get("readerBoundElement"), offsetTop, offsetLeft);
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

    getUnderline : function (id) {

        var underline = this.get("annotationHash")[id];
        if (underline) {
            return underline.toInfo();
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

    getUnderlines : function () {

        var underlines = [];
        _.each(this.get("underlines"), function (underline) {

            underlines.push(underline.toInfo());
        });
        return underlines;
    },

    getImageAnnotations : function () {

        var imageAnnotations = [];
        _.each(this.get("imageAnnotations"), function (imageAnnotation) {

            imageAnnotations.push(imageAnnotation.toInfo());
        });
        return imageAnnotations;
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
            id : annotationId.toString(),
            bbPageSetView : this.get("bbPageSetView")
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

        var highlightGroup = new EpubAnnotations.HighlightGroup({
            CFI : CFI,
            selectedNodes : highlightedTextNodes,
            offsetTopAddition : offsetTop,
            offsetLeftAddition : offsetLeft,
            id : annotationId,
            bbPageSetView : this.get("bbPageSetView")
        });
        this.get("annotationHash")[annotationId] = highlightGroup;
        this.get("highlights").push(highlightGroup);
        highlightGroup.renderHighlights(this.get("readerBoundElement"));
    },

    addUnderline : function (CFI, underlinedTextNodes, annotationId, offsetTop, offsetLeft) {

        if (!offsetTop) {
            offsetTop = this.get("offsetTopAddition");
        }
        if (!offsetLeft) {
            offsetLeft = this.get("offsetLeftAddition");
        }

        annotationId = annotationId.toString();
        this.validateAnnotationId(annotationId);

        var underlineGroup = new EpubAnnotations.UnderlineGroup({
            CFI : CFI,
            selectedNodes : underlinedTextNodes,
            offsetTopAddition : offsetTop,
            offsetLeftAddition : offsetLeft,
            id : annotationId,
            bbPageSetView : this.get("bbPageSetView")
        });
        this.get("annotationHash")[annotationId] = underlineGroup;
        this.get("underlines").push(underlineGroup);
        underlineGroup.renderUnderlines(this.get("readerBoundElement"));
    },

    addImageAnnotation : function (CFI, imageNode, annotationId) {

        annotationId = annotationId.toString();
        this.validateAnnotationId(annotationId);

        var imageAnnotation = new EpubAnnotations.ImageAnnotation({
            CFI : CFI,
            imageNode : imageNode,
            id : annotationId,
            bbPageSetView : this.get("bbPageSetView")
        });
        this.get("annotationHash")[annotationId] = imageAnnotation;
        this.get("imageAnnotations").push(imageAnnotation);
        imageAnnotation.render();
    },

    // REFACTORING CANDIDATE: Some kind of hash lookup would be more efficient here, might want to 
    //   change the implementation of the annotations as an array
    validateAnnotationId : function (id) {

        if (this.get("annotationHash")[id]) {
            throw new Error("That annotation id already exists; annotation not added");
        }
    }
});
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
    EpubAnnotations.HighlightView = Backbone.View.extend({

    el : "<div class='highlight'></div>",

    events : {
        "mouseenter" : "highlightEvent",
        "mouseleave" : "highlightEvent",
        "click" : "highlightEvent"
    },

    initialize : function (options) {

        this.highlight = new EpubAnnotations.Highlight({
            CFI : options.CFI,
            top : options.top,
            left : options.left,
            height : options.height,
            width : options.width,
            highlightGroupCallback : options.highlightGroupCallback,
            callbackContext : options.callbackContext
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

    highlightEvent : function (event) {

        event.stopPropagation();
        var highlightGroupCallback = this.highlight.get("highlightGroupCallback");
        var highlightGroupContext = this.highlight.get("callbackContext");
        highlightGroupContext.highlightGroupCallback(event);
    },

    setMouseenterColor : function () {

        this.$el.css({
            "opacity" : "0.4"
        });
    },

    setMouseleaveColor : function () {

        this.$el.css({
            "opacity" : "0.2"
        });
    }
});
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

    var reflowableAnnotations = new EpubAnnotations.ReflowableAnnotations({
        contentDocumentDOM : contentDocumentDOM, 
        bbPageSetView : bbPageSetView
    });

    // Description: The public interface
    return {

        addSelectionHighlight : function (id, type) { 
            return reflowableAnnotations.addSelectionHighlight(id, type); 
        },
        addSelectionBookmark : function (id) { 
            return reflowableAnnotations.addSelectionBookmark(id); 
        },
        addSelectionImageAnnotation : function (id) {
            return reflowableAnnotations.addSelectionImageAnnotation(id);
        },
        addHighlight : function (CFI, id, type) { 
            return reflowableAnnotations.addHighlight(CFI, id, type); 
        },
        addBookmark : function (CFI, id) { 
            return reflowableAnnotations.addBookmark(CFI, id); 
        },
        addImageAnnotation : function (CFI, id) { 
            return reflowableAnnotations.addImageAnnotation(CFI, id); 
        },
        redraw : function () { 
            return reflowableAnnotations.redraw(); 
        },
        getBookmark : function (id) { 
            return reflowableAnnotations.annotations.getBookmark(id); 
        },
        getBookmarks : function () { 
            return reflowableAnnotations.annotations.getBookmarks(); 
        }, 
        getHighlight : function (id) { 
            return reflowableAnnotations.annotations.getHighlight(id); 
        },
        getHighlights : function () { 
            return reflowableAnnotations.annotations.getHighlights(); 
        },
        getUnderline : function (id) { 
            return reflowableAnnotations.annotations.getUnderline(id); 
        },
        getUnderlines : function () { 
            return reflowableAnnotations.annotations.getUnderlines();
        },
        getImageAnnotation : function () {

        },
        getImageAnnotations : function () {

        }
    };
};
