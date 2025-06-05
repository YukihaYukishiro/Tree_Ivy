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
