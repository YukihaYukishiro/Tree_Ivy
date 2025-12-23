window.addEventListener("load", function () {
    console.log("Overrider addlink loaded");
    add_settings_link();
    // add comment <!-- network hook injected --> to head
    const comment = document.createComment("network hook. injected by TreeIvy extension");
    document.head.appendChild(comment);
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("overrider/external/network_hook.js");
    (document.head || document.documentElement).appendChild(script);
});

async function add_settings_link_old() {
    const nav_bar = await waitForElement("#header-menu > ul.nav.navbar-nav.navbar-right.gnav.cf")
    if (!nav_bar) {
        console.error("ナビゲーションバーが見つかりませんでした。");
        return;
    }
    const settings_link = document.createElement("li");
    const link = document.createElement("a");
    link.href = chrome.runtime.getURL("settings/settings.html");
    link.textContent = "Tree Ivy 設定";
    link.target = "_blank"; // 新しいタブで開く
    settings_link.appendChild(link);
    nav_bar.appendChild(settings_link);
}

async function add_settings_link() {
    const nav_bar = await waitForElement("#header-menu > ul.nav.navbar-nav.navbar-right.gnav.cf")
    if (!nav_bar) {
        console.error("ナビゲーションバーが見つかりませんでした。");
        return;
    }
    const settings_link = document.createElement("li");
    settings_link.id = "ivy-settings-item"; // ← クラス名つけたよ♪

    const link = document.createElement("a");
    link.href = chrome.runtime.getURL("settings/settings.html");
    link.textContent = "Tree Ivy 設定";
    link.target = "_blank";
    link.className = "ivy-settings-link"; // ← こっちにもクラス♪

    settings_link.appendChild(link);
    nav_bar.appendChild(settings_link);
}