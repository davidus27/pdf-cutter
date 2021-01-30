import * as contentFunctions from './content_functions.js'

import * as pdfjs from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'; 
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker; 

//pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");


chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] == "start" && contentFunctions.isPDF()) {
            console.log(window.location.href);
            contentFunctions.processPDF(pdfjs.getDocument(window.location.href).promise);
            port.postMessage({"state":"done"});
        }
        else {
            port.postMessage({"title":window.location.href, "pdf":contentFunctions.isPDF()});
        }
    });
});