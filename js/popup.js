const processTitle = (title) => {
    return title.split("/").pop().replace("%20", " ");
}

const showScreen = (message) => {
    const pdfFoundElem = document.querySelector("#pdf-found-div");
    const pdfNotFoundElem = document.querySelector("#pdf-not-found-div");
    if(message["pdf"]) {
        const title = processTitle(message["title"]);
        pdfFoundElem.querySelector(".text-center").textContent = `PDF ${title} found`;
        pdfFoundElem.style.display = "inline";
        pdfNotFoundElem.style.display = "none";
    } else {
        pdfFoundElem.style.display = "none";
        pdfNotFoundElem.style.display = "inline";
    }
}

const startLoading = () => {
    const loadingBar = document.createElement("div");
    loadingBar.innerHTML = `span class="visually-hidden">Loading...</span>`;
    loadingBar.setAttribute('id', "loading-bar");
    loadingBar.setAttribute('class', "spinner-border");
    loadingBar.setAttribute("role", "status");
    document.body.appendChild(loadingBar);
}

const endLoading = () => {
    const loadingBar = document.querySelector("#loading-bar");
    loadingBar?.remove();
}


chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id, {name: "connection"});
    port.postMessage({});
    port.onMessage.addListener((message) => {
      showScreen(message);
    });
});