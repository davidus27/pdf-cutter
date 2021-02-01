import * as contentFunctions from './content_functions.js'
import { PDFDocument, PDFName} from 'pdf-lib';

/*
import * as pdfjs from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'; 
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker; 

//pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
*/

const download = (content, mimeType, filename) => {
    const a = document.createElement('a')
    const blob = new Blob([content], {type: mimeType})
    const url = URL.createObjectURL(blob)
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
  }

const test = async (url) => {
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const annotationObject = pdfDoc.context.indirectObjects;//[annotation["generationNumber"]];
    console.log(annotationObject);
    
    pdfDoc.getPages().forEach((page, pageIndex) => {
        page.node.Annots().array?.forEach((annotation, annotationIndex) => {
            const reference = annotationObject.get(annotation).get(PDFName.of("Subtype"));
            if(reference == PDFName.of("Highlight")) {
                console.log("Found highlight on page", pageIndex+1);
            }
        });
    });
}


const loadPdf = async (url) => {
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const documentReferenceObjects = pdfDoc.context.indirectObjects;
    
    pdfDoc.getPages().forEach((page, pageIndex) => {
        page.node.Annots().array?.forEach((annotation) => {
            const reference = documentReferenceObjects.get(annotation).get(PDFName.of("Subtype"));
            if(reference == PDFName.of("Highlight")) {
                console.log("Found highlight on page", pageIndex+1);
            }
        });
    });
    /*
    // code for creating and downloading new pdf file 
    pdfDoc.removePage(1);
    const pdfBytes = await pdfDoc.save();
    const fileName = "lol.pdf";
    download(pdfBytes, "pdf/application", fileName);
    */
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        if(message["state"] == "start" && contentFunctions.isPDF()) {
            loadPdf(window.location.href);
            //contentFunctions.processPDF(pdfjs.getDocument(window.location.href).promise);
            port.postMessage({"state":"done"});
        }
        else {
            port.postMessage({"title":window.location.href, "pdf":contentFunctions.isPDF()});
        }
    });
});