let enabled = false;
chrome.storage.local.get(['mypage_newtab'], function (result) {
    enabled = result;
    console.log('mypage_newtab:', enabled);
});

window.addEventListener('click',async (event) => {
        if(enabled.mypage_newtab){
                        //if hash is not #report return
                        if(window.location.hash != '#report') return;
                        // if not a tag return
                        if (!event.target.closest('a')) return;
                        //if hash is not #report return
                        if(window.location.hash != '#report') return;
                        // if not in the table return
                        if (!event.target.closest('tr.item-row > td > a')) return;
                        console.log('click');
                        
                        event.preventDefault();
                        //open in new tab
                        window.open(event.target.href, '_blank');
        }
}); 