async function loadAndShowIportalNotifications() {
    const notification_count = await get_notificationcount();
    // const notification_count = 1; // デバッグ用に強制的に1件に設定
    if (notification_count > 0) {
        const notifications = await fetch('https://portal.iwasaki.ac.jp/portal/api/portalApi.php?type=infolistJ')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        let records = notifications.records || [];
        // records[0].viewDateTime = null; // 最初のレコードのviewDateTimeをnullに設定
        
        records = records.filter(record => record.viewDateTime === null)
        // infoCode で昇順(0最古)にソート
        records.sort((a, b) => {
            return a.infoCode - b.infoCode;
        });

            
        // 複数ある場合は後ろから順番に表示する
        // 前のが消えてから次のを出す
        // フラグを立ててonCloseで変更させることで実現
        let currentIndex = 0;
        const showNextNotification = () => {
            if (currentIndex < records.length) {
                const record = records[currentIndex];
                showNotification({
                    title: `IPortalからの通知: (${currentIndex + 1}/${records.length})`,
                    content: createInfoCard(record),
                    duration: 5000,
                    onClose: () => {
                        fetch(`https://portal.iwasaki.ac.jp/portal/api/portalApi.php?type=infoviewupdate&infoCode=${record.infoCode}`);
                        currentIndex++;
                        showNextNotification();
                    }
                });
            }
        };
        showNextNotification();
    }
}

function get_notificationcount() {
    return new Promise((resolve, reject) => {
        return fetch('https://portal.iwasaki.ac.jp/portal/api/portalApi.php?type=newinfocnt').then(response => {
            if (!response.ok) {
                reject(new Error('Network response was not ok'));
            }
            return response.json();
        }).then(data => {
            if (data && data.result === 'success') {
                resolve(data.cnt);
            } else {
                reject(new Error('Failed to fetch notifications'));
            }
        });
    });
}

function createInfoCard(info) {
    const container = document.createElement("div");
    container.className = "info-card";
    container.style.borderLeft = `8px solid ${info.baseColor}`;
    container.style.background = "#fff";
    container.style.padding = "1em";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
    container.style.position = "relative";

    const title = document.createElement("h2");
    title.textContent = info.infoTitle || "タイトルなし";
    title.style.color = info.baseColor;
    title.style.margin = "0 0 0.5em 0";
    title.style.fontSize = "1.2em";

    const subtitle = document.createElement("div");
    subtitle.textContent = info.infoTitle2 || "";
    subtitle.style.fontWeight = "bold";
    subtitle.style.marginBottom = "0.5em";
    subtitle.style.color = "#555";

    const category = document.createElement("span");
    category.textContent = `カテゴリ：${info.categoryName}`;
    category.style.display = "inline-block";
    category.style.fontSize = "0.8em";
    category.style.color = "#999";
    category.style.marginBottom = "0.5em";

    const content = document.createElement("div");
    content.className = "info-description";
    content.innerText = info.infoDescription || "";
    content.style.maxHeight = "10em";
    content.style.overflow = "hidden";
    content.style.position = "relative";
    content.style.lineHeight = "1.4em";

    const fade = document.createElement("div");
    fade.className = "fade-overlay";
    fade.style.position = "absolute";
    fade.style.bottom = "0";
    fade.style.left = "0";
    fade.style.right = "0";
    fade.style.height = "2em";
    fade.style.background = "linear-gradient(to bottom, transparent, white)";

    content.appendChild(fade);

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(category);
    container.appendChild(content);

    return container;
}

