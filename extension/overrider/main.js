
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





    buttons = await waitForElement("div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.margin-bottom");
    let isRunning = false;

    async function waitForTimetableUpdate() {
        const target = document.getElementById("div-top-timetable2");
        if (!target) return;

        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                observer.disconnect();
                resolve();
            });

            observer.observe(target, {
                childList: true,
                subtree: true
            });
        });
    }

    buttons.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", async () => {
            if (isRunning) return; // 連打防止
            isRunning = true;

            try {
                await waitForTimetableUpdate();
                await intialize_schedule(stats, config);
            } finally {
                isRunning = false;
            }
        });
    });


    const script = document.createElement("script");
    script.textContent = `
(function () {
    console.log("[hook] injected into page world");

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        console.log("[hook][xhr][open]", method, url);
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("loadend", () => {
            console.log("[hook][xhr][response]", this.responseURL, this.status);
            if (this.responseURL.includes("/lms/")) {
                window.dispatchEvent(new CustomEvent("timetable-updated"));
            }
        });
        return originalSend.apply(this, arguments);
    };
})();
`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();



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
        apply_absenceRequest();
    }


    const schedule_div = await waitForElement("#div-top-timetable2 > table");
    // set id
    schedule_div.id = "overrided-schedule";
}