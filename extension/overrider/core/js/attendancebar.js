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
                    const ivyBar = const_bar(subject);
                    if (ivyBar) {
                        section.appendChild(ivyBar);
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

