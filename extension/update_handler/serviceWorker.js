// onInstalled event listener
chrome.runtime.onInstalled.addListener(async (details) => {
    const config = await chrome.storage.sync.get(null);
    if (config.attend_calendar) {
        chrome.contextMenus.create({
            title: "この科目の出席を確認",
            contexts: ["link"],
            id: "checkAttendance",
            documentUrlPatterns: ["*://portal.iwasaki.ac.jp/lms/"],
            targetUrlPatterns: ["*://portal.iwasaki.ac.jp/lms/class/*/*"]
        });
    }


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


        if (config.urlPatterns === undefined) {
            config.urlPatterns = ["/lms/class/\\d+/"];
        }
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
        if (config.enable_betternotification === undefined) {
            config.enable_betternotification = true;
        }
        chrome.storage.sync.set(config);
    });


});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case 'checkAttendance':
            // Handle the check attendance action
            let class_id = info.linkUrl.split('/')[5];
            class_id = parseInt(class_id, 10); // Convert class_id to an integer
            if (isNaN(class_id)) {
                console.error('Invalid class_id:', info.linkUrl);
                return;
            }
            const response = chrome.tabs.sendMessage(tab.id, {
                action: 'checkAttendance',
                class_id: class_id
            });
            response.then((result) => {
                // console.log('Attendance check response:', result);
            }).catch((error) => {
                console.error('Error checking attendance:', error);
            });
            break;
        default:

    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'enableAttendanceCheck':
            // Enable the attendance check context menu item
            chrome.contextMenus.update("checkAttendance", {
                visible: true
            });
            sendResponse({ status: "enabled" });
            break;
    
        case 'disableAttendanceCheck':
            // Disable the attendance check context menu item
            chrome.contextMenus.update("checkAttendance", {
                visible: false
            });
            sendResponse({ status: "disabled" });
            break;
        default:
            console.warn("Unknown action:", message.action);
            sendResponse({ status: "unknown_action" });
            break;
    }
});