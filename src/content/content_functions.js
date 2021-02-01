import { PDFDocument, PDFName} from 'pdf-lib';

const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return Boolean(window.MimeTypes || window.PdfNavigator || window.location.href.match(/\.pdf/i));
}

const processTitle = (title) => {
    return title.split("/").pop().replace("%20", " ");
}

class DocumentCutter {
    constructor(url) {
        this.url = url;
        this.pdfDoc = null;
        this.foundPages = {};
    }

    async initialize() {
        const arrayBuffer = await fetch(this.url).then(res => res.arrayBuffer())
        this.pdfDoc = await PDFDocument.load(arrayBuffer);
        return this;
    }

    static satisifiesRules(references) { 
        // gets Map object of references 
        // returns boolean value if that 
        // page does contain highlighted elements
        return references.get(PDFName.of("Subtype")) === PDFName.of("Highlight");
    }

    findPages() {
        if(!this.pdfDoc) return this;
        const documentReferenceObjects = this.pdfDoc.context.indirectObjects;
        this.pdfDoc.getPages().forEach((page, pageIndex) => {
            for(let annotation of page.node.Annots().array) { // possible undefined problem
                if(DocumentCutter.satisifiesRules(documentReferenceObjects.get(annotation))) {
                    this.foundPages[pageIndex] = true;
                    break;
                }
            }
            /*
            page.node.Annots().array.forEach((annotation) => {
                if(DocumentCutter.satisifiesRules(documentReferenceObjects.get(annotation))) {
                    this.foundPages.push(pageIndex);
                }
            });
            */
        });
        return this;
    }
    
    removeExtraPages() {
        /* TODO: This is not actually removing pages */
        console.log(this.foundPages);
        for(let pageIndex = 0; pageIndex < this.pdfDoc.getPageCount(); pageIndex++) {
            if(!this.foundPages[pageIndex]) {
                console.log("Removed page", pageIndex);
                this.pdfDoc.removePage(pageIndex);
            }
        }
        console.log("Page count:", this.pdfDoc.getPageCount());
        return this;
    }
}

class NewDocumentCreator extends DocumentCutter {
    constructor(url) {
        super(url);
    }

    static download(content, mimeType, filename) {
        const a = document.createElement('a')
        const blob = new Blob([content], {type: mimeType})
        const url = URL.createObjectURL(blob)
        a.setAttribute('href', url)
        a.setAttribute('download', filename)
        a.click()
    }
    
    async createNewPDF(fileName=`New_${processTitle(this.url)}`) {
        const pdfBytes = await this.pdfDoc.save();
        NewDocumentCreator.download(pdfBytes, "pdf/application", fileName);
    }
}


export {isPDF, processTitle, NewDocumentCreator};
