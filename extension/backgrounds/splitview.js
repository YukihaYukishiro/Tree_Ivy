
window.addEventListener('load', (event) => {
    chrome.storage.local.get(['enable_splitview'], function (result) {
        if (!result.enable_splitview) {
            return;
        }

        const splitViewContainer = document.createElement('div');
        splitViewContainer.id = 'splitViewContainer';
        splitViewContainer.classList.add('splitView-closed');
        splitViewContainer.classList.add('splitView-hidden');
        splitViewContainer.setAttribute('history', '[]');

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
        const splitView_header_close = document.createElement('button');
        splitView_header_close.id = 'splitView-header-close';
        splitView_header_close.innerHTML = '<b>✕</b>';
        splitView_header_close.addEventListener('click', (event) => {
            splitViewContainer.classList.add('splitView-hidden');
            splitViewContainer.classList.remove('splitView-open');
            splitViewContainer.classList.add('splitView-closed');
            document.querySelector('body>div.v2-container ').classList.remove('split', 'splitView-exist');

            splitViewContainer.setAttribute('history', '[]');
        });
        const splitView_header_back = document.createElement('button');
        splitView_header_back.id = 'splitView-header-back';
        splitView_header_back.innerHTML = '<b>←</b>';
        splitView_header_back.addEventListener('click', (event) => {
            const history = JSON.parse(splitViewContainer.getAttribute('history'));
            if (history.length === 0) return;
            const url = history.pop();
            splitViewContainer.setAttribute('history', JSON.stringify(history));
            const iframe = splitViewContainer.querySelector('iframe');
            iframe.src = url;

        });


        const splitView_header_filler = document.createElement('div');
        splitView_header_filler.id = 'splitView-header-filler';






        // add elements to the header
        splitView_header.appendChild(splitView_header_toggle);
        splitView_header.appendChild(splitView_header_filler);
        splitView_header.appendChild(splitView_header_back);
        splitView_header.appendChild(splitView_header_close);



        // Create the contents
        const splitView_contents = document.createElement('div');
        splitView_contents.id = 'splitView-body';
        splitView_contents.appendChild(document.createElement('iframe'));



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
            // console.log(clicked);
            //if clicked is not a link or null return
            if (clicked === null) return;
            if (clicked.tagName !== 'A') return;
            //if .T_I_link_target is not clicked return
            if (!clicked.classList.contains('T_I_link_target') && !clicked.id.includes('toportal')) return;

            // get html from the page and open the split view
            const url = clicked.href;
            // console.log(url);
            const iframe = document.createElement('iframe');
            iframe.title = 'splitView';
            iframe.src = url;
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            iframe.addEventListener('load', (event) => {
                // console.log('iframe loaded');
                //五秒間#page_controller > div > div > a.a-quiz-finish-buttonを探す
                const rewriteButton = setInterval(() => {
                    const button = iframe.contentWindow.document.querySelector("a.a-quiz-finish");
                    const button2 = iframe.contentWindow.document.querySelector("body > div > div > div > div > div.col-sm-8 > button");
                    if (button2) {
                        //get class_id and directory_id from session storage
                        const class_id = sessionStorage.getItem('class_id');
                        const directory_id = sessionStorage.getItem('directory_id');;
                        button2.outerHTML = `<a href="https://portal.iwasaki.ac.jp/lms/class/${class_id}/${directory_id}/" modified="true">${button2.outerHTML}</a>`;
                        const clone = button2.cloneNode(true);
                        button2.replaceWith(clone);
                        clearInterval(rewriteButton);
                    }
                    
                    
                    if (!button) return;
                    if (!button.getAttribute('modified')) { 
                        //get class_id and directory_id from session storage
                        const class_id = sessionStorage.getItem('class_id');
                        const directory_id = sessionStorage.getItem('directory_id');
                        button.href = `https://portal.iwasaki.ac.jp/lms/class/${class_id}/${directory_id}/`;
                        button.setAttribute('onclick', ' ');
                        button.setAttribute('modified', 'true');
                        const clone = button.cloneNode(true);
                        button.replaceWith(clone);
                        clearInterval(rewriteButton);
                    }

                }, 100);
                setTimeout(() => { clearInterval(rewriteButton); }, 5000);

                iframe.contentWindow.addEventListener('click', (event) => {
                    // console.log("iframeがクリックされました");
                    // console.log(event.target);

                    // a タグ、あるいは a タグの子孫要素でなければスキップ
                    if (!event.target.closest('a')) return;
                    // console.log("aタグがクリックされました");
                    // a タグの場合
                    const link = event.target.closest('a');
                    // href属性がない場合はスキップ
                    if (!link.href) {
                        return;
                    }
                    // console.log("href属性があります");
                    // リンクに#が含まれている場合はスキップ
                    if (link.href.includes('#')) {
                        return;
                    }
                    // console.log("href属性に#が含まれていません");
                    // 別ウィンドウ、別タブで開くリンクの場合はスキップ
                    if (link.target === '_blank') {
                        return;
                    }
                    // console.log("別ウィンドウ、別タブで開くリンクではありません");
                    // すでにclickイベントリスナーが設定されている場合はスキップ
                    if (link.onclick) {
                        return;
                    }
                    // console.log("clickイベントリスナーが設定されていません");

                    // console.log(link.href);

                    event.preventDefault();

                    var history = JSON.parse(splitViewContainer.getAttribute('history'));
                    history.push(iframe.src);
                    splitViewContainer.setAttribute('history', JSON.stringify(history));
                    // keep the history length to 10
                    if (history.length > 10) {
                        history.shift();
                    }


                    iframe.src = link.href;



                });
            });

            openSplitView(iframe);

            splitViewContainer.setAttribute('history', '[]');


            // prevent the default behavior
            event.preventDefault();

        });

    });
});



async function openSplitView(contents) {
    // get the splitView-body
    const splitView_body = document.querySelector('#splitView-body');
    // add the contents
    splitView_body.children[0].remove();
    splitView_body.appendChild(contents);
    // open the split view
    const splitViewContainer = document.querySelector('#splitViewContainer');
    splitViewContainer.classList.remove('splitView-hidden');
    splitViewContainer.classList.add('splitView-open');
    splitViewContainer.classList.remove('splitView-closed');

    // split つける
    document.querySelector('body>div.v2-container ').classList.add('split');
    document.querySelector('body>div.v2-container ').classList.add('splitView-exist');
}