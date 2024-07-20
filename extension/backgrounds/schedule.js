let mypage;


// to do
// イベント欄のずれの対応


window.addEventListener("load", get_sabotage, false);
window.addEventListener("load", function () {

    const origin_table = document.querySelector(".other-class-student-view");
    document.getElementById("div-top-timetable2").remove();

    const overrided_table = document.createElement("div");
    origin_table.insertBefore(overrided_table, origin_table.children[1]);

    overrided_table.id = "tree_ivy_overrided_table";
    const loading = document.createElement("div");
    loading.classList.add("loading");
    loading.innerText = "Loading...";
    overrided_table.appendChild(loading);
    


    chrome.storage.local.get(['startDay'], function (result) {
        window.localStorage.setItem("date_now", new Date());
        window.localStorage.setItem("startday", new Date());
    
        if (result.startDay == 1) {
            var monday = new Date();
            var day = monday.getDay();
            var diff = monday.getDate() - day + (day == 0 ? -6 : 1);
            monday = new Date(monday.setDate(diff));
            window.localStorage.setItem("date_now", monday);
            window.localStorage.setItem("startday", monday);
        } else if (result.startDay == 2) {
            var sunday = new Date();
            var day = sunday.getDay();
            var diff = sunday.getDate() - day;
            sunday = new Date(sunday.setDate(diff));
            window.localStorage.setItem("date_now", sunday);
            window.localStorage.setItem("startday", sunday);
        }
        update_shedule_header(new Date(window.localStorage.getItem("date_now")));
    
    });
    startDay_init();
    override_buttons();

}, false);





function get_sabotage(e) {
    //要素を取得する処理
    let content;
    fetch("https://portal.iwasaki.ac.jp/portal/lmsinc/mySubjectStatus.php", {
        credentials: 'include',
    })
        .then(res => res.text())
        .then(text => new DOMParser().parseFromString(text, "text/html"))
        .then(content => {
            content = content.getElementsByTagName("body")[0];
            content = content.children[0];

            content = content.children[2];

            // 取得したコンテンツを使って何かしらの処理を行うことができる

            var sabotage = {}
            for (let k = 0; k < content.children.length; k++) {
                const tr_content = content.children[k];
                const class_sum = parseInt(tr_content.children[3].textContent);
                const join_sum = parseInt(tr_content.children[4].textContent);
                const max_absence = Math.ceil(class_sum * 0.25);
                const absenced = parseInt(tr_content.children[5].textContent);
                const official_absence = parseInt(tr_content.children[6].textContent);
                const absence_left = max_absence - absenced;
                let css_class;
                if (absence_left / max_absence > 0.5) {
                    //green
                    css_class = 'safe';
                } else if (absence_left / max_absence > 0.25) {
                    //yellow
                    css_class = 'warning';
                } else if (absence_left / max_absence > 0) {
                    //orange
                    css_class = 'danger';
                } else {
                    //red
                    css_class = 'dead';
                }


                sabotage[tr_content.children[1].children[0].href.split("/")[5]] = [join_sum, class_sum, absenced, absence_left, max_absence, official_absence, css_class];
            }
            mypage = sabotage;

        });
}

function update_shedule_header(startdate) {
    const new_tbody = document.createElement("tbody");
    const new_record = new_tbody.insertRow(0);
    for (let i = 0; i < 7; i++) {
        let new_cell = new_record.insertCell(i);
        new_cell.classList.add("week-data");
        // 7/9（火）のような形式で曜日と日付を表示
        let the_date = startdate;
        new_cell.textContent = `${the_date.getMonth() + 1}/${the_date.getDate()}（${["日", "月", "火", "水", "木", "金", "土"][the_date.getDay()]}）`;
        // add sat and sun class to cell
        if (the_date.getDay() == 0) {
            new_cell.classList.add("week-data-sun");
        } else if (the_date.getDay() == 6) {
            new_cell.classList.add("week-data-sat");
        }
        // bold today
        if (the_date.toDateString() == new Date().toDateString()) {
            new_cell.classList.add("week-data-today");
        }
        let new_a = document.createElement("a");
        new_a.href = `/lms/schedule/form/0/${the_date.getFullYear()}-${the_date.getMonth() + 1}-${the_date.getDate()}`
        new_a.innerHTML = `<i class="fas fa-edit">`
        new_cell.appendChild(new_a);
        the_date.setDate(startdate.getDate() + 1);
    }
    //make table header start from sunday
    const tbody = document.querySelector("body > div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.table-responsive.other-class.other-class-student-view > table.table.table-bordered.top-timetable-table > tbody");
    tbody.outerHTML = new_tbody.outerHTML;
}

