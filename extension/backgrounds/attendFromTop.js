function addAttendFromTop() {

    const sections = document.querySelectorAll('.T_I_section');
    for (let section of sections) {
        const a = section.children[0];
        const href = `${a.getAttribute('href')}`.split("/")[3];
        //出席ボタンの追加
        if(section.querySelector('br')){
            section.querySelector('br').remove();
        }
        //出席ボタンの追加
        //画像の追加
        const attend_img = document.createElement("img");
        attend_img.src = chrome.runtime.getURL("../images/attend.jpg");
        attend_img.classList.add("attend_img");
        //画像サイズの調整
        attend_img.style.width = "20px";
        attend_img.style.height = "20px";
        //onclickイベントの追加
        attend_img.setAttribute("onclick", `checkAttendEntry(${href});`)                                                           
    
        //ボタンの実装
        let div_right = document.createElement("div");
        div_right.classList.add("text-right");
        div_right.appendChild(attend_img);
        section.insertBefore(div_right, section.children[1]);
    }


}