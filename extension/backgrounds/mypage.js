window.addEventListener("load", main, false);
window.addEventListener("load", addlsn_a, false);

function addlsn_a(e) {
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    function jsLoaded() {
        if (document.querySelector("#div-mypage > div > div.col-sm-9.padding-left-none.sp-padding-none > div > ul > li.li-tabs.active > a")!= null && document.querySelector("#div-mypage-tab > table:nth-child(3) > caption > button")!= null) {
            clearInterval(jsInitCheckTimer);
            document.querySelector("#div-mypage > div > div.col-sm-9.padding-left-none.sp-padding-none > div > ul > li.li-tabs.active > a").addEventListener("click", main, false);
            document.querySelector("#div-mypage-tab > table:nth-child(3) > caption > button").addEventListener("click", main, false);
            document.querySelector("#div-mypage > div > div.col-sm-9.padding-left-none.sp-padding-none > div > ul > li.li-tabs.active > a").addEventListener("click", addlsn_b, false);

        }
    }
}
function addlsn_b(e) {
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    function jsLoaded() {
        if (document.querySelector("#div-mypage-tab > table:nth-child(3) > caption > button")!= null) {
            clearInterval(jsInitCheckTimer);
            document.querySelector("#div-mypage-tab > table:nth-child(3) > caption > button").addEventListener("click", main, false);
        }
    }
}

function main(e) {
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    function jsLoaded() {
        if (document.querySelector('#div-mypage-tab > table:nth-child(3) > thead') != null) {
            clearInterval(jsInitCheckTimer);
            //要素を取得する処理
            const thread = document.querySelector('#div-mypage-tab > table:nth-child(3) > thead');
            // insert th in thead first child
            thread.children[0].insertCell(5).outerHTML = '<th class="size8" rowspan="2">欠席/落単</th>';
            
            // get tbody
            const tbody = document.querySelector('#div-mypage-tab > table:nth-child(3) > tbody');
            // iterate tr in tbody
            for (let i = 0; i < tbody.children.length; i++) {
                const tr = tbody.children[i];
                //insert td
                class_sum = parseInt(tr.children[3].textContent);
                max_absence = Math.ceil(class_sum * 0.25);
                absenced = parseInt(tr.children[5].textContent);
                absence_left = max_absence - absenced;
                let color;
                if (absence_left / max_absence > 0.5) {
                    //green
                    color = '#e0ffc1';
                } else if (absence_left / max_absence > 0.25) {
                    //yellow
                    color = '#ffffbc';
                } else if (absence_left / max_absence > 0) {
                    //orange
                    color = '#ffe0c1';
                } else {
                    //red
                    color = '#ff7f7f';
                }
                tr.insertCell(7).outerHTML = `<td class="text-center" style="color: ${color};">${absenced}/${max_absence}</td>`;
                
            }
        }
    }
};
