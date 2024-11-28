chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "/html/newuser.html"
        });
    }

    
    if (!(details.reason === "update" && details.previousVersion === "0.9")) {

        return;
    }

    chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/html/patch.html"
    });



});