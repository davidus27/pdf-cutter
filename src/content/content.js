import * as contentFunctions from './content_functions.js'

const creator = new contentFunctions.NewDocumentCreator(window.location.href);
const creatorInitialization = creator.initialize();

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] == "init") {
            creatorInitialization.then(() => {
                const title = contentFunctions.processTitle(window.location.href);
                port.postMessage({"state":"ready", "title":title, "pdf":contentFunctions.isPDF()});
            })
        }
        else if(message["state"] == "start" && contentFunctions.isPDF()) {
            creatorInitialization.then(() => {
                creator.findPages().removeExtraPages();
                creator.createNewPDF().then((pdfProcessed) => {
                    const message = pdfProcessed ? {"state":"done"} : {"state":"noPageFound"};
                    port.postMessage(message);
                })
            });    
        }
    });
})