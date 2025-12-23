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
        reject(new Error(`要素「${selector}」が${timeout}ms以内に見つかりませんでした`));
      }, timeout);
    }
  });
}

function waitForElements(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      return resolve(elements);
    }
    const observer = new MutationObserver(() => {
      const els = document.querySelectorAll(selector);
      if (els.length > 0) {
        observer.disconnect(); 
        resolve(els);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    if (timeout > 0) {
      setTimeout(() => {  
        observer.disconnect();
        reject(new Error(`要素「${selector}」が${timeout}ms以内に見つかりませんでした`));
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
    paragraph.innerHTML = content;
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
