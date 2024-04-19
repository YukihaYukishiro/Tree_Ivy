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
            thread.children[0].insertCell(5).outerHTML = '<th class="size8" rowspan="2">サボタージュ</th>';
            
            // get tbody
            const tbody = document.querySelector('#div-mypage-tab > table:nth-child(3) > tbody');
            // iterate tr in tbody
            for (let i = 0; i < tbody.children.length; i++) {
                const tr = tbody.children[i];
                //insert td
                class_sum = parseInt(tr.children[3].textContent);
                max_sabotage = Math.ceil(class_sum * 0.25);
                sabotaged = parseInt(tr.children[5].textContent);
                sabotag_left = max_sabotage - sabotaged;
                let color;
                if (sabotag_left/max_sabotage > 0.5 ){
                    color = '#00ff00';
                }else if (sabotag_left/max_sabotage > 0){
                    color = '#e000dd';
                }else if (sabotag_left/max_sabotage == 0){
                    color = '#ff8c00';
                }else{
                    color = '#ff0000';
                }
                tr.insertCell(7).outerHTML = `<td class="text-center" style="color: ${color};">${sabotag_left}/${max_sabotage}</td>`;
                
            }
        }
    }
};
