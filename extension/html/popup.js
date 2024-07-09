toggle_countdown = function() {
    chrome.storage.local.set({countdown: document.getElementById('countdown').checked});
}
chrome.storage.local.get(['countdown'], function(result) {
    if(result.countdown == true){
        document.getElementById('countdown').checked = true;
    }});


toggle_monday = function() {
    chrome.storage.local.set({monday: document.getElementById('monday').checked});
}
chrome.storage.local.get(['monday'], function(result) {
    if(result.monday == true){
        document.getElementById('monday').checked = true;
    }});


document.getElementById('countdown').addEventListener('change', toggle_countdown);
document.getElementById('monday').addEventListener('change', toggle_monday);
