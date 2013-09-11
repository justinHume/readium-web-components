EPUBcfi.Generator = {

    // ------------------------------------------------------------------------------------ //
    //  "PUBLIC" METHODS (THE API)                                                          //
    // ------------------------------------------------------------------------------------ //

    generateCharOffsetRangeComponent : function (rangeStartElement, startOffset, rangeEndElement, endOffset, classBlacklist, elementBlacklist, idBlacklist) {

        var docRange;
        var commonAncestor;
        var range1OffsetStep;
        var range1CFI;
        var range2OffsetStep;
        var range2CFI;
        var commonCFIComponent;

        this.validateStartTextNode(rangeStartElement);
        this.validateStartTextNode(rangeEndElement);

        // Parent element is the same
        if ($(rangeStartElement).parent()[0] === $(rangeEndElement).parent()[0]) {
            range1OffsetStep = this.createCFITextNodeStep($(rangeStartElement), startOffset, classBlacklist, elementBlacklist, idBlacklist);
            range2OffsetStep = this.createCFITextNodeStep($(rangeEndElement), endOffset, classBlacklist, elementBlacklist, idBlacklist);          
            commonCFIComponent = this.createCFIElementSteps($(rangeStartElement).parent(), "html", classBlacklist, elementBlacklist, idBlacklist);
            return commonCFIComponent.substring(1, commonCFIComponent.length) + "," + range1OffsetStep + "," + range2OffsetStep;
        }
        else {

            // Create a document range to find the common ancestor
            docRange = document.createRange();
            docRange.setStart(rangeStartElement, startOffset);
            docRange.setEnd(rangeEndElement, endOffset);
            commonAncestor = docRange.commonAncestorContainer;

            // Generate terminating offset and range 1
            range1OffsetStep = this.createCFITextNodeStep($(rangeStartElement), startOffset, classBlacklist, elementBlacklist, idBlacklist);
            range1CFI = this.createCFIElementSteps($(rangeStartElement).parent(), commonAncestor, classBlacklist, elementBlacklist, idBlacklist) + range1OffsetStep;

            // Generate terminating offset and range 2
            range2OffsetStep = this.createCFITextNodeStep($(rangeEndElement), endOffset, classBlacklist, elementBlacklist, idBlacklist);
            range2CFI = this.createCFIElementSteps($(rangeEndElement).parent(), commonAncestor, classBlacklist, elementBlacklist, idBlacklist) + range2OffsetStep;

            // Generate shared component
            commonCFIComponent = this.createCFIElementSteps($(commonAncestor), "html", classBlacklist, elementBlacklist, idBlacklist);

            // Return the result
            return commonCFIComponent.substring(1, commonCFIComponent.length) + "," + range1CFI + "," + range2CFI;
        }
    },

    generateElementRangeComponent : function (rangeStartElement, rangeEndElement, classBlacklist, elementBlacklist, idBlacklist) {

        var docRange;
        var commonAncestor;
        var range1CFI;
        var range2CFI;
        var commonCFIComponent;

        this.validateStartElement(rangeStartElement);
        this.validateStartElement(rangeEndElement);

        if (rangeStartElement === rangeEndElement) {
            throw new Error("Start and end element cannot be the same for a CFI range");
        }

        // Create a document range to find the common ancestor
        docRange = document.createRange();
        docRange.setStart(rangeStartElement);
        docRange.setEnd(rangeEndElement);
        commonAncestor = docRange.commonAncestorContainer;

        // Generate range 1
        range1CFI = this.createCFIElementSteps($(rangeStartElement), commonAncestor, classBlacklist, elementBlacklist, idBlacklist);

        // Generate range 2
        range2CFI = this.createCFIElementSteps($(rangeEndElement), commonAncestor, classBlacklist, elementBlacklist, idBlacklist);

        // Generate shared component
        commonCFIComponent = this.createCFIElementSteps($(commonAncestor), "html", classBlacklist, elementBlacklist, idBlacklist);

        // Return the result
        return commonCFIComponent.substring(1, commonCFIComponent.length) + "," + range1CFI + "," + range2CFI;
    },

    // Description: Generates a character offset CFI 
    // Arguments: The text node that contains the offset referenced by the cfi, the offset value, the name of the 
    //   content document that contains the text node, the package document for this EPUB.
    generateCharacterOffsetCFIComponent : function (startTextNode, characterOffset, classBlacklist, elementBlacklist, idBlacklist) {

        var textNodeStep;
        var contentDocCFI;
        var $itemRefStartNode;
        var packageDocCFI;

        this.validateStartTextNode(startTextNode, characterOffset);

        // Create the text node step
        textNodeStep = this.createCFITextNodeStep($(startTextNode), characterOffset, classBlacklist, elementBlacklist, idBlacklist);

        // Call the recursive method to create all the steps up to the head element of the content document (the "html" element)
        contentDocCFI = this.createCFIElementSteps($(startTextNode).parent(), "html", classBlacklist, elementBlacklist, idBlacklist) + textNodeStep;
        return contentDocCFI.substring(1, contentDocCFI.length);
    },

    generateElementCFIComponent : function (startElement, classBlacklist, elementBlacklist, idBlacklist) {

        var contentDocCFI;
        var $itemRefStartNode;
        var packageDocCFI;

        this.validateStartElement(startElement);

        // Call the recursive method to create all the steps up to the head element of the content document (the "html" element)
        contentDocCFI = this.createCFIElementSteps($(startElement), "html", classBlacklist, elementBlacklist, idBlacklist);

        // Remove the ! 
        return contentDocCFI.substring(1, contentDocCFI.length);
    },

    generatePackageDocumentCFIComponent : function (contentDocumentName, packageDocument, classBlacklist, elementBlacklist, idBlacklist) {

        this.validateContentDocumentName(contentDocumentName);
        this.validatePackageDocument(packageDocument, contentDocumentName);

        // Get the start node (itemref element) that references the content document
        $itemRefStartNode = $("itemref[idref='" + contentDocumentName + "']", $(packageDocument));

        // Create the steps up to the top element of the package document (the "package" element)
        packageDocCFIComponent = this.createCFIElementSteps($itemRefStartNode, "package", classBlacklist, elementBlacklist, idBlacklist);

        // Append an !; this assumes that a CFI content document CFI component will be appended at some point
        return packageDocCFIComponent + "!";
    },

    generatePackageDocumentCFIComponentWithSpineIndex : function (spineIndex, packageDocument, classBlacklist, elementBlacklist, idBlacklist) {

        // Get the start node (itemref element) that references the content document
        $itemRefStartNode = $($("spine", packageDocument).children()[spineIndex]);

        // Create the steps up to the top element of the package document (the "package" element)
        packageDocCFIComponent = this.createCFIElementSteps($itemRefStartNode, "package", classBlacklist, elementBlacklist, idBlacklist);

        // Append an !; this assumes that a CFI content document CFI component will be appended at some point
        return packageDocCFIComponent + "!";
    },

    generateCompleteCFI : function (packageDocumentCFIComponent, contentDocumentCFIComponent) {

        return "epubcfi(" + packageDocumentCFIComponent + contentDocumentCFIComponent + ")";  
    },

    // ------------------------------------------------------------------------------------ //
    //  "PRIVATE" HELPERS                                                                   //
    // ------------------------------------------------------------------------------------ //

    validateStartTextNode : function (startTextNode, characterOffset) {
        
        // Check that the text node to start from IS a text node
        if (!startTextNode) {
            throw new EPUBcfi.NodeTypeError(startTextNode, "Cannot generate a character offset from a starting point that is not a text node");
        } else if (startTextNode.nodeType != 3) {
            throw new EPUBcfi.NodeTypeError(startTextNode, "Cannot generate a character offset from a starting point that is not a text node");
        }

        // Check that the character offset is within a valid range for the text node supplied
        if (characterOffset < 0) {
            throw new EPUBcfi.OutOfRangeError(characterOffset, 0, "Character offset cannot be less than 0");
        }
        else if (characterOffset > startTextNode.nodeValue.length) {
            throw new EPUBcfi.OutOfRangeError(characterOffset, startTextNode.nodeValue.length - 1, "character offset cannot be greater than the length of the text node");
        }
    },

    validateStartElement : function (startElement) {

        if (!startElement) {
            throw new EPUBcfi.NodeTypeError(startElement, "CFI target element is undefined");
        }

        if (!(startElement.nodeType && startElement.nodeType === 1)) {
            throw new EPUBcfi.NodeTypeError(startElement, "CFI target element is not an HTML element");
        }
    },

    validateContentDocumentName : function (contentDocumentName) {

        // Check that the idref for the content document has been provided
        if (!contentDocumentName) {
            throw new Error("The idref for the content document, as found in the spine, must be supplied");
        }
    },

    validatePackageDocument : function (packageDocument, contentDocumentName) {
        
        // Check that the package document is non-empty and contains an itemref element for the supplied idref
        if (!packageDocument) {
            throw new Error("A package document must be supplied to generate a CFI");
        }
        else if ($($("itemref[idref='" + contentDocumentName + "']", packageDocument)[0]).length === 0) {
            throw new Error("The idref of the content document could not be found in the spine");
        }
    },

    // Description: Creates a CFI terminating step to a text node, with a character offset
    // REFACTORING CANDIDATE: Some of the parts of this method could be refactored into their own methods
    createCFITextNodeStep : function ($startTextNode, characterOffset, classBlacklist, elementBlacklist, idBlacklist) {

        var $parentNode;
        var $contentsExcludingMarkers;
        var CFIIndex;
        var indexOfTextNode;
        var preAssertion;
        var preAssertionStartIndex;
        var textLength;
        var postAssertion;
        var postAssertionEndIndex;

        // Find text node position in the set of child elements, ignoring any blacklisted elements 
        $parentNode = $startTextNode.parent();
        $contentsExcludingMarkers = EPUBcfi.CFIInstructions.applyBlacklist($parentNode.contents(), classBlacklist, elementBlacklist, idBlacklist);

        // Find the text node index in the parent list, inferring nodes that were originally a single text node
        var prevNodeWasTextNode;
        var indexOfFirstInSequence;
        var textNodeOnlyIndex = 0;
        $.each($contentsExcludingMarkers, 
            function (index) {

                // If this is a text node, check if it matches and return the current index
                if (this.nodeType === Node.TEXT_NODE) {

                    if (this === $startTextNode[0]) {

                        // Set index as the first in the adjacent sequence of text nodes, or as the index of the current node if this 
                        //   node is a standard one sandwiched between two element nodes. 
                        if (prevNodeWasTextNode) {
                            indexOfTextNode = indexOfFirstInSequence;
                        }
                        else {
                            indexOfTextNode = textNodeOnlyIndex;
                        }
                        
                        // Break out of .each loop
                        return false; 
                    }

                    // Save this index as the first in sequence of adjacent text nodes, if it is not already set by this point
                    prevNodeWasTextNode = true;
                    if (!indexOfFirstInSequence) {
                        indexOfFirstInSequence = textNodeOnlyIndex;
                    }

                    textNodeOnlyIndex = textNodeOnlyIndex + 1;
                }
                // This node is not a text node
                else {
                    prevNodeWasTextNode = false;
                    indexOfFirstInSequence = undefined;
                }
            }
        );

        // Convert the text node index to a CFI odd-integer representation
        CFIIndex = (indexOfTextNode * 2) + 1;

        // TODO: text assertions are not in the grammar yet, I think, or they're just causing problems. This has
        //   been temporarily removed. 

        // Add pre- and post- text assertions
        // preAssertionStartIndex = (characterOffset - 3 >= 0) ? characterOffset - 3 : 0;
        // preAssertion = $startTextNode[0].nodeValue.substring(preAssertionStartIndex, characterOffset);

        // textLength = $startTextNode[0].nodeValue.length;
        // postAssertionEndIndex = (characterOffset + 3 <= textLength) ? characterOffset + 3 : textLength;
        // postAssertion = $startTextNode[0].nodeValue.substring(characterOffset, postAssertionEndIndex);

        // Gotta infer the correct character offset, as well

        // Return the constructed CFI text node step
        return "/" + CFIIndex + ":" + characterOffset;
         // + "[" + preAssertion + "," + postAssertion + "]";
    },

    createCFIElementSteps : function ($currNode, topLevelElement, classBlacklist, elementBlacklist, idBlacklist) {

        var $blacklistExcluded;
        var $parentNode;
        var currNodePosition;
        var CFIPosition;
        var idAssertion;
        var elementStep; 

        // Find position of current node in parent list
        $blacklistExcluded = EPUBcfi.CFIInstructions.applyBlacklist($currNode.parent().children(), classBlacklist, elementBlacklist, idBlacklist);
        $.each($blacklistExcluded, 
            function (index, value) {

                if (this === $currNode[0]) {

                    currNodePosition = index;

                    // Break loop
                    return false;
                }
        });

        // Convert position to the CFI even-integer representation
        CFIPosition = (currNodePosition + 1) * 2;

        // Create CFI step with id assertion, if the element has an id
        if ($currNode.attr("id")) {
            elementStep = "/" + CFIPosition + "[" + $currNode.attr("id") + "]";
        }
        else {
            elementStep = "/" + CFIPosition;
        }

        // If a parent is an html element return the (last) step for this content document, otherwise, continue.
        //   Also need to check if the current node is the top-level element. This can occur if the start node is also the
        //   top level element.
        $parentNode = $currNode.parent();
        if ($parentNode.is(topLevelElement) || $currNode.is(topLevelElement)) {
            
            // If the top level node is a type from which an indirection step, add an indirection step character (!)
            // REFACTORING CANDIDATE: It is possible that this should be changed to: if (topLevelElement = 'package') do
            //   not return an indirection character. Every other type of top-level element may require an indirection
            //   step to navigate to, thus requiring that ! is always prepended. 
            if (topLevelElement === 'html') {
                return "!" + elementStep;
            }
            else {
                return elementStep;
            }
        }
        else {
            return this.createCFIElementSteps($parentNode, topLevelElement, classBlacklist, elementBlacklist, idBlacklist) + elementStep;
        }
    }
};