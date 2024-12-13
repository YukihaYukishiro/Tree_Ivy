
window.addEventListener('load', (event) => {
    chrome.storage.local.get(['enable_splitview'], function (result) {
        if (!result.enable_splitview) {
            return;
        }

        const splitViewContainer = document.createElement('div');
        splitViewContainer.id = 'splitViewContainer';
        splitViewContainer.classList.add('splitView-closed');
        splitViewContainer.classList.add('splitView-hidden');

        // Create the header
        const splitView_header = document.createElement('div');
        splitView_header.id = 'splitView-header';
        // close button
        const splitView_header_toggle = document.createElement('button');
        splitView_header_toggle.id = 'splitView-header-toggle';
        splitView_header_toggle.innerHTML = '<b></b>'
        splitView_header_toggle.addEventListener('click', (event) => {
            splitViewContainer.classList.toggle('splitView-open');
            splitViewContainer.classList.toggle('splitView-closed');
            document.querySelector('body>div.v2-container ').classList.toggle('split');

            // // ボタンの中身を変更
            // if (splitViewContainer.classList.contains('splitView-open')) {
            //     splitView_header_toggle.innerHTML = '<b>✕</b>';
            // } else {
            //     splitView_header_toggle.innerHTML = '<b>☰</b>'; // 3本線のアイコン
            // }
        });



        // add elements to the header
        splitView_header.appendChild(splitView_header_toggle);



        // Create the contents
        const splitView_contents = document.createElement('div');
        splitView_contents.id = 'splitView-body';



        // add header to the container
        splitViewContainer.appendChild(splitView_header);
        // add contents to the container
        splitViewContainer.appendChild(splitView_contents);





        // add the container to the body
        document.querySelector("body").appendChild(splitViewContainer);


        window.addEventListener('click', (event) => {
            // if target is b tag use parentElement as target
            var clicked;
            if (event.target.tagName === 'B') {
                clicked = event.target.parentNode;
            } else {
                clicked = event.target;
            }
            console.log(clicked);
            //if clicked is not a link or null return
            if (clicked === null) return;
            if (clicked.tagName !== 'A') return;
            //if .T_I_link_target is not clicked return
            if (!clicked.classList.contains('T_I_link_target')) return;
        
            // get html from the page and open the split view
            const url = clicked.href;
            console.log(url);
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        
        
            const contents = iframe.outerHTML;
        
            openSplitView(contents);
        
        
        
            // prevent the default behavior
            event.preventDefault();
        
        });

    });
});



async function openSplitView(contents) {
    // get the splitView-body
    const splitView_body = document.querySelector('#splitView-body');
    // clear the contents
    splitView_body.innerHTML = '';
    // add the contents
    splitView_body.innerHTML = contents;
    // open the split view
    const splitViewContainer = document.querySelector('#splitViewContainer');
    splitViewContainer.classList.remove('splitView-hidden');
    splitViewContainer.classList.add('splitView-open');
    splitViewContainer.classList.remove('splitView-closed');

    // split つける
    document.querySelector('body>div.v2-container ').classList.add('split');
    document.querySelector('body>div.v2-container ').classList.add('splitView-exist');
}