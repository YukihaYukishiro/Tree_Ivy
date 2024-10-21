function openPopup() {

    fetch(chrome.runtime.getURL("../html/dialog.html"), { method: "GET" })
        .then(response => {
            return response.text()
        })
        .then(html => {
            const popup = document.createElement("div");
            popup.id = "TI_discord_popup";
            popup.innerHTML = html
            console.log(popup);
            document.body.appendChild(popup);

            document.getElementById("TI_discord_popup_close").addEventListener("click", function () {
                document.getElementById("TI_discord_popup").remove();
            });

            document.getElementById("TI_discord_popup_nomore").addEventListener("click", function () {
                localStorage.setItem("discord_nomore", "true");
                document.getElementById("TI_discord_popup").remove();
            });

        });


}



window.addEventListener("load", function () {
    //Offishal　Discord Server

    if (localStorage.getItem("discord_nomore") == "false" || localStorage.getItem("discord_nomore") == null) {
        openPopup();
    }


});