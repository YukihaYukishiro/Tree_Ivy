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
        smallizeClassroom();
        zoomDivDown();
    }
}

// ------------------------------------------------------- //

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

function smallizeClassroom() {
    parents = document.querySelectorAll('.div-class-name');

    // get div which starts with '教室：'
    parents.forEach(function(parent){
        parent.querySelectorAll('div').forEach(function(div){
            if (div.textContent.startsWith('教室：')) {

                div.classList.remove('text-center');
                div.classList.add('text-right');
                
                // surround text with small tag
                let innerText = div.textContent;

                let small = document.createElement('small');
                small.textContent = "教室 :";
                div.textContent = innerText.slice(3);
                div.prepend(small);
                
            }
        });
    });
}

function zoomDivDown(){
    parents = document.querySelectorAll('.div-class-name');

    parents.forEach(function(parent){
        parent.querySelectorAll('div').forEach(div => {

            // a = button
            const links = div.querySelectorAll('a');
            links.forEach(link => {
                if (link.textContent.includes('Zoom')) {

                    // simplify text
                    div.querySelector('a').innerText = 'Zoom';

                    div.classList.add('zoom');
                }
            });
        });
    });
}