EpubReader.EpubReaderView = Backbone.View.extend({

    pageSetEvents : {
        "contentDocumentLoaded" : false,
        "epubLinkClicked" : true,
        "atNextPage" : false,
        "atPreviousPage" : false,
        "atFirstPage" : false,
        "atLastPage" : false,
        "layoutChanged" : false,
        "displayedContentChanged" : false,
        "annotationClicked" : true
    },

    initialize : function (options) {

        var that = this;
        this.packageDocumentDOM = options.packageDocumentDOM;
        this.reader = new EpubReader.EpubReader({
            spineInfo : $.extend(true, {}, options.spineInfo),
            viewerSettings : $.extend(true, {}, options.viewerSettings),
            parentElement : $(options.readerElement),
            renderStrategy : options.renderStrategy
        });
        // Rationale: Propagate the loaded event after all the content documents are loaded
        this.reader.on("epubLoaded", function () {
            that.trigger("epubLoaded");
            // that.$el.css("opacity", "1");
        }, this);
        this.startPropogatingEvents();

        this.readerBoundElement = options.readerElement;
        this.cfi = new EpubCFIModule();
    },

    render : function () {

        // Set the element that this view will be bound to
        $(this.readerBoundElement).css("opacity", "0");
        this.setElement(this.readerBoundElement);
        this.reader.loadSpineItems();
        return this.el;
    },

    // ------------------------ Public interface ------------------------------------------------------------------------

    showSpineItem : function (spineIndex, callback, callbackContext) {

        var that = this;
        var pagesViewIndex = this.reader.getPagesViewIndex(spineIndex);
        this.$el.css("opacity", "0");
        this.reader.renderPagesView(pagesViewIndex, function () {

            var pagesViewInfo = this.reader.getCurrentPagesViewInfo();

            // If the pages view is fixed
            // REFACTORING CANDIDATE: This will cause a displayedContentChanged event to be triggered twice when another show
            //   method calls this to first load the spine item; Part of this method could be extracted and turned into a 
            //   helper to prevent this.
            if (pagesViewInfo.type === "fixed") {
                pageNumber = that.getPageNumber(pagesViewInfo, spineIndex);
                pagesViewInfo.pagesView.showPageByNumber(pageNumber);
            }
            else {
                pagesViewInfo.pagesView.showPageByNumber(1);    
            }
            
            that.$el.css("opacity", "1");
            callback.call(callbackContext);
        }, this);
    },

    showFirstPage : function (callback, callbackContext) {

        var firstSpineIndexInReadingOrder = this.reader.getFirstSpineIndex();
        this.showSpineItem(firstSpineIndexInReadingOrder, function () {
            callback.call(callbackContext);
        }, this);
    },

    // Rationale: As with the CFI library API, it is up to calling code to ensure that the content document CFI component is
    //   is a reference into the content document pointed to by the supplied spine index. 
    showPageByCFI : function (CFI, callback, callbackContext) {

        // Dereference CFI, get the content document href
        var contentDocHref;
        var spineIndex;
        var pagesView;
        try {
            
            contentDocHref = this.cfi.getContentDocHref(CFI, this.packageDocumentDOM);
            spineIndex = this.reader.findSpineIndex(contentDocHref);
            this.showSpineItem(spineIndex, function () {
                pagesView = this.reader.getCurrentPagesView();
                pagesView.showPageByCFI(CFI);
                callback.call(callbackContext);
            }, this);
        }
        catch (error) {
            throw error; 
        }
    },

    showPageByElementId : function (spineIndex, elementId, callback, callbackContext) { 

        // Rationale: Try to locate the element before switching to a new page view try/catch
        this.showSpineItem(spineIndex, function () {
            this.reader.getCurrentPagesView().showPageByHashFragment(elementId);
            callback.call(callbackContext);
        }, this);
    },

    nextPage : function (callback, callbackContext) {

        var that = this;
        var currentPagesView = this.reader.getCurrentPagesView();

        if (currentPagesView.onLastPage()) {

            if (this.reader.hasNextPagesView()) {

                this.$el.css("opacity", "0");
                this.reader.renderNextPagesView(function () {

                    that.$el.css("opacity", "1");
                    that.trigger("atNextPage");
                    callback.call(callbackContext);
                }, this);
            }
            else {
                this.trigger("atLastPage");
                callback.call(callbackContext);
            }
        }
        else {
            currentPagesView.nextPage();
            if (currentPagesView.onLastPage() && !this.reader.hasNextPagesView()) {
                that.trigger("atLastPage");
            }
        }
    },

    previousPage : function (callback, callbackContext) {

        var that = this;
        var currentPagesView = this.reader.getCurrentPagesView();

        if (currentPagesView.onFirstPage()) {

            if (this.reader.hasPreviousPagesView()) {
                
                this.$el.css("opacity", "0");
                this.reader.renderPreviousPagesView(function () {

                    that.$el.css("opacity", "1");
                    that.trigger("atPreviousPage");
                    callback.call(callbackContext);
                }, this);
            }
            else {
                this.trigger("atFirstPage");
                callback.call(callbackContext);
            }
        }
        else {
            currentPagesView.previousPage();
            if (currentPagesView.onFirstPage() && !this.reader.hasPreviousPagesView()) {
                that.trigger("atFirstPage");
            }
        }
    },

    // REFACTORING CANDIDATE: setFontSize and setMargin can be rolled into the custom
    //   proprety infrastructure at some point
    customize : function (customProperty, styleNameOrCSSObject) {
        var currentView = this.reader.getCurrentPagesView();

        // delegate to font size, margin and theme
        if (customProperty === "fontSize") {
			var fontSize = parseInt(styleNameOrCSSObject);

			currentView.customize(customProperty, fontSize);
			this.reader.get("viewerSettings").fontSize = fontSize;
        }
        else if (customProperty === "margin") {
			var margin = parseInt(styleNameOrCSSObject);

			currentView.customize(customProperty, margin);
			this.reader.get("viewerSettings").currentMargin = margin;
        }
        else {
            currentView.customize(customProperty, styleNameOrCSSObject);
            this.reader.get("viewerSettings")["customStyles"].push({ 
                "customProperty" : customProperty,
                "styleNameOrCSSObject" : styleNameOrCSSObject
            });
        }
    },

    setSyntheticLayout : function (isSynthetic) {

        var currentView = this.reader.getCurrentPagesView();
        currentView.setSyntheticLayout(isSynthetic);
        this.reader.get("viewerSettings").syntheticLayout = isSynthetic;
    },

    getViewerSettings : function () {

        return this.reader.get("viewerSettings");
    },

    attachEventHandler : function (eventName, callback, callbackContext) {

        // Page set events
        if (this.canHandlePageSetEvent(eventName)) {
            this.reader.attachEventHandler(eventName, callback, callbackContext);
        }
        // Reader events
        else {
            this.on(eventName, callback, callbackContext);
        }
    },

    removeEventHandler : function (eventName) {

        // Page set events
        if (this.canHandlePageSetEvent(eventName)) {
            this.reader.removeEventHandler(eventName);
        }
        // Reader events
        else {
            this.off(eventName);
        }
    },

    // ----------------------- Private Helpers -----------------------------------------------------------

    getSpineIndexFromCFI : function (CFI) {

        try {
            var contentDocumentHref = this.cfi.getContentDocHref(CFI, this.packageDocumentDOM);
            var spineIndex = this.reader.findSpineIndex(contentDocumentHref);
            return spineIndex;
        }
        catch (error) {
            throw error;
        }
    },

    getPageNumber : function (fixedPagesViewInfo, spineIndex) {

        var spineIndexes = fixedPagesViewInfo.spineIndexes;
        var pageNumber = undefined;

        _.each(spineIndexes, function (currSpineIndex, index) {

            if (currSpineIndex === spineIndex) {
                pageNumber = index + 1;
                return true;
            }
        });

        return pageNumber;
    },

    canHandlePageSetEvent : function (eventName) {

        if (this.pageSetEvents[eventName] === true) {
            return true;
        }
        else {
            return false;
        }
    },

    // Rationale: The reader is responsible for propagating these events in certain cases
    startPropogatingEvents : function () {

        this.reader.attachEventHandler("atNextPage", function () {
            this.trigger("atNextPage");
        }, this);

        this.reader.attachEventHandler("atPreviousPage", function () {
            this.trigger("atPreviousPage");
        }, this);

        this.reader.attachEventHandler("layoutChanged", function (isSynthetic) {
            this.trigger("layoutChanged", isSynthetic);
        }, this);

        this.reader.attachEventHandler("displayedContentChanged", function () {
            this.trigger("displayedContentChanged");
        }, this);        
    },

    addSelectionHighlight : function (id, type) {

        var contentDocCFIComponent;
        var packageDocCFIComponent;
        var completeCFI;
        var spineIndex;
        var currentViewInfo = this.reader.getCurrentPagesViewInfo();
        spineIndex = currentViewInfo.spineIndexes[0]; // Assumes reflowable
        annotationInfo = currentViewInfo.pagesView.addSelectionHighlight(id, type);

        // Generate a package document cfi component and construct the whole cfi, append
        contentDocCFIComponent = annotationInfo.CFI;
        packageDocCFIComponent = this.cfi.generatePackageDocumentCFIComponentWithSpineIndex(spineIndex, this.packageDocumentDOM);
        completeCFI = this.cfi.generateCompleteCFI(packageDocCFIComponent, contentDocCFIComponent);
        annotationInfo.CFI = completeCFI;

        return annotationInfo;
    },

    addSelectionBookmark : function (id) {

        var contentDocCFIComponent;
        var packageDocCFIComponent;
        var completeCFI;
        var spineIndex;
        var currentViewInfo = this.reader.getCurrentPagesViewInfo();
        spineIndex = currentViewInfo.spineIndexes[0]; // Assumes reflowable
        annotationInfo = currentViewInfo.pagesView.addSelectionBookmark(id);

        // Generate a package document cfi component and construct the whole cfi, append
        contentDocCFIComponent = annotationInfo.CFI;
        packageDocCFIComponent = this.cfi.generatePackageDocumentCFIComponentWithSpineIndex(spineIndex, this.packageDocumentDOM);
        completeCFI = this.cfi.generateCompleteCFI(packageDocCFIComponent, contentDocCFIComponent);
        annotationInfo.CFI = completeCFI;

        return annotationInfo;
    },

    addSelectionImageAnnotation : function (id) {

        var contentDocCFIComponent;
        var packageDocCFIComponent;
        var completeCFI;
        var spineIndex;
        var currentViewInfo = this.reader.getCurrentPagesViewInfo();
        spineIndex = currentViewInfo.spineIndexes[0]; // Assumes reflowable
        annotationInfo = currentViewInfo.pagesView.addSelectionImageAnnotation(id);

        // Generate a package document cfi component and construct the whole cfi, append
        contentDocCFIComponent = annotationInfo.CFI;
        packageDocCFIComponent = this.cfi.generatePackageDocumentCFIComponentWithSpineIndex(spineIndex, this.packageDocumentDOM);
        completeCFI = this.cfi.generateCompleteCFI(packageDocCFIComponent, contentDocCFIComponent);
        annotationInfo.CFI = completeCFI;

        return annotationInfo;
    },

    addHighlight : function (CFI, id, type, callback, callbackContext) {

        var annotationInfo;
        var contentDocSpineIndex = this.getSpineIndexFromCFI(CFI);
        this.reader.getRenderedPagesView(contentDocSpineIndex, function (pagesView) {

            try {
                annotationInfo = pagesView.addHighlight(CFI, id, type);
                callback.call(callbackContext, undefined, contentDocSpineIndex, CFI, annotationInfo);
            }
            catch (error) {
                callback.call(callbackContext, error, undefined, undefined);
            }
        });
    },

    addBookmark : function (CFI, id, callback, callbackContext) {

        var annotationInfo;
        var contentDocSpineIndex = this.getSpineIndexFromCFI(CFI);
        this.reader.getRenderedPagesView(contentDocSpineIndex, function (pagesView) {

            try {
                annotationInfo = pagesView.addBookmark(CFI, id);
                callback.call(callbackContext, undefined, contentDocSpineIndex, CFI, annotationInfo);
            }
            catch (error) {
                callback.call(callbackContext, error, undefined, undefined);
            }
        });
    },

    addImageAnnotation : function (CFI, id, callback, callbackContext) {

        var annotationInfo;
        var contentDocSpineIndex = this.getSpineIndexFromCFI(CFI);
        this.reader.getRenderedPagesView(contentDocSpineIndex, function (pagesView) {

            try {
                annotationInfo = pagesView.addImageAnnotation(CFI, id);
                callback.call(callbackContext, undefined, contentDocSpineIndex, CFI, annotationInfo);
            }
            catch (error) {
                callback.call(callbackContext, error, undefined, undefined);
            }
        });
    },    
});
