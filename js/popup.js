const buttonClicked = (message) => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

const showScreen = (state, name) => {
    const pdfFoundElem = document.querySelector("#pdf-found-div");
    const pdfNotFoundElem = document.querySelector("#pdf-not-found-div");
    if(state) {
        pdfFoundElem.querySelector(".text-center").textContent = `PDF ${name} found`;
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
}

const endLoading = () => {
    const loadingBar = document.querySelector("#loading-bar");
    loadingBar?.remove();
}

const gotMessage = (message, sender, sendResponse) => {
    showScreen(message["pdf"], message["title"]); // switches between screens
    document.querySelector('button').addEventListener('click', buttonClicked.bind(this, message));
    startLoading();
    sendResponse({submit: true});
}
showScreen(false);
chrome.runtime.onMessage.addListener(gotMessage);