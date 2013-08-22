RJSDemoApp = {};

RJSDemoApp.setModuleContainerHeight = function () {
    $("#reader").css({ "height" : $(window).height() * 0.98 + "px" });
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

            RJSDemoApp.applyToolbarHandlers();
            RJSDemoApp.annotations = new RJSDemoApp.staticAnnotations();

            // Set a fixed height for the epub viewer container, as a function of the document height
            RJSDemoApp.setModuleContainerHeight();
            RJSDemoApp.epubViewer.on("epubLoaded", function () { 

                RJSDemoApp.epubViewer.showSpineItem(5, function () {
                    RJSDemoApp.epubViewer
                        .customize("reflowable-page-theme", "none")
                        .customize("fontSize", "10");
                    RJSDemoApp.annotations.addAnnotations();
                });
            }, that);
			
            RJSDemoApp.epubViewer.render(0);
        }
    });
};

RJSDemoApp.staticAnnotations = function () {

    var annotations = {

        "1" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/4[section-opening1]/8[list-glossary1]/2[p18],/3:0,/3:23)",
            "type" : "underline",
            "description" : "An underline referencing a hotspot for whatever this is"
        },

        "2" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/4[section-opening1]/8[list-glossary1]/8[p26],/3:0,/3:67)",
            "type" : "highlight",
            "description" : "For a carry digit"
        },

        "3" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/4[section-opening1]/6[p4]/1:46)",
            "type" : "bookmark",
            "description" : "A comment description for what a concept is"
        },  

        "4" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/14[linesum4]/2)",
            "type" : "imageAnnotation",
            "description" : "The first equation"
        },

        "5" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/18[linesum1]/2)",
            "type" : "imageAnnotation",
            "description" : "The second equation"
        },

        "6" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/10[p5],/1:0,/1:87)",
            "type" : "underline",
            "description" : "You have already been using whole numbers for awhile"
        },

        "7" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/10[p5]/1:31)",
            "type" : "bookmark",
            "description" : "Definition of whole numbers"
        }
    };

    return {

        addAnnotations : function () {

            var callback = function () {
                console.log("added annotation");
            };

            _.each(annotations, function (annotation, annotationId) {

                if (annotation.type === "highlight") {
                    RJSDemoApp.epubViewer.addHighlight(annotation.CFI, annotationId, "highlight", callback, this);
                }
                else if (annotation.type === "underline") {
                    RJSDemoApp.epubViewer.addHighlight(annotation.CFI, annotationId, "underline", callback, this);
                }
                else if (annotation.type === "bookmark") {
                    RJSDemoApp.epubViewer.addBookmark(annotation.CFI, annotationId, callback, this);
                }
                else if (annotation.type === "imageAnnotation") {
                    RJSDemoApp.epubViewer.addImageAnnotation(annotation.CFI, annotationId, callback, this);
                }
            });
        },
        showAnnotation : function (id) {

        },
        getAnnotations : function () {

        },
        getAnnotation : function (id) {

        }
    };
};



