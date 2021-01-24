
const buttonClicked = (message) => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const message = {txt: "Hello!"};
    const selectBtn = document.querySelector('button');
    selectBtn.addEventListener('click', buttonClicked.bind(this, message));
});