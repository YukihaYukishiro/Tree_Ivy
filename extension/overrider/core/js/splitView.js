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





async function open_splitView(url, absenceRequest = false) {
    console.log(`Matched pattern for link: ${url}`);
    const body = document.body;
    const v2_container = document.querySelector("body > div.v2-container");

    if (!v2_container) {
        console.warn("v2-container not found!");
        return;
    }

    // 既存の分割ビューを削除
    const existingSplitView = document.getElementById("split-view-container");
    let modifiedWidth;
    if (existingSplitView) {
        // 横幅の指定があれば記録
        modifiedWidth = existingSplitView.style.width;
        existingSplitView.remove();
        v2_container.classList.remove("shrink-left");
    }

    // 分割ビュー本体
    const splitView_container = document.createElement("div");
    splitView_container.id = "split-view-container";
    splitView_container.classList.add("split-view-container");

    // リサイズハンドルを追加
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("split-view-resize-handle");
    splitView_container.appendChild(resizeHandle);

    let isResizing = false;

    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        splitView_container.style.pointerEvents = "none"; // リサイズ中は他の要素のクリックを無効化
        document.body.style.cursor = "ew-resize";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const newWidth = window.innerWidth - e.clientX;
        const minWidth = 300;
        const maxWidth = window.innerWidth - 200;

        if (newWidth > minWidth && newWidth < maxWidth) {
            const splitPercent = (newWidth / window.innerWidth) * 100;
            const v2Percent = 100 - splitPercent;
            splitView_container.style.width = `${splitPercent}%`;
            document.querySelector(".v2-container").style.width = `${v2Percent}%`;
        }
    });

    document.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            splitView_container.style.pointerEvents = "auto"; // リサイズ終了後は他の要素のクリックを有効化
            document.body.style.cursor = "";
        }
    });



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
        // v2_containerのクラスを元に戻す
        v2_container.classList.remove("shrink-left");
        // v2_containerの幅を元に戻す
        v2_container.removeAttribute("style");
    };

    const reloadBtn = document.createElement("button");
    reloadBtn.textContent = "🔄";
    reloadBtn.onclick = () => {
        iframe.contentWindow.location.reload();
    };

    const goToBtn = document.createElement("button");
    goToBtn.textContent = "↗";
    goToBtn.onclick = () => {
        window.location.href = iframe.contentWindow.location.href;
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
        
        // nav1 と nav2 を削除
        const nav1 = iframeDoc.querySelector(".nav1");
        const nav2 = iframeDoc.querySelector(".nav2");
        if (nav1) nav1.remove();
        if (nav2) nav2.remove();


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
    if (modifiedWidth) {
        // 既存の分割ビューの横幅を復元
        splitView_container.style.width = modifiedWidth;
        v2_container.style.width = `calc(100% - ${modifiedWidth})`;
    }
    if (absenceRequest) {
        // 分割ビューの横幅を585pxに設定
        splitView_container.style.width = "585px";
        v2_container.style.width = `calc(100% - 585px)`;
        const style = document.createElement("style");
        style.textContent = `

@media print {
  body * {
    visibility: hidden;
  }
iframe.split-view-iframe {
    visibility: visible;
  }
  iframe.split-view-iframe {
    position: absolute;
    right: 0;
    top: 0;
  }
}
        `;

        const exportButton = document.createElement("button");
        exportButton.textContent = "エクスポート";
        exportButton.className = "export-button";
        buttons.prepend(exportButton);
        title.textContent = "公欠申請書";
        urlDisplay.textContent = "各項目をクリックで編集:時間割クリックで表示切替";
        // to do: エクスポートボタンの処理を追加
        exportButton.addEventListener("click", () => {
            document.head.appendChild(style);
            print();
            document.head.removeChild(style);
        });
    }
}

