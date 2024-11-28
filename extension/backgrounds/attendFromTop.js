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
        const attend_button = document.createElement("i");
        attend_button.classList.add("fas");
        attend_button.classList.add("fa-user-plus");
        attend_button.classList.add("attend_button");
        //画像サイズの調整
        // attend_button.style.width = "25px";
        // attend_button.style.height = "25px";
        attend_button.style.fontSize = "16px";
        attend_button.style.cursor = "pointer";
        attend_button.style.color = "gray";
        //onclickイベントの追加
        attend_button.setAttribute("onclick", `checkAttendEntry(${href});`) 


    
        //ボタンの実装
        let div_right = document.createElement("div");
        div_right.classList.add("text-right");
        div_right.appendChild(attend_button);
        section.insertBefore(div_right, section.children[1]);
    }


}