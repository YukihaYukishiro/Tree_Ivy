async function apply_splitView() {
    const urlPatterns = await chrome.storage.sync.get("urlPatterns");
    window.addEventListener("click", (event) => {
        // クリックされた要素,あるいは親要素にリンクが含まれるか
        let target = event.target;
        while (target && target !== document.body) {
            if (target.tagName === "A" && target.href) {
                const href = target.href;
                console.log(`Clicked link: ${href}`);
                // URLパターンにマッチするかチェック
                if (urlPatterns.urlPatterns && urlPatterns.urlPatterns.some(pattern => new RegExp(pattern).test(href))) {
                    open_splitView(href); // マッチした場合の処理
                    event.preventDefault(); // デフォルトのリンク動作を防ぐ
                    return; // マッチしたら処理を終了
                }
            }
            target = target.parentElement; // 親要素へ移動
        }
    });
}





async function open_splitView(url) {
    console.log(`Matched pattern for link: ${url}`);

    const body = document.body;
    const v2_container = document.querySelector("body > div.v2-container");

    if (!v2_container) {
        console.warn("v2-container not found!");
        return;
    }

    // 既存の分割ビューを削除
    const existingSplitView = document.getElementById("split-view-container");
    if (existingSplitView) {
        existingSplitView.remove();
        v2_container.classList.remove("shrink-left");
    }

    // 分割ビュー本体
    const splitView_container = document.createElement("div");
    splitView_container.id = "split-view-container";
    splitView_container.classList.add("split-view-container");



    // ヘッダー（タイトル・URL・ボタン）
    const header = document.createElement("div");
    header.classList.add("split-view-header");

    // infoラッパー（タイトル＆URL）
    const infoWrap = document.createElement("div");
    infoWrap.classList.add("info-wrap");

    const title = document.createElement("div");
    title.classList.add("split-view-title");
    title.textContent = "読み込み中...";

    const urlDisplay = document.createElement("a");
    urlDisplay.classList.add("split-view-url");
    urlDisplay.textContent = url;


    infoWrap.appendChild(title);
    infoWrap.appendChild(urlDisplay);

    // ボタンたち
    const buttons = document.createElement("div");
    buttons.classList.add("split-view-buttons");

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✖";
    closeBtn.onclick = () => {
        splitView_container.remove();
        v2_container.classList.remove("shrink-left");
    };

    const reloadBtn = document.createElement("button");
    reloadBtn.textContent = "🔄";
    reloadBtn.onclick = () => {
        iframe.contentWindow.location.reload();
    };

    const goToBtn = document.createElement("button");
    goToBtn.textContent = "↗";
    goToBtn.onclick = () => {
        window.location.href = url;
    };

    buttons.appendChild(reloadBtn);
    buttons.appendChild(goToBtn);
    buttons.appendChild(closeBtn);

    header.appendChild(infoWrap);
    header.appendChild(buttons);


    // iframe本体
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.classList.add("split-view-iframe");
    iframe.setAttribute("frameborder", "0");

    // iframeの読み込み完了時に、中のリンクをすべて書き換える
    iframe.addEventListener("load", () => {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        title.textContent = iframeDoc.title || "ページタイトル";
        urlDisplay.textContent = iframe.contentWindow.location.href;
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            const updateLinks = () => {
                const links = iframeDoc.querySelectorAll("a");
                links.forEach((link) => {
                    // 既に_blank属性が設定されているリンクは無視
                    if (link.target === "_blank") return;
                    // リンクのhrefが空でない場合のみ処理
                    link.setAttribute("target", "_self");
                });
            };

            // 最初に一回やっておく
            updateLinks();

            // 邪魔なモーダルのボタンをハック
            const hackModalButtons = () => {
                const modal = iframeDoc.querySelector("#div-common-confirm-modal");
                const modal_body = modal.querySelector(".modal-body");
                // bodyに”中断しますか？”のテキストがあるか
                if (modal_body && modal_body.textContent.includes("中断しますか？")) {
                    const confirmButton = modal.querySelector(".btn-common-confirm-modal-yes");
                    if (modal.querySelector("#hacked-confirm-button")) {
                        // 既にハック済みなら何もしない
                        return;
                    }
                    if (confirmButton) {
                        const footer = modal.querySelector(".modal-footer");
                        const newButton = confirmButton.cloneNode(true);
                        newButton.id = "hacked-confirm-button";
                        confirmButton.remove();
                        footer.appendChild(newButton);
                        newButton.addEventListener("click", () => {
                            // クリックされたら、所定のリンクにiフレームを移動
                            // セッションストレージからclass_idを取得
                            const class_id = sessionStorage.getItem("class_id");
                            // directory_idを取得
                            const directory_id = sessionStorage.getItem("directory_id");
                            if (class_id && directory_id) {
                                const newUrl = `https://portal.iwasaki.ac.jp/lms/class/${class_id}/${directory_id}`;
                                iframe.contentWindow.location.href = newUrl;
                            }
                        });

                    }
                }
            }


            // DOMの変化を見張る
            const observer = new MutationObserver((mutations) => {
                updateLinks();
                hackModalButtons();
                // #page_controller > div > div > a を見つけたら
                const pageControllerLink = iframeDoc.querySelector("#page_controller > div > div > a");
                if (pageControllerLink && pageControllerLink.id !== "hacked-page-controller-link") {
                    // 既にハック済みなら何もしない
                    // hrefとonclickイベントを削除
                    pageControllerLink.removeAttribute("href");
                    pageControllerLink.removeAttribute("onclick");
                    // target属性を_selfに設定
                    pageControllerLink.setAttribute("target", "_self");
                    // セッションストレージからclass_idを取得
                    const class_id = sessionStorage.getItem("class_id");
                    // directory_idを取得
                    const directory_id = sessionStorage.getItem("directory_id");
                    if (!class_id || !directory_id) {
                        console.warn("class_id or directory_id is not set in sessionStorage");
                        return;
                    }
                    const newUrl = `https://portal.iwasaki.ac.jp/lms/class/${class_id}/${directory_id}`;
                    // hrefを新しいURLに設定
                    pageControllerLink.href = newUrl;
                    pageControllerLink.id = "hacked-page-controller-link";
                    const newLink = pageControllerLink.cloneNode(true);
                    pageControllerLink.parentNode.replaceChild(newLink, pageControllerLink);
                }
            });

            observer.observe(iframeDoc.body, {
                childList: true,
                subtree: true,
            });
        } catch (e) {
            console.warn("オリジンが違うとアクセスできない(´･ω･`)");
        }

    });



    // 組み立てて追加
    splitView_container.appendChild(header);
    splitView_container.appendChild(iframe);
    body.appendChild(splitView_container);

    // 左を縮める
    v2_container.classList.add("shrink-left");
}

