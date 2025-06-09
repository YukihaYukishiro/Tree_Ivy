async function attendanceCheck(class_id) {
	const response = await fetch("https://portal.iwasaki.ac.jp/lms/", {
		"headers": {
			"accept": "*/*",
			"accept-language": "ja,en-US;q=0.9,en;q=0.8",
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"priority": "u=1, i",
			"sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": `https://portal.iwasaki.ac.jp/lms/class/${class_id}`,
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": `class_id=${class_id}&is_ajax=1&action=glexa_modal_entry_form`,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
	if (!response.ok) {
		throw new Error(`Network response was not ok: ${response.statusText}`);
	}
	const data = await response.json();
	if (data.error) {
		throw new Error(`Error from server: ${data.error}`);
	}
	return data;
}

function entry_form(class_id) {
	attendanceCheck(class_id)
		.then(async res => {
			console.log("Attendance check response:", res);
			if (res.data.is_accepted === 0) {
				showNotification({
					title: "出席確認無し",
					content: `該当の授業は有効な出席確認がありませんでした。`,
					duration: 5000
				});
				reject("出席確認無し");
			} else {
				const glexa_modal_entry_form = fetch(`https://portal.iwasaki.ac.jp/lms/?class_id=${class_id}&action=glexa_modal_entry_form&_=${Date.now()}`, {
					"headers": {
						"accept": "*/*",
						"accept-language": "ja,en-US;q=0.9,en;q=0.8",
						"priority": "u=1, i",
						"sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
						"sec-ch-ua-mobile": "?0",
						"sec-ch-ua-platform": "\"Windows\"",
						"sec-fetch-dest": "empty",
						"sec-fetch-mode": "cors",
						"sec-fetch-site": "same-origin",
						"x-requested-with": "XMLHttpRequest"
					},
					"referrer": `https://portal.iwasaki.ac.jp/lms/class/${class_id}`,
					"referrerPolicy": "strict-origin-when-cross-origin",
					"body": null,
					"method": "GET",
					"mode": "cors",
					"credentials": "include"
				});
				// wait 1 second before fetching the entry form
				await new Promise(resolve => setTimeout(resolve, 1000)) // wait for 1 second 
				glexa_modal_entry_form
					.then(response => {
						if (!response.ok) {
							throw new Error(`Network response was not ok: ${response.statusText}`);
						}
						return response.text();
					})
					.then(html => {
						const parser = new DOMParser();
						const doc = parser.parseFromString(html, 'text/html');
						console.log("Parsed document:", doc);
						if (doc) {
							const entryForm = document.createElement('div');
							entryForm.appendChild(doc.querySelector('#form-entry'));
							console.log("Entry form element:", entryForm);
							showNotification({
								title: "出席確認",
								content: entryForm,
								duration: 5000
							});
						} else {
						}
					});
			}
		})
		.catch(error => {
			reject(error);
		});
}



fetch("https://portal.iwasaki.ac.jp/lms/?class_id=8568&action=glexa_modal_entry_form&_=1749440645326", {
	"headers": {
		"accept": "*/*",
		"accept-language": "ja,en-US;q=0.9,en;q=0.8",
		"priority": "u=1, i",
		"sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"x-requested-with": "XMLHttpRequest"
	},
	"referrer": "https://portal.iwasaki.ac.jp/lms/class/8568",
	"referrerPolicy": "strict-origin-when-cross-origin",
	"body": null,
	"method": "GET",
	"mode": "cors",
	"credentials": "include"
});

fetch("https://portal.iwasaki.ac.jp/lms/?action=glexa_modal_entry_form_accept&class_id=8568&directory_id=0&entry_id=43577&uniqid=40f027d60cf26fad11488d21b4bae0c0354742a72aeeebeabeaff1049e62f120&code=aws8409&_=1749440645327", {
	"headers": {
		"accept": "*/*",
		"accept-language": "ja,en-US;q=0.9,en;q=0.8",
		"priority": "u=1, i",
		"sec-ch-ua": "\"Google Chrome\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin",
		"x-requested-with": "XMLHttpRequest"
	},
	"referrer": "https://portal.iwasaki.ac.jp/lms/class/8568",
	"referrerPolicy": "strict-origin-when-cross-origin",
	"body": null,
	"method": "GET",
	"mode": "cors",
	"credentials": "include"
});