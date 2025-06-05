// Fetchを使ってステータスコードを表示する関数
async function fetchAndDisplayStatus() {
  try {
      const response = await fetch("https://portal.iwasaki.ac.jp/lms/", {
        "headers": {
          "accept": "*/*",
          "accept-language": "ja,en-US;q=0.9,en;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://portal.iwasaki.ac.jp/lms/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "action=glexa_ajax_notify_view",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
      console.log(`ステータスコード: ${response.status}`);
      if (response.ok) {
          console.log("成功しました！データを取得できました。");
      } else {
          console.log("エラーが発生しました。");
      }
  } catch (error) {
      console.error("エラー:", error);
  }
}

// 使い方
fetchAndDisplayStatus();
