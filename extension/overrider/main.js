console.log("Overrider extension loaded");

window.addEventListener("load",async () => {
    console.log("Fetching subject status...");
    const stats = await get_subject_status();
    console.log("Subject status:", stats);

    apply_attendance_bar(stats)
    // override_content(stats);

});




