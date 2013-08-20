// Taken from https://raw.github.com/readium/readium/master/scripts/epub_reading_system.js

// The epubReadingSystem object provides an interface through which a Scripted Content 
// Document can query information about a User's Reading System.
//
// More information is available [here](http://idpf.org/epub/30/spec/epub30-contentdocs.html#app-epubReadingSystem)

navigator.epubReadingSystem = {
	name: "Readium.js",
	version: "0.0.1",
	layoutStyle: "paginated",

	hasFeature: function(feature, version) {

		// for now all features must be version 1.0 so fail fast if the user has asked for something else
		if(version && version !== "1.0") {
			return false;
		}

		if(feature === "dom-manipulation") {
			// Scripts may make structural changes to the document’s DOM (applies to spine-level scripting only).
			return true;	
		} 
		if(feature === "layout-changes") {
			// Scripts may modify attributes and CSS styles that affect content layout (applies to spine-level scripting only).
			return true;
		}	
		if(feature === "touch-events") {
			// The device supports touch events and the Reading System passes touch events to the content.
			return false;
		}
		if(feature === "mouse-events") {
			// The device supports mouse events and the Reading System passes mouse events to the content.
			return true;
		}
		if(feature === "keyboard-events") {
			// The device supports keyboard events and the Reading System passes keyboard events to the content.
			return true;
		}	
		if(feature === "spine-scripting") {
			//Spine-level scripting is supported.
			return true;
		}

		return false;

	}
}