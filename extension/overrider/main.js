
window.addEventListener("load", async () => {
    if (document.querySelector("#form-report")) {
        return;
    }

    console.log("Overrider main loaded");

    const stats = await get_subject_status();
    const config = await get_config();
    intialize_schedule(stats, config);


    await run_tutorials();

    if (config.enable_splitview) {
        // ロードされたのがiframe内である場合実行しない #form-reportが画面内に存在する場合も実行しない
        if (window.self === window.top && !document.querySelector("#form-report")) {
            apply_splitView();
        }
        // apply_splitView();
    }
    if (config.enable_betternotification) {
        loadAndShowIportalNotifications();
    }

    // add comment <!-- network hook injected --> to head
    const comment = document.createComment("network hook. injected by TreeIvy extension");
    document.head.appendChild(comment);
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("overrider/external/network_hook.js");
    (document.head || document.documentElement).appendChild(script);



    window.addEventListener("network-detected", async (event) => {
        if (document.querySelector(".ivy-section"))
            return; // already initialized
        if (event.detail.url.includes("getScheduleCalendar.php")) {
            console.log("LMS schedule update detected, re-initializing schedule");
            await intialize_schedule(stats, config);
        }
    });



});




async function intialize_schedule(stats, config) {
    if (config.useChart) {
        apply_attendance_chart(stats);
    } else {
        apply_attendance_bar(stats);
    }

    if (config.simpleAttendanceView) {
        apply_simpleAttendanceView();
    }
    if (config.compactSchedule) {
        apply_compactSchedule();
    }

    if (config.enable_experimental_mode) {
        calendar_attendance();
    }


    const schedule_div = await waitForElement("#div-top-timetable2 > table");
    // set id
    schedule_div.id = "overrided-schedule";
}