async function run_tutorials() {

    await settings_button_tutorial();
    await ivy_bar_tutorial();

}


async function settings_button_tutorial() {
    // 今までに完了したチュートリアルのIDを取得
    const result = await chrome.storage.sync.get('tutorial_progress');
    const tutorial_progress = result['tutorial_progress'] || [];
    if (!tutorial_progress.includes(1)) {
        tutorial_progress.push(1);
        chrome.storage.sync.set({ tutorial_progress: tutorial_progress });
    } else {
        return; // チュートリアルが完了している場合は何もしない
    }
    //チュートリアル処理
    const tutorialElement = await waitForElement("#header-menu > ul.nav.navbar-nav.navbar-right.gnav.cf > li:nth-child(5) > a");
    if (tutorialElement) {
        const body_html = `
        <style>
        .tutorial-title p{
            margin: 0;
            padding: 0;
            font-size: 14px;
        }
        </style>
        <div class="tutorial-title" >
        <h3>拡張機能の設定</h3>
        <p>ここから拡張機能の設定を変更できます</p>
        <p>設定を変更した後は、ページをリロードしてください</p>
        </div>`;
        await show_tutorial(tutorialElement, body_html, left_offset = 20);
    }

}
async function ivy_bar_tutorial() {
    // 今までに完了したチュートリアルのIDを取得
    const result = await chrome.storage.sync.get('tutorial_progress');
    const tutorial_progress = result['tutorial_progress'] || [];
    if (!tutorial_progress.includes(2)) {
        tutorial_progress.push(2);
        await chrome.storage.sync.set({ tutorial_progress: tutorial_progress });
    } else {
        return; // チュートリアルが完了している場合は何もしない
    }
    const tutorialElement = await waitForElement("div.div-class-name > section > div.ivy-bar");
    if (tutorialElement) {
        const body_html = `
        <style>
        .tutorial-title p{
            margin: 0;
            padding: 0;
            font-size: 14px;
        }
        </style>
        <div class="tutorial-title" >
        <h3>出席状況インディケーター</h3>
        <p>ここで出席状況を確認できます</p>
        <p>各バーにマウスをホバーすると詳細が表示されます</p>
        <!-- gifを表示する -->
        <img src="${chrome.runtime.getURL('images/ivy_bar_hover.gif')}" alt="ivy_bar_tutorial" style="width: 50%; height: auto;">
        </div>`;
        await show_tutorial(tutorialElement, body_html, left_offset = 1, timeout = 10000);
    }

}