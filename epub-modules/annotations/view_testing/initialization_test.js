var EpubAnnotations = {};
var initializationTest = function (sample) {
    
    if (sample === "1") {

        var spine = [{
                contentDocumentURI : "epub_content/accessible_epub_3/EPUB/ch01.xhtml",
                title : "Chapter 1", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 0
            },
            {
                contentDocumentURI : "epub_content/accessible_epub_3/EPUB/ch01s02.xhtml",
                title : "Chapter 2", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 1 
            },
            {
                contentDocumentURI : "epub_content/accessible_epub_3/EPUB/ch02.xhtml",
                title : "Chapter 3", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 2 
            },
            {
                contentDocumentURI : "epub_content/accessible_epub_3/EPUB/ch02s02.xhtml",
                title : "Chapter 4", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 3 
            },
            {
                contentDocumentURI : "epub_content/accessible_epub_3/EPUB/ch02s03.xhtml",
                title : "Chapter 5", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 4 
            }
        ];

        var viewerSettings = {
            fontSize : 12,
            syntheticLayout : false,
            currentMargin : 3,
            tocVisible : false,
            currentTheme : "default"
        };

        var annotations = [
            {
                cfi : "/2/2/2:1",
                payload : "payload 1",
                callback : undefined,
                callbackContext : undefined
            },
            {
                cfi : "/3/2/3:2",
                payload : "payload 2",
                callback : undefined,
                callbackContext : undefined 
            },
            {
                cfi : "/4/2/2:1",
                payload : "payload 3",
                callback : undefined,
                callbackContext : undefined
            }
        ];

        var bindings = [{
                handler : "figure-gallery-impl",
                media_type : "application/xhtml+xml"
            }
        ];

        var packageDocument = '<?xml version="1.0" encoding="utf-8" standalone="no"?> \
    <package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" \
      xmlns:dcterms="http://purl.org/dc/terms/" version="3.0" xml:lang="en" \
      unique-identifier="pub-identifier"> \
      <metadata> \
      </metadata> \
      <manifest> \
        <item id="htmltoc" properties="nav" media-type="application/xhtml+xml" href="bk01-toc.xhtml"/> \
        <item media-type="text/css" id="epub-css" href="css/epub.css"/> \
        <item media-type="text/css" id="epub-tss-css" href="css/synth.css"/> \
        <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/> \
        <item id="cover-image" properties="cover-image" href="covers/9781449328030_lrg.jpg" media-type="image/jpeg"/> \
        <item id="id-id2442754" href="index.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2632344" href="pr01.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2604743" href="pr01s02.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2629773" href="pr01s03.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2620395" href="pr01s04.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2638681" href="pr01s05.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2611884" href="ch01.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2627310" href="ch01s02.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2635343" href="ch02.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2622654" href="ch02s02.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2624850" href="ch02s03.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2640702" href="ch03.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2641220" href="ch03s02.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2642385" href="ch03s03.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2644001" href="ch03s04.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2644238" href="ch03s05.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2645594" href="ch03s06.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2645682" href="ch04.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id-id2645862" href="co01.xhtml" media-type="application/xhtml+xml"/> \
        <item id="id2670620" href="images/web/epub3_0401.png" media-type="image/png"/> \
        <item id="spi_ad" href="spi-ad.xhtml" media-type="application/xhtml+xml"/> \
        <item id="spi_global_ad" href="images/spi_global_ad.png" media-type="image/png"/> \
        <item id="epub.embedded.font.1" href="fonts/UbuntuMono-B.ttf" media-type="application/vnd.ms-opentype"/> \
        <item id="epub.embedded.font.2" href="fonts/UbuntuMono-BI.ttf" media-type="application/vnd.ms-opentype"/> \
        <item id="epub.embedded.font.3" href="fonts/UbuntuMono-R.ttf" media-type="application/vnd.ms-opentype"/> \
        <item id="epub.embedded.font.4" href="fonts/UbuntuMono-RI.ttf" media-type="application/vnd.ms-opentype"/> \
        <item id="epub.embedded.font.5" href="fonts/FreeSerif.otf" media-type="application/vnd.ms-opentype"/> \
        <item id="epub.embedded.font.6" href="fonts/FreeSansBold.otf" media-type="application/vnd.ms-opentype"/> \
        <item id="pls-en" href="lexicon/en.pls" media-type="application/pls+xml"/> \
        <item id="pls-fr" href="lexicon/fr.pls" media-type="application/pls+xml"/> \
      </manifest> \
      <spine> \
        <itemref idref="cover" linear="no"/> \
        <itemref idref="spi_ad"/> \
        <itemref idref="id-id2442754"/> \
        <itemref idref="htmltoc" linear="yes"/> \
        <itemref idref="id-id2632344"/> \
        <itemref idref="id-id2604743"/> \
        <itemref idref="id-id2629773"/> \
        <itemref idref="id-id2620395"/> \
        <itemref idref="id-id2638681"/> \
        <itemref idref="id-id2611884"/> \
        <itemref idref="id-id2627310"/> \
        <itemref idref="id-id2635343"/> \
        <itemref idref="id-id2622654"/> \
        <itemref idref="id-id2624850"/> \
        <itemref idref="id-id2640702"/> \
        <itemref idref="id-id2641220"/> \
        <itemref idref="id-id2642385"/> \
        <itemref idref="id-id2644001"/> \
        <itemref idref="id-id2644238"/> \
        <itemref idref="id-id2645594"/> \
        <itemref idref="id-id2645682"/> \
        <itemref idref="diffloop"/> \
      </spine> \
    </package>';

        var parser = new window.DOMParser();
        var packDocDOM = parser.parseFromString(packageDocument, "text/xml");

        var epubSpineInfo = {

            spine : spine,
            bindings : bindings, 
            annotations : annotations,
        };

        return new EpubReaderModule(
            $("#reader"),
            epubSpineInfo,
            viewerSettings,
            packDocDOM,
            "lazy"
        );
    }
    else if (sample === "2") {

        var spine = [{
                contentDocumentURI : "epub_content/diffloop/OEBPS/diffloop3.xhtml",
                title : "Chapter 1", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 0
            },
            {
                contentDocumentURI : "epub_content/diffloop/OEBPS/diffloop4.xhtml",
                title : "Chapter 2", 
                firstPageIsOffset : false,
                pageProgressionDirection : "ltr", 
                spineIndex : 1 
            }
        ];

        var viewerSettings = {
            fontSize : 12,
            syntheticLayout : false,
            currentMargin : 3,
            tocVisible : false,
            currentTheme : "default"
        };

        var annotations = [];
        var bindings = [];

        var packageDocument = '<?xml version="1.0" encoding="utf-8" ?> <package xmlns="http://www.idpf.org/2007/opf" version="3.0" xml:lang="en" unique-identifier="pub-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\
<dc:title id="title">The Differential Topology of Loop Spaces </dc:title><meta refines="#title" property="title-type">main</meta>\
<dc:creator id="creator">Andrew Stacey</dc:creator><meta refines="#creator" property="file-as">Andrew Stacey</meta><meta refines="#creator" property="role" scheme="marc:relators">aut</meta><dc:identifier id="pub-id">urn:uuid:577f82c9-a78c-493d-a162-9086930d4451</dc:identifier><meta refines="#pub-id" property="identifier-type" scheme="xsd:string">15</meta><dc:language>en</dc:language><meta property="dcterms:modified">2013-02-11T13:10:00Z</meta><dc:date>2013-02-11</dc:date></metadata>\
<manifest>\
<item href="diffloop1.xhtml" properties="mathml scripted" id="page1" media-type="application/xhtml+xml"/>\
<item id="toc" properties="nav" href="toc.xhtml" media-type="application/xhtml+xml"/>\
<item href="diffloop2.xhtml" properties="mathml scripted" id="page2" media-type="application/xhtml+xml"/>\
<item href="diffloop3.xhtml" properties="mathml scripted" id="page3" media-type="application/xhtml+xml"/>\
<item href="diffloop4.xhtml" properties="mathml scripted" id="page4" media-type="application/xhtml+xml"/>\
<item href="diffloop5.xhtml" properties="mathml scripted" id="page5" media-type="application/xhtml+xml"/>\
<item href="diffloop6.xhtml" properties="mathml scripted" id="page6" media-type="application/xhtml+xml"/>\
<item href="diffloop7.xhtml" properties="mathml scripted" id="page7" media-type="application/xhtml+xml"/>\
<item href="diffloop8.xhtml" properties="mathml scripted" id="page8" media-type="application/xhtml+xml"/>\
<item id="css" href="diffloop.css" media-type="text/css"/>\
<item id="js" href="diffloop.js" media-type="text/javascript"/></manifest>\
<spine><itemref idref="page1"/><itemref idref="page2"/><itemref idref="page3"/><itemref idref="page4"/><itemref idref="page5"/><itemref idref="page6"/><itemref idref="page7"/><itemref idref="page8"/></spine></package>';

        var parser = new window.DOMParser();
        var packDocDOM = parser.parseFromString(packageDocument, "text/xml");

        var epubSpineInfo = {
            spine : spine,
            bindings : bindings, 
            annotations : annotations,
        };

        return new EpubReaderModule(
            $("#reader"),
            epubSpineInfo,
            viewerSettings,
            packDocDOM,
            "lazy"
        );
    }
};