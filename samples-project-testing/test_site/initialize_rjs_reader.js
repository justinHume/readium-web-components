RJSDemoApp = {};

RJSDemoApp.setModuleContainerHeight = function () {
    $("#reader").css({ "height" : $(window).height() * 0.87 + "px" });
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

    // Initialize context menu
    RJSDemoApp.initializeContextMenu($("#prevPageBtn"));

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

                RJSDemoApp.epubViewer.on("annotationClicked", function (type, CFI, id, top, left) {

                    RJSDemoApp.annotations.handleAnnotationClick(id, top, left);
                });

                $(window).on("resize", function () {
                    RJSDemoApp.setModuleContainerHeight();
                    RJSDemoApp.epubViewer.resizeContent();
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
            "ATBType" : "externalHotspot",
            "link" : "http://www.amblesideprimary.com/ambleweb/mentalmaths/additiontest.html",
            "description" : "An underline referencing a hotspot for whatever this is"
        },

        "2" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/4[section-opening1]/8[list-glossary1]/8[p26],/3:0,/3:67)",
            "type" : "highlight",
            "ATBType" : "htmlHotspot",
            "embeddedHTML" : '<div id="mw-content-text" lang="en" dir="ltr" class="mw-content-ltr"><table class="metadata plainlinks ambox ambox-content ambox-Unreferenced" style=""><tbody><tr>\
<td class="mbox-image">\
<div style="width: 52px;"><a href="/wiki/File:Question_book-new.svg" class="image"><img alt="Question book-new.svg" src="//upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png" width="50" height="39" srcset="//upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/75px-Question_book-new.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/100px-Question_book-new.svg.png 2x"></a></div>\
</td>\
</tr>\
</tbody></table>\
<p>In <a href="/wiki/Elementary_arithmetic" title="Elementary arithmetic">elementary arithmetic</a> a <b>carry</b> is a <a href="/wiki/Numerical_digit" title="Numerical digit">digit</a> that is transferred from one <a href="/wiki/Column" title="Column">column</a> of digits to another column of more significant digits during a calculation <a href="/wiki/Algorithm" title="Algorithm">algorithm</a>. When used in subtraction the operation is called a <b>borrow</b>. It is a central part of <a href="/wiki/Traditional_mathematics" title="Traditional mathematics">traditional mathematics</a>, but is often omitted from curricula based on <a href="/wiki/Reform_mathematics" title="Reform mathematics">reform mathematics</a>, which do not emphasize any specific method to find a correct answer.</p>\
<div id="toc" class="toc">\
<div id="toctitle">\
<h2>More information:</h2>\
</div>\
<ul>\
<li class="toclevel-1 tocsection-1"><a href="http://en.wikipedia.org/wiki/Carry_(arithmetic)#Manual_arithmetic"><span class="tocnumber">1</span> <span class="toctext">Manual arithmetic</span></a>\
<ul>\
<li class="toclevel-2 tocsection-2"><a href="http://en.wikipedia.org/wiki/Carry_(arithmetic)#Mathematics_education"><span class="tocnumber">1.1</span> <span class="toctext">Mathematics education</span></a></li>\
</ul>\
</li>\
<li class="toclevel-1 tocsection-3"><a href="http://en.wikipedia.org/wiki/Carry_(arithmetic)#Computing"><span class="tocnumber">2</span> <span class="toctext">Computing</span></a></li>\
<li class="toclevel-1 tocsection-4"><a href="http://en.wikipedia.org/wiki/Carry_(arithmetic)#See_also"><span class="tocnumber">3</span> <span class="toctext">See also</span></a></li>\
<li class="toclevel-1 tocsection-5"><a href="http://en.wikipedia.org/wiki/Carry_(arithmetic)#External_links"><span class="tocnumber">4</span> <span class="toctext">External links</span></a></li>\
</div>',
            "description" : "For a carry digit",
            "title" : "Carrying a digit"
        },

        "3" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/4[section-opening1]/6[p4]/1:46)",
            "type" : "bookmark",
            "ATBType" : "comment",
            "content" : "Remember what we went over on Monday: A Concept is a category of things we're going to learn about.",
            "userName" : "Teacher - Classroom 03",
            "description" : "A comment description for what a concept is",
            "title" : "What are concepts?"
        },  

        "4" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/14[linesum4]/2)",
            "type" : "imageAnnotation",
            "ATBType" : "videoHotspot",
            "embeddedVideo" : '<iframe width="640" height="360" src="http://www.youtube.com/embed/GFGlgSfQ-Gk?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>',
            "description" : "The first equation",
            "title" : "Advanced video #1"
        },

        "5" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/18[linesum1]/2)",
            "type" : "imageAnnotation",
            "ATBType" : "videoHotspot",
            "embeddedVideo" : '<iframe width="640" height="360" src="http://www.youtube.com/embed/QLPHsnvDpGs?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>',
            "description" : "The second equation",
            "title" : "Advanced video #2"
        },

        "6" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/10[p5],/1:0,/1:87)",
            "type" : "underline",
            "ATBType" : "externalHotspot",
            "link" : "http://www.mathsisfun.com/whole-numbers.html",
            "description" : "You have already been using whole numbers for awhile"
        },

        "7" : {

            "CFI" : "epubcfi(/6/12!/4/2/2[Lesson1]/10[p5]/1:31)",
            "type" : "bookmark",
            "ATBType" : "comment",
            "content" : "Make sure that you're ready for a small quiz on whole numbers. It'll happen sometime next week!",
            "userName" : "Teacher - Classroom 03",
            "description" : "Definition of whole numbers",
            "title" : "QUIZ!"
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
            return annotations[id];
        },
        handleAnnotationClick : function (id, top, left) {

            // get annotation
            var annotation = this.getAnnotation(id);

            // Check the type of annotation
            if (annotation.ATBType === "videoHotspot") {

                $("#hotspotModalLabel").text(annotation.title);
                $("#hotspotModalBody").html(annotation.embeddedVideo);
                $("#hotspotModal").modal();
                $("#hotspotModal").on("hide", function () {
                    $("#hotspotModalBody").html("");
                });
            }
            else if (annotation.ATBType === "htmlHotspot") {

                $("#hotspotModalLabel").text(annotation.title);
                $("#hotspotModalBody").html(annotation.embeddedHTML);
                $("#hotspotModal").modal();
                $("#hotspotModal").on("hide", function () {
                    $("#hotspotModalBody").html("");
                });
            }
            else if (annotation.ATBType === "externalHotspot") {
                window.open(annotation.link);
            }
            else if (annotation.ATBType === "comment") {

                $("#commentModalLabel").text(annotation.title);
                $(".commentContent").html(annotation.content);
                $(".userNameColor").html(annotation.userName)
                $("#commentModal").modal();
            }
        }
    };
};



