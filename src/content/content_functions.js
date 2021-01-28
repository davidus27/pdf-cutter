const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return Boolean(window.MimeTypes || window.PdfNavigator || window.location.href.match(/\.pdf/i));
}

const processPDF = () => {
    // work with the pdf content
    
}

export {isPDF, processPDF};
