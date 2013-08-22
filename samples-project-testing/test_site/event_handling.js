RJSDemoApp.applyToolbarHandlers = function () {

    // Prev
    // Remove any existing click handlers
    $("#prevPageBtn").off("click");
    $("#prevPageBtn").on("click", function () {

        if (RJSDemoApp.epub.pageProgressionDirection() === "rtl") {
            RJSDemoApp.epubViewer.nextPage(function () {
                console.log("the page turned");
            });
        }
        else {
            RJSDemoApp.epubViewer.previousPage(function () {
                console.log("the page turned");
            });
        }
    });

    // Next
    // Remove any existing click handlers
    $("#nextPageBtn").off("click");
    $("#nextPageBtn").on("click", function () {

        if (RJSDemoApp.epub.pageProgressionDirection() === "rtl") {
            RJSDemoApp.epubViewer.previousPage(function () {
                console.log("the page turned");
            });
        }
        else {
            RJSDemoApp.epubViewer.nextPage(function () {
                console.log("the page turned");
            });
        }
    });
};

// RJSDemoApp.applyViewerHandlers = function (epubViewer, tocDocument) {

//     epubViewer.off("epubLinkClicked");
//     epubViewer.on("epubLinkClicked", function (e) {
//         RJSDemoApp.epubLinkClicked(e);
//     });

//     $(window).off("resize");
//     $(window).on("resize", function () {
//         RJSDemoApp.setModuleContainerHeight();
//         RJSDemoApp.resizeContent();
//     });
// };

RJSDemoApp.epubLinkClicked = function (e) {

    var href;
    var splitHref;
    var spineIndex;
    e.preventDefault();

    // Check for both href and xlink:href attribute and get value
    if (e.currentTarget.attributes["xlink:href"]) {
        href = e.currentTarget.attributes["xlink:href"].value;
    }
    else {
        href = e.currentTarget.attributes["href"].value;
    }

    // It's a CFI
    if (href.match("epubcfi")) {

        href = href.trim();
        splitHref = href.split("#");
    
        RJSDemoApp.epubViewer.showPageByCFI(splitHref[1], function () {
            console.log("Showed the page using a CFI");
        }, this);        
    }
    // It's a regular id
    else {

        // Get the hash id if it exists
        href = href.trim();
        splitHref = href.split("#");

        spineIndex = RJSDemoApp.epub.getSpineIndexByHref(href);
        if (splitHref[1] === undefined) {      
            RJSDemoApp.epubViewer.showSpineItem(spineIndex, function () {
                console.log("Spine index shown: " + splitHref[0]);
            });
        }
        else {
            RJSDemoApp.epubViewer.showPageByElementId(spineIndex, splitHref[1], function () {
                console.log("Page shown: href: " + splitHref[0] + " & hash id: " + splitHref[1]);
            });
        }
    }
};

RJSDemoApp.resizeContent = function () {
    RJSDemoApp.epubViewer.resizeContent();
};


RJSDemoApp.toggleLayout = function () {

    if (RJSDemoApp.viewerPreferences.syntheticLayout) {
        RJSDemoApp.epubViewer.setSyntheticLayout(false);
        RJSDemoApp.viewerPreferences.syntheticLayout = false;
    }
    else {
        RJSDemoApp.epubViewer.setSyntheticLayout(true);
        RJSDemoApp.viewerPreferences.syntheticLayout = true;
    }
};

