function const_bar(subject) {
    const ivyBar = document.createElement("div");
    ivyBar.className = "ivy-bar";
    const total = subject.max_periods;

    if (ivyBar) {
        const main_bar = document.createElement("div");
        main_bar.className = "ivy-actual-bar ivy-main-bar";
        ivyBar.appendChild(main_bar);

        const { attendance, public_absence, absence } = subject;
        const used = attendance + public_absence + absence;
        const empty = total - used;
        // 全体の情報の表示バー
        ["ivy-attended", "ivy-public-absence", "ivy-absence", "ivy-empty"].forEach((segment) => {
            const unit = document.createElement("div");
            unit.classList.add("ivy-bar-unit", segment);
            main_bar.appendChild(unit);
            if (segment === "ivy-attended") {
                unit.style.flex = attendance / total;
            } else if (segment === "ivy-public-absence") {
                unit.style.flex = public_absence / total;
            } else if (segment === "ivy-absence") {
                unit.style.flex = absence / total;
            } else {
                unit.style.flex = empty / total;
            }
        });
        // 欠席のバー
        const death_bar = document.createElement("div");
        death_bar.className = "ivy-actual-bar ivy-death-bar";
        ivyBar.appendChild(death_bar);
        const max_absence = Math.ceil(total * 0.25);
        for (let i = 0; i < max_absence; i++) {
            const unit = document.createElement("div");
            unit.classList.add("ivy-death-unit");
            if (i < absence) {
                unit.classList.add("ivy-death-unit-dead");
            }
            death_bar.appendChild(unit);
        }
        // 情報の表示
        // メインバー用
        const info = document.createElement("div");
        info.className = "ivy-bar-info ivy-main-bar-info";
        ivyBar.appendChild(info);
        const totalText = document.createElement("div");
        const attendedText = document.createElement("div");
        const absenceText = document.createElement("div");
        const publicAbsenceText = document.createElement("div");
        totalText.textContent = `総授業数: ${total}`;
        attendedText.textContent = `出席: ${attendance}`;
        absenceText.textContent = `欠席: ${absence}`;
        publicAbsenceText.textContent = `公欠: ${public_absence}`;
        info.appendChild(totalText);
        info.appendChild(attendedText);
        info.appendChild(absenceText);
        info.appendChild(publicAbsenceText);
        // 欠席バー用
        const deathInfo = document.createElement("div");
        deathInfo.className = "ivy-bar-info ivy-death-bar-info";
        ivyBar.appendChild(deathInfo);
        const maxAbsenceText = document.createElement("div");
        const currentAbsenceText = document.createElement("div");
        currentAbsenceText.textContent = `現在の欠席数: ${absence}`;
        maxAbsenceText.textContent = `最大欠席数: ${max_absence}`;
        deathInfo.appendChild(maxAbsenceText);
        deathInfo.appendChild(currentAbsenceText);
    }
    return ivyBar;
}

function apply_attendance_bar(attendanceData) {
    return new Promise(async (resolve, reject) => {
        if (!attendanceData || !Array.isArray(attendanceData)) {
            reject(new Error("Invalid attendance data"));
            return;
        }
        const tbody = await waitForElement("#div-top-timetable2 > table > tbody");
        const sections = tbody.querySelectorAll("section");
        sections.forEach((section) => {
            // Check if section has a A tag as a child
            if (section.getElementsByTagName('a').length > 0) {
                const a = section.getElementsByTagName('a')[0];
                const classId = a.getAttribute('href').split("/")[3];
                const subject = attendanceData.find(s => s.class_id === classId);
                if (subject) {
                    const ivy_section = document.createElement("div");
                    ivy_section.className = "ivy-section";
                    ivy_section.setAttribute("data-class-id", classId);
                    const ivyBar = const_bar(subject);
                    if (ivyBar) {
                        ivy_section.appendChild(ivyBar);
                        section.appendChild(ivy_section);
                        // console.log("Attendance bar added for subject:", subject.class_name);
                    } else {
                        console.warn("Failed to create attendance bar for subject:", subject.class_name);
                    }
                } else {
                    console.warn("Subject not found for class ID:", classId);
                }

            }
        });
    });
}





function const_chart(subject) {
    const chart = document.createElement("div");
    chart.className = "ivy-chart";
    const total = subject.max_periods;

    if (chart) {
        const { attendance, public_absence, absence } = subject;


        // 全体の情報の表示チャート
        // "出/公/全"　"欠/落"のヘッダーをつける
        const header = document.createElement("div");
        header.className = "ivy-chart-header";
        header.innerHTML = `
            <div class="ivy-chart-header-item">出/公/全 </div>
            <div class="ivy-chart-header-item"> 欠/落</div>
        `;
        chart.appendChild(header);

        const body = document.createElement("div");
        body.className = "ivy-chart-body";
        // 出席/公欠/全授業,欠席/落単のチャートを作成
        body.innerHTML = `
            <div class="ivy-chart-item">${attendance}/${public_absence}/${total}</div>
            <div class="ivy-chart-item">${absence}/${Math.ceil(total * 0.25)}</div>
        `;

        chart.appendChild(body);

    }
    return chart;

}

function apply_attendance_chart(attendanceData) {
    return new Promise(async (resolve, reject) => {
        if (!attendanceData || !Array.isArray(attendanceData)) {
            reject(new Error("Invalid attendance data"));
            return;
        }
        const tbody = await waitForElement("#div-top-timetable2 > table > tbody");
        const sections = tbody.querySelectorAll("section");
        sections.forEach((section) => {
            // Check if section has a A tag as a child
            if (section.getElementsByTagName('a').length > 0) {
                const a = section.getElementsByTagName('a')[0];
                const classId = a.getAttribute('href').split("/")[3];
                const subject = attendanceData.find(s => s.class_id === classId);
                if (subject) {
                    const ivy_section = document.createElement("div");
                    ivy_section.className = "ivy-section";
                    ivy_section.setAttribute("data-class-id", classId);
                    const ivyChart = const_chart(subject);
                    if (ivyChart) {
                        ivy_section.appendChild(ivyChart);
                        // absence/Math.ceil(total * 0.25)　を計算した値に応じて.ivy-green, .ivy-red, .ivy-yellowのクラスを追加する
                        const maxAbsence = Math.ceil(subject.max_periods * 0.25);
                        const absenceratio = subject.absence / maxAbsence;
                        if (absenceratio < 0.5) {
                            ivy_section.classList.add("ivy-green");
                        } else if (absenceratio < 0.75) {
                            ivy_section.classList.add("ivy-yellow");
                        } else {
                            ivy_section.classList.add("ivy-red");
                        }

                        section.appendChild(ivy_section);
                        // console.log("Attendance chart added for subject:", subject.class_name);
                    } else {
                        console.warn("Failed to create attendance chart for subject:", subject.class_name);
                    }
                } else {
                    console.warn("Subject not found for class ID:", classId);
                }

            }
        });
    });
}