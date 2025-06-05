window.onload = async () => {
    console.log("Settings page loaded");

    const checkboxs = document.querySelectorAll("input[type='checkbox']");
    checkboxs.forEach(checkbox => {
        // Initialize checkbox state from storage
        chrome.storage.sync.get(checkbox.id, (data) => {
            // if not found, set default to true
            if (data[checkbox.id] === undefined) {
                data[checkbox.id] = true; // Default value
                chrome.storage.sync.set({ [checkbox.id]: true });
            }
            checkbox.checked = data[checkbox.id];
        });


        checkbox.addEventListener("change", async (event) => {
            const key = event.target.id;
            const value = event.target.checked;
            console.log(`Setting ${key} to ${value}`);
            await chrome.storage.sync.set({ [key]: value });
        });
    });

}