function override_content() {

    const jsInitCheckTimer = setInterval(jsLoaded, 100);
    async function jsLoaded() {
        if (document.querySelector(".div-class-name") != null && mypage != null) {
            clearInterval(jsInitCheckTimer);
            const tbody = document.querySelector("#tree_ivy_overrided_table > table > tbody");
            // iterate tr in tbody
            for (let i = 0; i < tbody.children.length; i++) {
                const tr = tbody.children[i];
                //iterate td in tr
                for (let j = 0; j < tr.children.length; j++) {
                    const td = tr.children[j];
                    const div = td.children[1];
                    // check if div has children
                    if (div.children.length > 0) {
                        const section = div.children[0];
                        // check if section has a tag as a child
                        if (section.getElementsByTagName('a').length > 0) {
                            const a = section.children[0];
                            // check if a tag has href attribute
                            if (a.hasAttribute('href')) {
                                a.classList.add("T_I_link_target");
                                const href = `${a.getAttribute('href')}`.split("/")[3];
                                const ivy = document.createElement("div");
                                ivy.classList.add("T_I")
                                ivy.classList.add(mypage[href][6]);
                                ivy.setAttribute("classid", href);

                                const table = document.createElement("table");
                                ivy.appendChild(table);
                                table.classList.add("ivy_table");
                                // insert header row
                                const header = table.createTHead();
                                header.classList.add("ivy_header");
                                const header_row = header.insertRow(0);
                                header_row.classList.add("ivy_header_row");
                                const header_cell = header_row.insertCell(0);
                                header_cell.classList.add("ivy_header_cell");
                                header_cell.classList.add("ivy_cell_2data");
                                header_cell.classList.add("ivy_header_cell_joinclass")
                                header_cell.textContent = "出/全";
                                const header_cell2 = header_row.insertCell(1);
                                header_cell2.classList.add("ivy_header_cell");
                                header_cell2.classList.add("ivy_cell_2data")
                                header_cell2.classList.add("ivy_header_cell_absence")

                                chrome.storage.local.get(['countdown'], function (result) {
                                    if (result.countdown == true) {
                                        header_cell2.textContent = "残/落";
                                    } else {
                                        header_cell2.textContent = "欠/落";
                                    }
                                });


                                const header_cell3 = header_row.insertCell(2);
                                header_cell3.classList.add("ivy_header_cell");
                                header_cell3.classList.add("ivy_cell_1data");
                                header_cell3.classList.add("ivy_header_cell_officialabsence")
                                header_cell3.textContent = "公";
                                // insert data row
                                const data = table.createTBody();
                                data.classList.add("ivy_data");
                                const data_row = data.insertRow(0);
                                data_row.classList.add("ivy_data_row");
                                const data_cell = data_row.insertCell(0);
                                data_cell.classList.add("ivy_data_cell");
                                data_cell.classList.add("ivy_cell_2data")
                                data_cell.classList.add("ivy_data_cell_joinclass")
                                data_cell.textContent = mypage[href][0] + "/" + mypage[href][1];
                                const data_cell2 = data_row.insertCell(1);
                                data_cell2.classList.add("ivy_data_cell");
                                data_cell2.classList.add("ivy_cell_2data")
                                data_cell2.classList.add("ivy_data_cell_absence")

                                chrome.storage.local.get(['countdown'], function (result) {

                                    if (result.countdown == true) {
                                        data_cell2.textContent = mypage[href][3] + "/" + mypage[href][4];
                                    } else {
                                        data_cell2.textContent = mypage[href][2] + "/" + mypage[href][4];
                                    }
                                });


                                const data_cell3 = data_row.insertCell(2);
                                data_cell3.classList.add("ivy_data_cell");
                                data_cell3.classList.add("ivy_cell_1data");
                                data_cell3.classList.add("ivy_data_cell_officialabsence")
                                data_cell3.textContent = mypage[href][5];

                                if (section.getElementsByClassName("T_I").length == 0) {
                                    section.appendChild(ivy);
                                }

                            }
                        }
                    }
                }
            }


            chrome.storage.local.get(['show_examdate'], function (result) {
                if (result.show_examdate == true) {
                    addEventListener_to_link_for_exam();
                }
            });

        }
    }
}


