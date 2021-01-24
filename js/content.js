const gotMessage = (message, sender, sendResponse) => {
    alert(message.txt);
}

chrome.runtime.onMessage.addListener(gotMessage);