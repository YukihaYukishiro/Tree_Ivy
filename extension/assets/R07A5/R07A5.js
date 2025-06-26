window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);


    let nostudentdata = urlParams.get('nostddata');
    if (!nostudentdata) {
        set_student_info();
    }

    const date_input = document.querySelector('#訪問日');
    date_input.addEventListener('change', function () {
        const selectedDate = date_input.value;
        set_schedule(selectedDate);
    }, false);
    // get パラメーターから訪問日を取得
    let date = urlParams.get('date');
    if (date) {
        set_schedule(date);
        date_input.value = date; // inputの値を更新
    }



}, false);





function set_student_info() {
    fetch('https://portal.iwasaki.ac.jp/portal/api/portalApi.php?type=myclassandnumber').then(response => response.json()).then(data => {
        // {"grade":,"class":"","number":,"name":"","email":""}
        document.querySelector('#クラス').textContent = data.class;
        document.querySelector('#出席番号').textContent = data.number;
        document.querySelector('#氏名').textContent = data.name;
    });

    fetch('https://portal.iwasaki.ac.jp/lms/').then(response => response.text()).then(html => {
        const match = html.match(/<li\s+class=["']user-icon["']>(.*?)<\/li>/);
        if (match) {
            const studentId = match[1].match(/(\d+)/);
            if (studentId) {
                document.querySelector('#学籍番号').textContent = studentId[0].slice(4);
            } else {
                document.querySelector('#学籍番号').textContent = '学籍番号が取得できません';
            }

        }
    });
}

function set_schedule(startDate) {
    get_schedule(startDate).then(schedule => {
        const scheduleElements = document.querySelectorAll('.c21');
        scheduleElements.forEach((element, index) => {
            if (index < schedule.length) {
                element.classList.remove('hidden'); // 非表示を解除
                const [subject, teacher] = schedule[index];
                element.querySelector('td.c20 > p > span').textContent = subject; // 科目名
                element.querySelector('td.c32 > p > span').textContent = teacher; // 教員名
            } else {
                element.querySelector('td.c20 > p > span').textContent = ''; // 科目名をクリア
                element.querySelector('td.c32 > p > span').textContent = ''; // 教員名をクリア
            }
            element.addEventListener('click', function (event) {
                if (event.target.tagName === 'SELECT') return; // select要素のクリックは無視
                if (element.classList.contains('hidden')) {
                    element.classList.remove('hidden'); // 非表示を解除
                }
                else {
                    element.classList.add('hidden'); // 非表示にする
                }
            }, false); // クリックイベントを追加
        });
    });
}


async function get_schedule(startDate) {
    const response = await fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${startDate}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    //  htmlparse the response text
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const result = [];
    const rows = doc.querySelectorAll('table tr');

    rows.forEach(row => {
        const firstTd = row.querySelector('td'); // trの中で最初のtd
        if (!firstTd) return;

        const aTag = firstTd.querySelector('a.blue');
        const teacherName = firstTd.querySelector(' section > div.text-right > small');
        if (aTag) {
            result.push([aTag.textContent.trim(), teacherName.textContent.trim()]);
        }
        else if (firstTd.querySelector("section > div:nth-child(1)")) {
            result.push(result[result.length - 1]); // 前の値をコピー
        }
    });
    return result;
}