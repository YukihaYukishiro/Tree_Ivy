window.onload = async () => {
    console.log("Settings page loaded");

    const checkboxs = document.querySelectorAll("input[type='checkbox']");
    checkboxs.forEach(checkbox => {

        const parentOption = checkbox.closest(".option");
        // Initialize checkbox state from storage
        chrome.storage.sync.get(checkbox.id, (data) => {
            // if not found, set default to true
            if (data[checkbox.id] === undefined) {
                data[checkbox.id] = true; // Default value
                chrome.storage.sync.set({ [checkbox.id]: true });
            }
            checkbox.checked = data[checkbox.id];

            // チェック状態に応じてクラス切り替え
            if (parentOption) {
                parentOption.classList.toggle("active", checkbox.checked);
            }
        });

        checkbox.addEventListener("change", async (event) => {
            const key = event.target.id;
            const value = event.target.checked;
            console.log(`Setting ${key} to ${value}`);
            await chrome.storage.sync.set({ [key]: value });

            if (parentOption) {
                parentOption.classList.toggle("active", value);
            }
        });
    });
    setupSuboptionList("add-url-pattern", "list-url-pattern");

    document.getElementById("reset-tutorial").addEventListener("click", () => {
        const tutorial_progress = [];
        chrome.storage.sync.set({ tutorial_progress: tutorial_progress }, () => {
            console.log("チュートリアルの進行状況をリセットしました");
            alert("チュートリアルの進行状況をリセットしました。ページをリロードしてください。");
        });
    });
}







function setupSuboptionList(addBtnId, listContainerId) {
    const addBtn = document.getElementById(addBtnId);
    const listContainer = document.getElementById(listContainerId);

    if (!addBtn || !listContainer) {
        console.warn(`ID "${addBtnId}" または "${listContainerId}" が見つからなかったよ…`);
        return;
    }

    addBtn.addEventListener("click", () => {
        const item = document.createElement("div");
        item.className = "link-item";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "リンクのパターンを入力…";
        input.addEventListener("input", () => {
            // 入力内容を保存
            const patterns = Array.from(listContainer.querySelectorAll("input[type='text']"))
                .map(input => input.value.trim())
                .filter(value => value !== "");
            chrome.storage.sync.set({ urlPatterns: patterns });
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "削除";
        removeBtn.addEventListener("click", () => {
            listContainer.removeChild(item);
            // 入力内容を保存
            const patterns = Array.from(listContainer.querySelectorAll("input[type='text']"))
                .map(input => input.value.trim())
                .filter(value => value !== "");
            chrome.storage.sync.set({ urlPatterns: patterns });
        });
        item.appendChild(input);
        item.appendChild(removeBtn);
        listContainer.appendChild(item);
    });
    // 初期パターンを読み込む
    chrome.storage.sync.get("urlPatterns", (data) => {
        const patterns = data.urlPatterns || [];
        patterns.forEach(pattern => {
            const item = document.createElement("div");
            item.className = "link-item";

            const input = document.createElement("input");
            input.type = "text";
            input.value = pattern;
            input.placeholder = "リンクのパターンを入力…";
            input.addEventListener("input", () => {
                // 入力内容を保存
                const patterns = Array.from(listContainer.querySelectorAll("input[type='text']"))
                    .map(input => input.value.trim())
                    .filter(value => value !== "");
                chrome.storage.sync.set({ urlPatterns: patterns });
            });

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "削除";
            removeBtn.addEventListener("click", () => {
                listContainer.removeChild(item);
                // 入力内容を保存
                const patterns = Array.from(listContainer.querySelectorAll("input[type='text']"))
                    .map(input => input.value.trim())
                    .filter(value => value !== "");
                chrome.storage.sync.set({ urlPatterns: patterns });
            });
            item.appendChild(input);
            item.appendChild(removeBtn);
            listContainer.appendChild(item);
        });
    });
}
