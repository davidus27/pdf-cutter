const message = {title: window.document.title};


const isPDF = () => {
    // if window contains one of this it is probably a pdf file
    return window.MimeTypes || window.PdfNavigator || /\.pdf/i.exec(window.location.href);
}

// if url is ending with .pdf
message['pdf'] = isPDF();
console.log("whaayy? ", message);


chrome.runtime.sendMessage(message, (response) => {
    //console.log(response);
});


const gotMessage = (message, sender, sendResponse) => {

}

chrome.runtime.onMessage.addListener(gotMessage);