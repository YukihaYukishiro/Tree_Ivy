async function apply_absenceRequest() {
    await waitForElement(".ttmodeanchor")
    const date_tds = await waitForElements("td.week-data");
    
    date_tds.forEach((td) => {
        const absenceRequestButton = document.createElement("button");
        absenceRequestButton.textContent = "公";
        absenceRequestButton.className = "absence-request-button";
        absenceRequestButton.addEventListener("click", async (event) => {
            let date = td.textContent.trim();
            // remove any characters that are not digits or slashes
            date = date.replace(/[^0-9/]/g, "");
            // convert 6/16（月） to yyyy-mm-dd
            const today = new Date();
            const [month, day] = date.split("/");
            const year = today.getFullYear();
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

            open_splitView(`chrome-extension://${chrome.runtime.id}/assets/R07A5/R07A5.html?date=${formattedDate}`,true);
            
        });
        // prepend the button to the td
        td.prepend(absenceRequestButton);
    });


}