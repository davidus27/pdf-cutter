const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return Boolean(window.MimeTypes || window.PdfNavigator || window.location.href.match(/\.pdf/i));
}


chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener((message) => {
      port.postMessage({title:window.location.href, pdf:isPDF()});
    });
  });