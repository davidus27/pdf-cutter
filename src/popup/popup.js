
const showScreen = (isPDF, title) => {
    document.querySelector("#loading-screen").style.display = "none";

    const pdfFoundElem = document.querySelector("#pdf-found-div");
    const pdfNotFoundElem = document.querySelector("#pdf-not-found-div");
    if(isPDF) {
        pdfFoundElem.querySelector(".text-center").textContent = `PDF ${title} found`;
        pdfFoundElem.style.display = "inline";
        pdfNotFoundElem.style.display = "none";
    } else {
        pdfFoundElem.style.display = "none";
        pdfNotFoundElem.style.display = "inline";
    }
}

const startLoading = () => {
    document.querySelector("#loading-txt").textContent = "Loading...";
    document.querySelector("#loading-screen").style.display = "inline"; // show loading screen
    document.querySelector("#cut-btn").classList.add("disabled"); // disable button
}

const endLoading = () => {
    document.querySelector("#loading-screen").style.display = "none"; // show loading screen
    document.querySelector("#cut-btn").classList.remove("disabled"); // disable button
}

const showPageNotFound = (title) => {
    document.querySelector("#pdf-found-div h1").textContent = `No occurance found in PDF ${title}`;
}

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, {name: "connection"});
    let pageTitle;
    port.postMessage({"state":"init", "pdf":true});
    port.onMessage.addListener((message) => {
        if(message["title"]) pageTitle = message["title"];
        endLoading();
        showScreen(message["pdf"], pageTitle);
        if(message["state"] === "noPageFound") { showPageNotFound(pageTitle);}
    });

    document.querySelector("#cut-btn").addEventListener("click", () => {
        port.postMessage({"state":"start", "pdf":true})
        startLoading();
    });
});