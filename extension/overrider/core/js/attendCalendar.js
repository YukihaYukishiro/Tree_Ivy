async function apply_autoAttendanceCheck() {


}

async function get_today() {
	const schedule_div = await waitForElement("div.table-responsive.other-class.other-class-student-view");
	const dates = schedule_div.querySelectorAll(".top-timetable-table > tbody > tr > td");
	const today = new Date();
	// yyyy-mm-dd
	const today_text = today.toISOString().split('T')[0];
	let today_index = -1;
	for (let i = 0; i < dates.length; i++) {
		const date_a = dates[i].querySelector("a");
		// if href includes today_text
		if (date_a && date_a.href.includes(today_text)) {
			today_index = i;
			break;
		}
	}
	if (today_index === -1) {
		throw new Error("今日の日付が見つかりませんでした");
	}
	today_index = 0
	let today_subjects = [];
	let time_table = await waitForElements("#overrided-schedule > tbody > tr");
	time_table.forEach((tr) => {
		const td = tr.querySelectorAll("td");
		if (td[today_index].querySelector(".ivy-section")) {
			today_subjects.push(td[today_index].querySelector(".ivy-section").getAttribute("data-class-id"));
		}
	});
	return today_subjects;
}



// フォーム送信関数
// glexa.ajaxForm({
// 	form: '#form-entry',
// 	method: 'get',
// 	onSuccess: function() {
// 		glexa.closeRemoteModal();
// 		glexa.alert('出席を受け付けました');
// 		isClassEntryOpened = false;
// 	}
// });