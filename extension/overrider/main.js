
window.addEventListener("load", async () => {
    console.log("Overrider main loaded");

    const stats = await get_subject_status();
    const config = await get_config();


    intialize_schedule(stats, config);
    run_tutorials();

    if (config.enable_splitview) {
        apply_splitView();
    }
    if (config.enable_betternotification) {
        loadAndShowIportalNotifications();
    }
    if (config.attend_calendar) {

        // これ未完成ね
        chrome.runtime.sendMessage({
            action: 'enableAttendanceCheck'
        });

    } else {
        chrome.runtime.sendMessage({
            action: 'disableAttendanceCheck'
        });
    }





    buttons = await waitForElement("div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.margin-bottom");
    buttons.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", async () => {
            // Wait until overrided-shedule is gone
            const waiting = await new Promise((resolve) => {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.removedNodes.length > 0) {
                            mutation.removedNodes.forEach((node) => {
                                if (node.id === "overrided-schedule") {
                                    observer.disconnect();
                                    resolve();
                                }
                            });
                        }
                    });
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
            await intialize_schedule(stats, config);
        });
    });

});
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const config = await get_config();
    switch (message.action) {
        case 'checkAttendance':
            if (!config.attend_calendar) {
                console.warn("Attendance check is disabled in the config.");
                sendResponse({ status: "disabled" });
                return;
            } else {
                const class_id = message.class_id;
                if (isNaN(class_id)) {
                    console.error('Invalid class_id:', class_id);
                    sendResponse({ status: "error", message: "Invalid class_id" });
                    return;
                }
                const entry_form = await get_entry_form(class_id);
                console.log("Entry form received:", entry_form);
 


                sendResponse({ status: "success", class_id: class_id });
            }
            break;
        default:
            console.warn("Unknown action received:", message.action);
    }
});



async function intialize_schedule(stats, config) {

    apply_attendance_bar(stats)

    if (config.simpleAttendanceView) {
        apply_simpleAttendanceView();
    }
    if (config.compactSchedule) {
        apply_compactSchedule();
    }

    const schedule_div = await waitForElement("#div-top-timetable2 > table");
    // set id
    schedule_div.id = "overrided-schedule";
}