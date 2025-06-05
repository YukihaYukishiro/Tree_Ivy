console.log("Overrider main loaded");

window.addEventListener("load",async () => {
    console.log("Fetching subject status...");
    const stats = await get_subject_status();
    apply_attendance_bar(stats)
});




