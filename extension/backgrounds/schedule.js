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


                sabotage[tr_content.children[1].children[0].href.split("/")[5]] = [class_sum,join_sum,absenced,max_absence, official_absence,color];
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
                                const t = document.createElement("div");
                                t.classList.add("T_I")
                                t.innerHTML = `
                                <div style="    width: 100%;
    background-color: ${sabotage[href][5]};
    display: flex;
    flex-direction: row;
    padding: 3px;
    font-size: 1em;    
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    ">    
                                     <div style="width : 40% ;color: #000;
    text-align: center;
    ">出:全</div>   
                                 <div style="width : 40% ;color: #000;
    text-align: center;
    ">欠:落</div>
                                
                                 <div style="width : 20% ;color: #000;
    text-align: center;
    ">公</div>
                                
                                </div>



                                <div style="    width: 100%;
    background-color: ${sabotage[href][5]};
    display: flex;
    flex-direction: row;
    padding: 3px;
    font-size: 1em;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    ">    
                                     <div style="width : 40% ;color: #000;
    text-align: center;
    ">${sabotage[href][1]}:${sabotage[href][0]}</div>   
                                 <div style="width : 40% ;color: #000;
    text-align: center;
    ">${sabotage[href][2]}:${sabotage[href][3]}</div>
                                
                                 <div style="width : 20% ;color: #000;
    text-align: center;
    ">${sabotage[href][4]}</div>
                                
                                </div>


                                `;
                                if(section.getElementsByClassName("T_I").length == 0){
                                    section.appendChild(t);
                                }
                               
                            }
                        }
                    }
                }
            }

        }
    }

}