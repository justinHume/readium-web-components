EpubReflowable.ReflowableLayout = Backbone.Model.extend({

    initialize: function (options) {

		this.epubCFI = new EpubCFIModule();
    },

    // ------------------------------------------------------------------------------------ //
    //  "PUBLIC" METHODS (THE API)                                                          //
    // ------------------------------------------------------------------------------------ //

    initializeContentDocument : function (epubContentDocument, readiumFlowingContent, linkClickHandler, handlerContext, keydownHandler, bindings) {

        var triggers;

        this.applySwitches(epubContentDocument); 
        this.injectMathJax(epubContentDocument);
        this.injectLinkHandler(epubContentDocument, linkClickHandler, handlerContext);
        triggers = this.parseTriggers(epubContentDocument);
        this.applyTriggers(epubContentDocument, triggers);
        $(epubContentDocument).attr('title');

        this.injectKeydownHandler(
            readiumFlowingContent, 
            keydownHandler, 
            handlerContext
        );
    },

    // ------------------------------------------------------------------------------------ //
    //  PRIVATE HELPERS                                                                     //
    // ------------------------------------------------------------------------------------ //

    applyTriggers: function (epubContentDocument, triggers) {

        for(var i = 0 ; i < triggers.length; i++) {
            triggers[i].subscribe(epubContentDocument.parentNode);
        }
    },

    // Description: For reflowable content we only add what is in the body tag.
    //   Lots of times the triggers are in the head of the dom
    parseTriggers: function (epubContentDocument) {

        var triggers = [];
        $('trigger', epubContentDocument.parentNode).each(function(index, triggerElement) {
            triggers.push(new EpubReflowable.Trigger(triggerElement) );
        });
        
        return triggers;
    },

    // Description: Parse the epub "switch" tags and hide
    //   cases that are not supported
    applySwitches: function (epubContentDocument) {

        // helper method, returns true if a given case node
        // is supported, false otherwise
        var isSupported = function(caseNode) {

            var ns = $(caseNode).attr("required-namespace");
            if(!ns) {
                // the namespace was not specified, that should
                // never happen, we don't support it then
                console.log("Encountered a case statement with no required-namespace");
                return false;
            }
            // all the xmlns's that readium is known to support
            // TODO this is going to require maintanence
            var supportedNamespaces = ["http://www.w3.org/1998/Math/MathML"];
            return _.include(supportedNamespaces, ns);
        };

        $('switch', epubContentDocument.parentNode).each(function(index, switchElement) {
            
            // keep track of whether or not we found one
            var found = false;

            $('case', switchElement).each(function(index, caseElement) {

                if (!found && isSupported(caseElement)) {
                    found = true; // we found the node, don't remove it
                }
                else {
                    $(caseElement).remove(); // remove the node from the dom
                }
            });

            if (found) {
                // if we found a supported case, remove the default
                $('default', switchElement).remove();
            }
        })
    },

    // Description: Inject mathML parsing code into the content document iframe
    injectMathJax : function (epubContentDocument) {

        var script;
        var head;
        head = $("head", epubContentDocument)[0];
        
        // Rationale: If the content doc is SVG there is no head, and thus
        // mathjax will not be required
        if (head) {
            script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
            head.appendChild(script);
        }
    },

    injectLinkHandler: function (epubContentDocument, linkClickHandler, handlerContext) {

        $('a', epubContentDocument).click(function (e) {
            linkClickHandler.call(handlerContext, e);
        });
    },

    injectKeydownHandler : function (epubContentDocument, keydownHandler, handlerContext) {

        $(epubContentDocument).on("keydown", function (e) {
            keydownHandler.call(handlerContext, e);
        });
    }
});