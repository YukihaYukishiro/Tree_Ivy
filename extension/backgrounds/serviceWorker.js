// onInstalled event listener
chrome.runtime.onInstalled.addListener((details) => {
    chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/html/patch.html"
    });
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "/html/newuser.html"
        });
    }

});


