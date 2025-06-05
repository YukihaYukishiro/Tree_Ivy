// onInstalled event listener
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == "install") {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "/update_handler/newuser.html"
        });
    }
    if (details.reason == "update" && details.previousVersion !== chrome.runtime.getManifest().version) {
        chrome.tabs.create({
            url: "chrome-extension://" + chrome.runtime.id + "/update_handler/patch.html"
        });
    }
    //     attend_calendar	true
    // compactSchedule	true
    // enable_splitview	true
    // mypage_newtab	true
    // simpleAttendanceView	true
    // if any of these are undefined, set them to true
    chrome.storage.sync.get(null, (config) => {
        if (config.attend_calendar === undefined) {
            config.attend_calendar = true;
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
        chrome.storage.sync.set(config);
    });


});


