import * as contentFunctions from './content_functions.js'

const addChromeListener = (callbackMessageSent) => {
    chrome.runtime.onConnect.addListener((port) => {
        port.onMessage.addListener((message) => {
            if(message["state"] == "start" && contentFunctions.isPDF()) {
                callbackMessageSent().then((messageSent) => {
                    const message = messageSent ? {"state":"done"} : {"state":"noPageFound"};
                    port.postMessage(message);
                });    
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
            return creator.createNewPDF();
        });
    })
    .catch((err) => {
        console.log(err);
    })