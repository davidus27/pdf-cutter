const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return Boolean(window.MimeTypes || window.PdfNavigator || window.location.href.match(/\.pdf/i));
}

const processPDF = () => {
    // work with the pdf content
    
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] == "start") {
            processPDF();
            port.postMessage({"state":"done"});
        }
        else {
            port.postMessage({"title":window.location.href, "pdf":isPDF()});
        }
    });
});