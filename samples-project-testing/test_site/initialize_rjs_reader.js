RJSDemoApp = {};

RJSDemoApp.setModuleContainerHeight = function () {
    $("#reader").css({ "height" : $(window).height() * 0.85 + "px" });
};

RJSDemoApp.parseXMLFromDOM = function (data) {
    var serializer = new XMLSerializer();
    var packageDocumentXML = serializer.serializeToString(data);
    return packageDocumentXML;
};

// This function will retrieve a package document and load an EPUB
RJSDemoApp.loadAndRenderEpub = function (packageDocumentURL, viewerPreferences) {

    var that = this;

    // Clear the viewer, if it has been defined -> to load a new epub
    RJSDemoApp.epubViewer = undefined;

    // Get the package document and load the modules
    $.ajax({
        url : packageDocumentURL,
        success : function (result) {

            // Get the HTML element to bind the module reader to
            var elementToBindReaderTo = $("#reader")[0];
            $(elementToBindReaderTo).html("");

            if (result.nodeType) {
                result = RJSDemoApp.parseXMLFromDOM(result);
            }

            // THE MOST IMPORTANT PART - INITIALIZING THE SIMPLE RWC MODEL
            var packageDocumentXML = result;
            RJSDemoApp.epubParser = new EpubParserModule(packageDocumentURL, packageDocumentXML);
            var packageDocumentObject = RJSDemoApp.epubParser.parse();
            RJSDemoApp.epub = new EpubModule(packageDocumentObject, packageDocumentXML);
            var spineInfo = RJSDemoApp.epub.getSpineInfo();

            RJSDemoApp.epubViewer = new EpubReaderModule(
                elementToBindReaderTo, spineInfo, viewerPreferences, RJSDemoApp.epub.getPackageDocumentDOM(), "lazy"
            );

            // RJSDemoApp.applyToolbarHandlers();

            // Set a fixed height for the epub viewer container, as a function of the document height
            RJSDemoApp.setModuleContainerHeight();
            RJSDemoApp.epubViewer.on("epubLoaded", function () { 
                RJSDemoApp.epubViewer.showFirstPage(function () {
                    console.log("showed first spine item"); 
                });
            }, that);
			
            RJSDemoApp.epubViewer.render(0);
        }
    });
};