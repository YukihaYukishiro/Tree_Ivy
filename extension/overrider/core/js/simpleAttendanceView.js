async function apply_simpleAttendanceView() {
    const tbody = await waitForElement("#div-top-timetable2 > table > tbody");
    const spans = tbody.querySelectorAll(".div-class-name span");
    
        //foreach
        spans.forEach(function (span) {
            span.classList.add('attendance-hidden');
        });
        //foreach
        spans.forEach(function (span) {
            bgColor = span.style.backgroundColor; //rgb
            td = span.closest('td');
            td.style.backgroundColor = bgColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
        });

}


