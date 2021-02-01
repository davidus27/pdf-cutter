import * as contentFunctions from './content_functions.js'

const addChromeListener = (callbackMessageSent) => {
    console.log("Done");
    chrome.runtime.onConnect.addListener((port) => {
        port.onMessage.addListener((message) => {
            if(message["state"] == "start" && contentFunctions.isPDF()) {
                callbackMessageSent();
                port.postMessage({"state":"done"});
            }
            else {
                const title = contentFunctions.processTitle(window.location.href);
                port.postMessage({"title":title, "pdf":contentFunctions.isPDF()});
            }
        });
    })
}

const creator = new contentFunctions.NewDocumentCreator(window.location.href);
creator.initialize()
    .then(() => {
        addChromeListener(() => {
            creator.findPages().removeExtraPages();
            creator.createNewPDF();
        });
    })
    .catch((err) => {
        console.log(err)
    })