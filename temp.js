fetch("https://portal.iwasaki.ac.jp/lms/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://portal.iwasaki.ac.jp/lms/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "startdate=2024-07-18&enddate=2024-07-24&action=glexa_ajax_schedule_view",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });