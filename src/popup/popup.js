
const showScreen = (message) => {
    const pdfFoundElem = document.querySelector("#pdf-found-div");
    const pdfNotFoundElem = document.querySelector("#pdf-not-found-div");
    if(message["pdf"]) {
        pdfFoundElem.querySelector(".text-center").textContent = `PDF ${message["title"]} found`;
        pdfFoundElem.style.display = "inline";
        pdfNotFoundElem.style.display = "none";
    } else {
        pdfFoundElem.style.display = "none";
        pdfNotFoundElem.style.display = "inline";
    }
}

const startLoading = () => {
    document.querySelector("#loading-screen").style.display = "inline"; // show loading screen
    document.querySelector("#cut-btn").classList.add("disabled"); // disable button
}

const endLoading = () => {
    document.querySelector("#loading-screen").style.display = "none"; // show loading screen
    document.querySelector("#cut-btn").classList.remove("disabled"); // disable button
}


chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, {name: "connection"});
    port.postMessage({"state":"init"});
    port.onMessage.addListener((message) => {
        //console.log(message);
        if(message["pdf"])
            showScreen(message);
    });

    document.querySelector("#cut-btn").addEventListener("click", () => {
        port.postMessage({"state":"start"})
        startLoading();
        port.onMessage.addListener((message) => {if(message["state"] == "done") endLoading();});
    });
});