window.addEventListener("load", function(){
    const button  = document.querySelector("body > div.v2-container > div > div.main.sp-margin-bottom-md > div > div.panel.panel-default.sp-margin-bottom-none.sp-border-bottom-none.sp-border-top-none > div.table-responsive.sp-margin-bottom-none.sp-padding-sm > div > div.margin-bottom")
    button.appendChild(document.createElement("button")).innerHTML = "欠席表示";
    const child = button.lastChild;
    
    child.addEventListener("click", get_sabotage, false);
        
    

}, false);


function get_sabotage(e) {
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
    function jsLoaded() {
        if (document.querySelector("#div-top-timetable2 > table > tbody") != null) {
            clearInterval(jsInitCheckTimer);
            //要素を取得する処理
            const myPage = window.open("https://portal.iwasaki.ac.jp/portal/lmsinc/sMyPage.php",null,`width=1,height=1,left=${screen.width},top=${screen.height}`);
            // ページが読み込まれた後にコンテンツを取得する
            var content ;
            myPage.onload = function() {
                const jsInitCheckTimer = setInterval(jsLoaded, 1000);
                function jsLoaded() {
                    if(myPage.document.querySelector('#div-mypage-tab > table:nth-child(3) > tbody') != null){
                        clearInterval(jsInitCheckTimer);
                        // 新しいページのコンテンツを取得
                        content = myPage.document.querySelector('#div-mypage-tab > table:nth-child(3) > tbody');
                        myPage.close();
                        // 取得したコンテンツを使って何かしらの処理を行うことができる

                        var sabotage = {}
                        for (let k = 0; k < content.children.length; k++) {
                            const tr_content = content.children[k];
                            const class_sum = parseInt(tr_content.children[3].textContent);
                            const max_sabotage = Math.ceil(class_sum * 0.25);
                            const sabotaged = parseInt(tr_content.children[5].textContent);
                            const sabotag_left = max_sabotage - sabotaged;
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
                            sabotage[tr_content.children[1].children[0].href.split("/")[5]] = [sabotag_left, max_sabotage, color];
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
                                if(div.children.length > 0){
                                    const section = div.children[0];
                                    // check if section has a tag as a child
                                    if(section.getElementsByTagName('a').length > 0){
                                        const a = section.children[0];
                                        // check if a tag has href attribute
                                        if(a.hasAttribute('href')){
                                            const href = `https://portal.iwasaki.ac.jp${a.getAttribute('href')}`.split("/")[5];
                                            let temp;
                                            if(sabotage[href][0] == 0){
                                                temp = "欠席不可";
                                            }else{ 
                                                temp = "欠席可能";
                                            }
                                            const t = document.createElement("div");
                                            t.innerHTML =  `<div style="color:${sabotage[href][2]}">${temp}</div>(<i style="color:${sabotage[href][2]}">${sabotage[href][0]}/${sabotage[href][1]}</i>)`;
                                            a.appendChild(t);
                                            if(a.children.length > 2)
                                            a.children[1].remove();
                                        }
                                    }
                                }
                            }
                        }

                    }          
                }

            };

        }
    }

}