// onInstalled event listener
chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "https://yukihayukishiro.github.io/Tree_Ivy/"
        });
        chrome.tabs.create({
            url: "https://yukihayukishiro.github.io/Tree_Ivy/usage.html"
        });
    }
    if (details.reason == "update" && details.previousVersion !== chrome.runtime.getManifest().version) {
        chrome.tabs.create({
            url: "https://yukihayukishiro.github.io/Tree_Ivy/terms.html"
        });

        chrome.tabs.create({
            url: "https://yukihayukishiro.github.io/Tree_Ivy/patch.html"
        });
    }
    chrome.storage.sync.get(null, (config) => {


        if (config.useChart === undefined) {
            config.useChart = false;
        }
        if (config.urlPatterns === undefined) {
            config.urlPatterns = ["/lms/class/\\d+/"];
        }
        if (config.compactSchedule === undefined) {
            config.compactSchedule = true;
        }
        if (config.enable_splitview === undefined) {
            config.enable_splitview = true;
        }
        if (config.mypage_newtab === undefined) {
            config.mypage_newtab = true;
        }
        if (config.simpleAttendanceView === undefined) {
            config.simpleAttendanceView = true;
        }
        if (config.enable_betternotification === undefined) {
            config.enable_betternotification = true;
        }
        if (config.calendarAttendance === undefined) {
            config.calendarAttendance = false;
        }
        // disable experimental mode on update
        config.enable_experimental_mode = false;
        chrome.storage.sync.set(config);
    });


});




