// onInstalled event listener
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "newuser.html"
        });
    }
    if (details.reason == "update" && details.previousVersion !== chrome.runtime.getManifest().version) {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "patch.html"
        });
    }

});


