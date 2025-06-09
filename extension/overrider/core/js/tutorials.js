async function run_tutorials() {
    // 今までに完了したチュートリアルのIDを取得
    const result = await chrome.storage.sync.get('tutorial_progress');
    const tutorial_progress = result['tutorial_progress'] || [];

    // 初めてのチュートリアルであるか（チュートリアルの進捗が空であるか）
    let is_first_tutorial = false;
    if (tutorial_progress.length === 0) {
        is_first_tutorial = true;
    }


    if (!tutorial_progress.includes(1)) {
        // チュートリアルが未完了の場合は、チュートリアルを実行
        await settings_button_tutorial();
        // チュートリアルの完了を記録
        tutorial_progress.push(1);
        chrome.storage.sync.set({ tutorial_progress: tutorial_progress });
    }
    if (!tutorial_progress.includes(2)) {
        // チュートリアルが未完了の場合は、チュートリアルを実行
        await ivy_bar_tutorial();
        // チュートリアルの完了を記録
        tutorial_progress.push(2);
        chrome.storage.sync.set({ tutorial_progress: tutorial_progress });
    }
    if (!tutorial_progress.includes(3)) {
        // チュートリアルが未完了の場合は、チュートリアルを実行
        await notification_tutorial();
        // チュートリアルの完了を記録
        tutorial_progress.push(3);
        chrome.storage.sync.set({ tutorial_progress: tutorial_progress });
    }
    if (is_first_tutorial) {
        let flag = false;
        showNotification({
            title: "チュートリアル完了",
            content: `チュートリアルはこれで完了です！<br>
        設定からいつでも再度チュートリアルを実行できます<br>
        より良いスタログ体験をお楽しみください！`,
            duration: 5000,
            onClose: () => {
                flag = true;
            }
        });
        // チュートリアルが完了するまで待機
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (flag) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
}

function show_tutorial(element, body_html, left_offset = 0, timeout = 5000) {
  return new Promise((resolve) => {

    element.classList.add('tutorial-target');

    const rect = element.getBoundingClientRect();

    // フィルター作成
    const filter = document.createElement('div');
    filter.className = 'tutorial-filter';
    document.body.appendChild(filter);

    // ハイライト作成
    const highlight = document.createElement('div');
    highlight.className = 'tutorial-highlight';
    const { top, left, height, width } = element.getBoundingClientRect()
    highlight.style.top = `${top - 5}px`
    highlight.style.left = `${left - left_offset}px`
    highlight.style.height = `${height + 10}px`
    highlight.style.width = `${width + 10}px`
    document.body.appendChild(highlight);

    // チュートリアルボックス作成
    const tutorial = document.createElement('div');
    tutorial.className = 'tutorial-box';

    // ヘッダー作成
    const header = document.createElement('div');
    header.className = 'tutorial-header';
    header.innerHTML = `
    <span>↑ </span>
      <div class="tutorial-timer-bar-container">
        <div class="tutorial-timer-bar"></div>
      </div>
    <button class="tutorial-close">✖</button>
  `;
    header.querySelector('.tutorial-close').addEventListener('click', () => {
      clearTimeout(out);
      clearInterval(timerInterval);
      highlight.remove();
      filter.remove();
      tutorial.remove();
      element.classList.remove('tutorial-target');
      resolve();
    });
    tutorial.appendChild(header);

    // 本文追加
    const body = document.createElement('div');
    body.className = 'tutorial-body';
    body.innerHTML = body_html;
    tutorial.appendChild(body);

    // 表示位置をelementの下に配置
    tutorial.style.top = `${rect.bottom + window.scrollY + 10}px`;
    tutorial.style.left = `${rect.left + window.scrollX}px`;

    document.body.appendChild(tutorial);


    // ゲージ更新ロジック
    const bar = header.querySelector('.tutorial-timer-bar');
    let startTime = Date.now();
    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.max(0, 100 - (elapsed / timeout) * 100);
      bar.style.width = `${percent}%`;
    }, 50);

    // タイムアウトで終了
    const out = setTimeout(() => {
      clearInterval(timerInterval);
      highlight.remove();
      filter.remove();
      tutorial.remove();
      element.classList.remove('tutorial-target');
      resolve();
    }, timeout);
  });
}



async function settings_button_tutorial() {
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
        <p>デフォルトではほとんどの設定が有効になっています</p>
        <p>要らない場合は任意で停止させてください</p>
        <p>設定を変更した後は、このページをリロードしてください</p>
        </div>`;
        await show_tutorial(tutorialElement, body_html, left_offset = 20, timeout = 5000);
    }

}
async function ivy_bar_tutorial() {
    const tutorialElement = await waitForElement("div.ivy-bar");
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
        await show_tutorial(tutorialElement, body_html, left_offset = 5, timeout = 10000);
    }

}
async function notification_tutorial() {
    let flag = false;
    // フィルター作成
    const filter = document.createElement('div');
    filter.className = 'tutorial-filter';
    document.body.appendChild(filter);
    showNotification({
        title: "チュートリアル",
        content: `
        ここに通知等の情報が表示されます <br>
        拡張機能固有の通知に加え、スタログやIportalの通知も一部ここに通知します`,
        duration: 8000,
        onClose: () => {
            flag = true;
        }
    })
    // チュートリアルが完了するまで待機
    await new Promise((resolve) => {
        const interval = setInterval(() => {
            if (flag) {
                clearInterval(interval);
                filter.remove();
                resolve();
            }
        }, 100);
    });
}