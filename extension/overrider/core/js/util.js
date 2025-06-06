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





function showNotification({ title, content, duration, onRead,onClose }) {
  const box = document.createElement("div");
  box.className = "notification-box";

  // ヘッダー作成
  const header = document.createElement("div");
  header.className = "notification-header";

  const titleElem = document.createElement("span");
  titleElem.textContent = title || "通知";

  let timer = null;
  // タイマーバーコンテナ
  const timerBarContainer = document.createElement("div");
  timerBarContainer.className = "notification-timer-bar-container";

  const timerBar = document.createElement("div");
  timerBar.className = "notification-timer-bar";
  timerBar.style.width = duration ? "100%" : "0%"; // duration無ければバーはなし
  timerBarContainer.appendChild(timerBar);

  // 既読ボタン
  const readButton = document.createElement("button");
  readButton.textContent = "✔";
  readButton.className = "notification-read-button";
  readButton.addEventListener("click", () => {
    if (typeof onRead === "function") {
      onRead();
    }
    if (typeof onClose === "function") {
      onClose();
    }
    hideAndRemove();
  });

  header.appendChild(titleElem);
  header.appendChild(timerBarContainer);
  header.appendChild(readButton);
  box.appendChild(header);

  // ボディ作成
  const body = document.createElement("div");
  body.className = "notification-body";
  if (typeof content === "string") {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    body.appendChild(paragraph);
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  } else {
    body.textContent = "[表示できない内容です]";
  }
  box.appendChild(body);

  // 表示
  document.body.appendChild(box);

  // フェードイン＆スライドイン
  document.body.appendChild(box);
  setTimeout(() => {
    box.classList.add("show");
  }, 10); 


  // タイマー処理（duration指定ありの時だけ）
  if (duration) {
    const interval = 50;
    let remaining = duration;

    timerBar.style.transition = "width 50ms linear";

    timer = setInterval(() => {
      remaining -= interval;
      const percent = Math.max(0, (remaining / duration) * 100);
      timerBar.style.width = percent + "%";

      if (remaining <= 0) {
        if (typeof onClose === "function") {
          onClose();
        }
        hideAndRemove();
      }
    }, interval);
  }

  // 非表示関数
  function hideAndRemove() {
    if (timer) clearInterval(timer);
    box.classList.remove("show");
    // 透明＆右にスライドアウト
    box.style.transition = "opacity 0.6s ease, right 0.6s ease";
    box.style.opacity = "0";
    box.style.right = "-420px";
    setTimeout(() => {
      if (box.parentNode) box.remove();
    }, 600);
  }
}
