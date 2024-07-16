// カウントダウン機能の有効化/無効化
toggle_countdown = function() {
    chrome.storage.local.set({countdown: document.getElementById('countdown').checked});
}
chrome.storage.local.get(['countdown'], function(result) {
    if(result.countdown == true){
        document.getElementById('countdown').checked = true;
    }});

// 月曜始まりの有効化/無効化
toggle_monday = function() {
    chrome.storage.local.set({monday: document.getElementById('monday').checked});
}
chrome.storage.local.get(['monday'], function(result) {
    if(result.monday == true){
        document.getElementById('monday').checked = true;
    }});

// 試験日表示の有効化/無効化（実験的）
toggle_experimental_exam = function() {
    chrome.storage.local.set({experimental_exam: document.getElementById('experimentalexam').checked});
    console.log(chrome.storage.local.get(['experimental_exam']));
}
chrome.storage.local.get(['experimental_exam'], function(result) {
    if(result.experimental_exam == true){
        document.getElementById('experimentalexam').checked = true;
    }});





document.getElementById('countdown').addEventListener('change', toggle_countdown); // カウントダウン機能の有効化/無効化
document.getElementById('monday').addEventListener('change', toggle_monday); // 月曜始まりの有効化/無効化
document.getElementById('experimentalexam').addEventListener('change',toggle_experimental_exam) // 試験日表示の有効化/無効化（実験的）
