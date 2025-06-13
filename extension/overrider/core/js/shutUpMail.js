window.addEventListener("load", () => {

    // This is for stopping the page to send requests that ask if there are new emails every fucking 5 seconds.
    // why is this even a thing? why not just use websockets or something?
    // anyway, this is a workaround to stop the page from sending those requests.
    // i will remove this code when the page is fixed.
    const button = document.createElement("button");
    button.textContent = "Shut Up Mail";
    button.style.display = "none";
    button.id = "shutUpMailButton";
    button.setAttribute("onclick", `
        document.getElementById("shutUpMailButton").remove();
    
        notify.job = function(job) {
    $('.div-offline').hide();
    try {
        if (!navigator.onLine) {
            $('.div-offline').show();
        }
    } catch (e) {}
    if (job && job.interval_sec) {
        for (var i in job.actions) {
            eval(job.actions[i]);
        }
        // clearTimeout(notify.timer);
        // notify.timer = setTimeout(function() {
        //     notify.init();
        // }, job.interval_sec * 1000);
        if(notify.timer){
        clearTimeout(notify.timer);
        }
    }
}`);

    document.body.appendChild(button);
    button.click();
});