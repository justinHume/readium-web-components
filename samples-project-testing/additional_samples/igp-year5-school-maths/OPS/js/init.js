$(document).ready(function () {

  $.contextMenu({
    selector: 'body',
    callback : function (key, options) {

      var parentWindow = window.parent;
      var uniqueId = Math.random();

      // Call to have an annotation made
      if (key === "highlight") {
        parentWindow.RJSDemoApp.epubViewer.addSelectionHighlight(uniqueId, "highlight");  
      }
      else if (key === "underline") {
        parentWindow.RJSDemoApp.epubViewer.addSelectionHighlight(uniqueId, "underline");
      }
      else if (key === "imageHotspot") {
        parentWindow.RJSDemoApp.epubViewer.addSelectionImageAnnotation(uniqueId);
      }
      else if (key === "comment") {
        parentWindow.RJSDemoApp.epubViewer.addSelectionBookmark(uniqueId);
      }
    },
    items: {
        "highlight": {name: "Highlight", icon: "edit"},
        "underline": {name: "Underline", icon: "cut"},
        "imageHotspot": {name: "Hotspot", icon: "copy"},
        "comment": {name: "Comment", icon: "paste"}
    }
  });
});