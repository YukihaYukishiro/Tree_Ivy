function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (timeout > 0) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`要素「${selector}」が${timeout}ms以内に見つからなかったよ〜💦`));
      }, timeout);
    }
  });
}


function get_config() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        console.error("設定の取得に失敗しました:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(items);
      }
    });
  });
}




function show_tutorial(element, body_html, left_offset = 0, timeout = 5000) {
  function hide_tutorial(resolve) {
    document.querySelectorAll('.tutorial-filter, .tutorial-box, .tutorial-highlight').forEach(el => el.remove());
    document.querySelectorAll('.tutorial-target').forEach(el => el.classList.remove('tutorial-target'));
    if (resolve) {
      resolve(true);
    }
  }
  // 前のチュートリアルがあれば消す
  hide_tutorial();

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
      hide_tutorial(resolve);
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
    setTimeout(() => {
      clearInterval(timerInterval);
      hide_tutorial(resolve);
    }, timeout);
  });
}

