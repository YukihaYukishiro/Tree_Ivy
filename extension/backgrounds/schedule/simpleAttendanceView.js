window.addEventListener("load", loadConfig, false);
function loadConfig() {
    chrome.storage.local.get(['simpleAttendanceView'], function(result) {
        if(result.simpleAttendanceView == true){
            resetAttendanceView();
        }
    });
    
    shift_date_buttons = document.querySelectorAll('.shift-date-button');
    shift_date_buttons.forEach(function(button){
        button.addEventListener("click", resetAttendanceView);
    });
}

function resetAttendanceView() {
    setInterval(loaded, 100);
    async function loaded() {
        addAttendanceHiddenClass();
        setbackground();
    }
}

function addAttendanceHiddenClass() {
    selector = '.div-class-name span';
    spans = document.querySelectorAll(selector);

    //foreach
    spans.forEach(function(span){
        span.classList.add('attendance-hidden');
    });
}

function setbackground() {
    selector = '.div-class-name span';
    spans = document.querySelectorAll(selector);

    //foreach
    spans.forEach(function(span){
        bgColor = span.style.backgroundColor; //rgb
        td = span.closest('td');
        td.style.backgroundColor = bgColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
    });
}
