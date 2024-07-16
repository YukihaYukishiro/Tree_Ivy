// countdown

toggle_countdown = function() {
    chrome.storage.local.set({countdown: document.getElementById('countdown').checked});
    console.log('countdown:', document.getElementById('countdown').checked);
}
chrome.storage.local.get(['countdown'], function(result) {
    if(result.countdown == true){
        document.getElementById('countdown').checked = true;
    }});
document.getElementById('countdown').addEventListener('change', toggle_countdown);


// startDay
/* 
    div id="startDay" class="choice">
    > input type="radio" name="startDay" value="0">
    > input type="radio" name="startDay" value="1">
    > input type="radio" name="startDay" value="2">
*/

update_startDay = function() {
    let startDay = document.querySelector('input[name="startDay"]:checked').value;
    chrome.storage.local.set({startDay: startDay});
    console.log('startDay:', startDay);
}
chrome.storage.local.get(['startDay'], function(result) {
    console.log('startDay:', result.startDay)
    if(result.startDay != undefined){
        document.querySelector('input[name="startDay"][value="'+result.startDay+'"]').checked = true;
    }else{
        document.querySelector('input[name="startDay"][value="0"]').checked = true;
    }
    });
document.querySelectorAll('input[name="startDay"]').forEach(
    input => { input.addEventListener('change', update_startDay); });