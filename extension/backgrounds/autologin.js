window.addEventListener('load', (event) => {
    chrome.storage.local.get(['auto_login'],  async function (result) {
        if (result.auto_login == true) {
            const is_login = await fetch("https://portal.iwasaki.ac.jp/lms/", {
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
            if (!is_login.ok) {
                location.href = "https://portal.iwasaki.ac.jp/lms/auth/saml/";
            }
        }
    });
});