async function apply_autoAttendanceCheck() {
    // あとで実装
    // 出席が開いた時の挙動のデータが必要
    const schedule_today = null;
}


async function fetch_today_schedule() {

    const response = await fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${monday_date}`, { credentials: 'include', })
        .then(res => res.text())
        .then(text => new DOMParser().parseFromString(text, "text/html"))



}