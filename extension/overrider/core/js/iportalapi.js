function get_subject_status() {
    return new Promise((resolve, reject) => {
        const url = `https://portal.iwasaki.ac.jp/portal/lmsinc/mySubjectStatus.php`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // get the response as text
                return response.text();
            }).then(html_text => {
                resolve(read_data_from_my_subject_status(html_text));
            })
            .catch(error => reject(error));
    });
}

function read_data_from_my_subject_status(html_body) {
    const subjectStatus = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html_body, 'text/html');
    const trs = doc.querySelectorAll('tbody tr');
    trs.forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if (tds.length > 2) {
            const class_id = tds[1].children[0].href.split("/")[5];
            const class_name = tds[1].children[0].innerHTML.trim();
            const max_periods = parseInt(tds[3].textContent.trim(), 10);
            const attendance = parseInt(tds[4].textContent.trim(), 10);
            const absence = parseInt(tds[5].textContent.trim(), 10);
            const public_absence = parseInt(tds[6].textContent.trim(), 10);
            subjectStatus.push({
                class_id: class_id,
                class_name: class_name,
                max_periods: max_periods,
                attendance: attendance,
                absence: absence,
                public_absence: public_absence,
            });
        }
    });
    return subjectStatus;

}
