chrome.runtime.onInstalled.addListener((details) => {
    if (!(details.reason === "update" && details.previousVersion === "0.8")) {
        
        return;
    }
    chrome.tabs.create({
        url: "chrome-extension://" + chrome.runtime.id + "/html/patch.html"
      });
});