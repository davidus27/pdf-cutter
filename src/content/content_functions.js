import { console } from 'globalthis/implementation';


const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return Boolean(window.MimeTypes || window.PdfNavigator || window.location.href.match(/\.pdf/i));
}

const processDocument = async (pdf, callbackProcessPage = processPage) => {
    const pageAmount = pdf._pdfInfo.numPages;
    let currentPage;
    let highlightedPages = [];

    for(let currentPageIndex = 1; currentPageIndex <= pageAmount; currentPageIndex++) {
        currentPage = pdf.getPage(currentPageIndex);
        await currentPage
            .then((page) => {
                const hValue = callbackProcessPage(page);
                console.log("Return value:", hValue);
                if(hValue) {
                    highlightedPages.push(currentPage);
                }
            })
            .catch((err) => console.log(err));
    }
    return highlightedPages;
}

const processPage = async (page) => { 
    // returns boolean if currentPage contains highlighted content
    await page.getAnnotations()
        .then((pageAnnotations) => {
            // finds if at least one anotation on page is the Highlight
            //console.log("Page: ", page._pageIndex,pageAnnotations.filter(annotation => annotation.subtype === "Highlight"));
            return pageAnnotations.filter(annotation => annotation.subtype === "Highlight");
            //console.log("Page num.", currentPageIndex, pageAnnotation.subtype, pageAnnotation);
            //if(pageAnnotation.subtype == "Highlight") {
        })
        .catch((err) => {
            console.log("There is a problem with annotation:", err)
            return false;
        });
}


const onFinishDocument = () => {
    // what you want to do after document is processed
}

const processPDF = async (documentPromise, callbackProcessDocument = processDocument, callbackAllDone = onFinishDocument) => {
    // work with the pdf content
    let highlightedPages;
    documentPromise
        .then(async (pdf) => {
            highlightedPages = await callbackProcessDocument(pdf);
            console.log(highlightedPages);
            })
        .catch((err) => {
            console.log("error: ", err);
        });
    callbackAllDone();
}


export {isPDF, processPDF};
