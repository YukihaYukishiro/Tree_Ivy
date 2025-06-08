window.addEventListener("load", async () => {
    console.log("Overrider main loaded");
    add_settings_link();
    const stats = await get_subject_status();
    const config = await get_config();


    intialize_schedule(stats, config);
    run_tutorials();

    if  (config.enable_splitview) {
        apply_splitView();
    }
    if (config.enable_betternotification) {
        loadAndShowIportalNotifications();
    }
    if (config.attend_calendar) {
        apply_autoAttendanceCheck();
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