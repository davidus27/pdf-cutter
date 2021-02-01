import * as contentFunctions from './content_functions.js'

let creatorInitialization;
let creator;

if(contentFunctions.isPDF()) {
    creator = new contentFunctions.NewDocumentCreator(window.location.href);
    creatorInitialization = creator.initialize();
}

const sendInfoToPopup = (port) => {
    const title = contentFunctions.processTitle(window.location.href);
    port.postMessage({"state":"ready", "title":title, "pdf":contentFunctions.isPDF()});
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] === "init") {
            try {
                creatorInitialization.then(() => { sendInfoToPopup(port);});
            }
            catch {
                sendInfoToPopup(port);
            }
        }
        else if(message["state"] === "start" && contentFunctions.isPDF()) {
            creatorInitialization.then(() => {
                creator.findPages().removeExtraPages();
                creator.createNewPDF().then((pdfProcessed) => {
                    const message = pdfProcessed ? {"state":"done", "pdf":true} : {"state":"noPageFound", "pdf":true};
                    port.postMessage(message);
                });
            });    
        }
    });
})