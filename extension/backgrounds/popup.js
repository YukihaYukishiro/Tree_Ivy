toggle_countdown = function() {
    chrome.storage.local.set({countdown: document.getElementById('countdown').checked});
    console.log('countdown:', document.getElementById('countdown').checked);
}

chrome.storage.local.get(['countdown'], function(result) {
    if(result.countdown == true){
        document.getElementById('countdown').checked = true;
    }});
document.getElementById('countdown').addEventListener('change', toggle_countdown);
