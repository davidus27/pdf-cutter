import * as PDFJS from 'pdfjs-dist';
import * as PDF from './content_functions.js';

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] == "start") {
            PDF.processPDF();
            port.postMessage({"state":"done"});
        }
        else {
            port.postMessage({"title":window.location.href, "pdf":PDF.isPDF()});
        }
    });
});