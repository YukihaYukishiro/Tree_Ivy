window.addEventListener("load", get_sabotage, false);
window.addEventListener("load", function () { 
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    async function jsLoaded() {
    if(document.querySelector("body > div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.margin-bottom") != null){
    const button = document.querySelector("body > div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.margin-bottom");
    for(let i = 0; i < 5; i++){
        button.children[i].addEventListener("click", get_sabotage, false);
    }
}
}}, false);

function get_sabotage(e) {
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    async function jsLoaded() {
        if (document.querySelector("#div-top-timetable2 > table > tbody") != null) {
            clearInterval(jsInitCheckTimer);
            //要素を取得する処理
            let content;
            await fetch("https://portal.iwasaki.ac.jp/portal/lmsinc/mySubjectStatus.php", {
                credentials: 'include',
            })
                .then(res => res.text())
                .then(text => new DOMParser().parseFromString(text, "text/html"))
                .then(doc => content = doc);

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


                sabotage[tr_content.children[1].children[0].href.split("/")[5]] = [join_sum,class_sum,absenced,absence_left,max_absence, official_absence,css_class];
            }


            const tbody = document.querySelector("#div-top-timetable2 > table > tbody");
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
                                const href = `https://portal.iwasaki.ac.jp${a.getAttribute('href')}`.split("/")[5];
                                const ivy = document.createElement("div");
                                ivy.classList.add("T_I")
                                ivy.classList.add(sabotage[href][6]);

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
                                header_cell2.textContent = "欠/落";
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
                                data_cell.textContent = sabotage[href][0] + "/" + sabotage[href][1];
                                const data_cell2 = data_row.insertCell(1);
                                data_cell2.classList.add("ivy_data_cell");
                                data_cell2.classList.add("ivy_cell_2data")
                                data_cell2.classList.add("ivy_data_cell_absence")
                                data_cell2.textContent = sabotage[href][2] + "/" + sabotage[href][4];
                                const data_cell3 = data_row.insertCell(2);
                                data_cell3.classList.add("ivy_data_cell");
                                data_cell3.classList.add("ivy_cell_1data");
                                data_cell3.classList.add("ivy_data_cell_officialabsence")
                                data_cell3.textContent = sabotage[href][5];

                                if(section.getElementsByClassName("T_I").length == 0){
                                    section.appendChild(ivy);
                                }
                               
                            }
                        }
                    }
                }
            }

        }
    }

}