function addEventListener_to_link_for_exam() {

    // get all elements with class T_I
    const elements = document.getElementsByClassName("T_I_link_target");
    // iterate all elements
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const classid = element.getAttribute("href").split("/")[3];

        const hover_element = document.createElement("div");
        hover_element.classList.add("hover-element");
        hover_element.textContent = "単位認定試験:";

        const url = `https://portal.iwasaki.ac.jp/portal/lmsinc/getLessonList.php?classId=${classid}`;

        fetch(url, {
            credentials: 'include',
        })
            .then(res => res.text())
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                const tbody = doc.querySelector(".table-default").children[1];
                // fix data
                for (let i = 0; i < tbody.children.length; i++) {
                    let tr = tbody.children[i];
                    if (tr.children.length == 0) {
                        tr.remove();
                    }
                }
                // get data from table
                const pattern = /\d{2}\/\d{2}\(.\)/;
                let has_exam = false;
                let last_subject = tbody.children[tbody.children.length - 1].children[0].textContent.match(pattern)[0];
                for (let i = tbody.children.length - 1; i >= 0; i--) {
                    let tr = tbody.children[i];
                    let date = tr.children[0].textContent;
                    // get only date
                    date = date.match(pattern)[0];
                    let subject = tr.children[1].textContent;
                    if (subject.includes("単位認定") && !subject.includes("対策")) {
                        has_exam = true;
                        hover_element.textContent += date;
                    }
                }
                // if there is no exam make last subject as exam
                if (!has_exam) {
                    hover_element.textContent += last_subject;
                }
            });


        element.appendChild(hover_element);

        // add event listener to each element

        element.addEventListener("mouseenter", function () {
            hover_element.style.display = "block";
        });

        element.addEventListener("mouseleave", function () {
            hover_element.style.display = "none";
        });

    }
}


function startDay_init() {

    function start_from_monday() {//月曜始まり＝１の場合
        // calculate the date of the monday in the week
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day == 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        const year = monday.getFullYear();
        const month = monday.getMonth() + 1;
        const date = monday.getDate();
        const monday_date = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;

        fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${monday_date}`, {
            credentials: 'include',
        })
            .then(res => res.text())
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                const content = doc.getElementsByTagName("table");
                document.getElementById("tree_ivy_overrided_table").innerHTML = content[0].outerHTML;

                override_content();

            });
    }

    function start_from_sunday() {//日曜始まり＝０の場合
        // calculate the date of the sunday in the week
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day;
        const sunday = new Date(today.setDate(diff));
        const year = sunday.getFullYear();
        const month = sunday.getMonth() + 1;
        const date = sunday.getDate();
        const sunday_date = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;

        fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${sunday_date}`, {
            credentials: 'include',
        })
            .then(res => res.text())
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                const content = doc.getElementsByTagName("table");
                document.getElementById("tree_ivy_overrided_table").innerHTML = content[0].outerHTML;


                override_content();
            });
    }

    function start_from_today() {//今日始まり＝0の場合
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const today_date = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
        fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${today_date}`, {
            credentials: 'include',
        })
            .then(res => res.text())
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                const content = doc.getElementsByTagName("table");
                document.getElementById("tree_ivy_overrided_table").innerHTML = content[0].outerHTML;

                override_content();
            });
    }

    chrome.storage.local.get(['startDay'], function (result) {
        switch (result.startDay) {
            case "0":
                start_from_today();
                break;
            case "1":
                start_from_monday();
                break;
            case "2":
                start_from_sunday();
                break;

            default:
                override_content();

                break;
        }
    });
}

function override_buttons() {
    function removeEventListeners(element, event) {
        var newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        return newElement;
    }

    function shift_date(days) {
        const schedule_now = new Date(window.localStorage.getItem("date_now"));
        schedule_now.setDate(schedule_now.getDate() + days);
        window.localStorage.setItem("date_now", schedule_now);
        const year = schedule_now.getFullYear();
        const month = schedule_now.getMonth() + 1;
        const date = schedule_now.getDate();
        const new_date = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date}`;
        fetch(`https://portal.iwasaki.ac.jp/portal/lmsinc/getScheduleCalendar.php?startDate=${new_date}`, {
            credentials: 'include',
        })
            .then(res => res.text())
            .then(text => new DOMParser().parseFromString(text, "text/html"))
            .then(doc => {
                const content = doc.getElementsByTagName("table");
                document.getElementById("tree_ivy_overrided_table").innerHTML = content[0].outerHTML;

                update_shedule_header(schedule_now);

                override_content();
            });
    }

    let before_seven_day_btn = removeEventListeners(document.querySelector(".before-seven-day-btn"), "click");
    let before_one_day_btn = removeEventListeners(document.querySelector(".before-one-day-btn"), "click");
    let after_one_day_btn = removeEventListeners(document.querySelector(".after-one-day-btn"), "click");
    let after_seven_day_btn = removeEventListeners(document.querySelector(".after-seven-day-btn"), "click");
    let today_btn = removeEventListeners(document.querySelector(".today-btn"), "click");


    before_seven_day_btn.addEventListener("click", function () {
        shift_date(-7);
    });

    before_one_day_btn.addEventListener("click", function () {
        shift_date(-1);
    });

    after_one_day_btn.addEventListener("click", function () {
        shift_date(1);
    });

    after_seven_day_btn.addEventListener("click", function () {
        shift_date(7);
    });

    today_btn.addEventListener("click", function () {
        window.localStorage.setItem("date_now", window.localStorage.getItem("startday"));
        shift_date(0);
    });

}
