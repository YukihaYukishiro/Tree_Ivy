
    // countdown
    toggle_countdown = function () {
        chrome.storage.local.set({ countdown: document.getElementById('countdown').checked });
        console.log('countdown:', document.getElementById('countdown').checked);
    }
    chrome.storage.local.get(['countdown'], function (result) {
        if (result.countdown == true) {
            document.getElementById('countdown').checked = true;
        }
    }
    );
    document.getElementById('countdown').addEventListener('change', toggle_countdown);


    // startDay
    /* 
        div id="startDay" class="choice">
        > input type="radio" name="startDay" value="0">
        > input type="radio" name="startDay" value="1">
        > input type="radio" name="startDay" value="2">
    */

    update_startDay = function () {
        let startDay = document.querySelector('input[name="startDay"]:checked').value;
        chrome.storage.local.set({ startDay: startDay });
        console.log('startDay:', startDay);
    }
    chrome.storage.local.get(['startDay'], function (result) {
        console.log('startDay:', result.startDay)
        if (result.startDay != undefined) {
            document.querySelector('input[name="startDay"][value="' + result.startDay + '"]').checked = true;
        } else {
            document.querySelector('input[name="startDay"][value="0"]').checked = true;
        }
    });
    document.querySelectorAll('input[name="startDay"]').forEach(
        input => { input.addEventListener('change', update_startDay); });



    //attend_calendar
    toggle_attend_calendar = function () {
        chrome.storage.local.set({ attend_calendar: document.getElementById('attend_calendar').checked });
        console.log('attend_calendar:', document.getElementById('attend_calendar').checked);
    }
    chrome.storage.local.get(['attend_calendar'], function (result) {
        if (result.attend_calendar == true) {
            document.getElementById('attend_calendar').checked = true;
        }
    });
    document.getElementById('attend_calendar').addEventListener('change', toggle_attend_calendar);

    // simpleAttendanceView
    toggle_simpleAttendanceView = function () {
        let simpleAttendanceView = document.getElementById('simpleAttendanceView').checked;
        chrome.storage.local.set({ simpleAttendanceView: simpleAttendanceView });
        console.log('simpleAttendanceView:', simpleAttendanceView);
    }
    chrome.storage.local.get(['simpleAttendanceView'], function (result) {
        if (result.simpleAttendanceView == true) {
            document.getElementById('simpleAttendanceView').checked = true;
        }
    });
    document.getElementById('simpleAttendanceView').addEventListener('change', toggle_simpleAttendanceView);

    // compactSchedule
    toggle_compactSchedule = function () {
        let compactSchedule = document.getElementById('compactSchedule').checked;
        chrome.storage.local.set({ compactSchedule: compactSchedule });
        console.log('compactSchedule:', compactSchedule);
    }
    chrome.storage.local.get(['compactSchedule'], function (result) {
        if (result.compactSchedule == true) {
            document.getElementById('compactSchedule').checked = true;
        }
    });
    document.getElementById('compactSchedule').addEventListener('change', toggle_compactSchedule);


    //enable_splitview
    toggle_enable_splitview = function () {
        let enable_splitview = document.getElementById('enable_splitview').checked;
        chrome.storage.local.set({ enable_splitview: enable_splitview });
        console.log('enable_splitview:', enable_splitview);
    }
    chrome.storage.local.get(['enable_splitview'], function (result) {
        if (result.enable_splitview == true) {
            document.getElementById('enable_splitview').checked = true;
        }
    });
    document.getElementById('enable_splitview').addEventListener('change', toggle_enable_splitview);

    //mypage_newtab
    toggle_mypage_newtab = function () {
        let mypage_newtab = document.getElementById('mypage_newtab').checked;
        chrome.storage.local.set({ mypage_newtab: mypage_newtab });
        console.log('mypage_newtab:', mypage_newtab);
    }
    chrome.storage.local.get(['mypage_newtab'], function (result) {
        if (result.mypage_newtab == true) {
            document.getElementById('mypage_newtab').checked = true;
        }
    });
    document.getElementById('mypage_newtab').addEventListener('change', toggle_mypage_newtab);





    // experiment

    // auto_login
    toggle_auto_login = function () {
        chrome.storage.local.set({ auto_login: document.getElementById('auto_login').checked });
        console.log('auto_login:', document.getElementById('auto_login').checked);
    }
    chrome.storage.local.get(['auto_login'], function (result) {
        if (result.auto_login == true) {
            document.getElementById('auto_login').checked = true;
        }
    });
    document.getElementById('auto_login').addEventListener('change', toggle_auto_login);


   // show_examdate
    toggle_show_examdate = function () {
        chrome.storage.local.set({ show_examdate: document.getElementById('show_examdate').checked });
        console.log('show_examdate:', document.getElementById('show_examdate').checked);
    }
    chrome.storage.local.get(['show_examdate'], function (result) {
        if (result.show_examdate == true) {
            document.getElementById('show_examdate').checked = true;
        }
    });
    document.getElementById('show_examdate').addEventListener('change', toggle_show_examdate);








