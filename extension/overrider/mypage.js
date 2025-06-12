window.addEventListener("load", async () => {
    const config = await get_config();
    if (config.mypage_newtab) {
        document.addEventListener("click", async (event) => {
            // if window url substring is #report
            if (window.location.href.includes("#report")) {
                // if the clicked element is a link
                if (event.target.tagName === "A") {
                    // if the link is under #div-mypage-tab
                    let flag = false;
                    let element = event.target;
                    while (element) {
                        if (element.id === "div-mypage-tab") {
                            flag = true;
                            break;
                        }
                        element = element.parentElement;
                    }
                    // if the link is under #div-mypage-tab, open in new tab
                    if (flag) {
                        event.preventDefault();
                        const url = event.target.href;
                        window.open(url, "_blank");
                    }
                }
            }

        });
    }
});