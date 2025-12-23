async function calendar_attendance() {
    const ivy_sections = await waitForElements(".ivy-section");
    ivy_sections.forEach((ivy_section) => {
        if (ivy_section.querySelector(".ivy-attendance-button")) 
            return; // Skip if button already exists
        const classId = ivy_section.getAttribute("data-class-id");
        if (!classId) {
            console.warn("Class ID not found in ivy section:", ivy_section);
            return;
        }
        // add button to section that has checkAttendEntry('+classId+')
        const button = document.createElement("button");
        button.className = "ivy-attendance-button";
        button.textContent = "出席確認";
        button.setAttribute("onclick", `checkAttendEntry('${classId}')`);
        button.style.width = "100%"; // Full width button
        button.style.marginBottom = "5px"; // Margin for spacing
        button.style.padding = "2px 8px";
        button.style.backgroundColor = "#b2f0e6"; // Pastel teal
        button.style.color = "#777"; // light gray text
        button.style.border = "none"; // No border
        button.style.borderRadius = "4px"; // Rounded corners
        button.style.fontSize = "12px";
        button.style.cursor = "pointer"; // Pointer cursor on hover
        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#a0e7d6"; // Slightly darker pastel on hover
            button.style.color = "#333"; // Darker text on hover

        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#b2f0e6"; // Reset to original color on mouse out
            button.style.color = "#777"; // Reset text color on mouse out
        });
        button.addEventListener("click", async () => {
            console.log(`Attendance button clicked for class ID: ${classId}`);
            const input = await waitForElement("#form-entry input[name='code']", 5000);
            console.log(input);
            if (input && !input.getAttribute("flag")) {
                input.setAttribute("flag", "1");
                input.focus();

                input.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const button = document.querySelector(".button-send-entry");
                        if (button) {
                            button.click();
                        }
                    }
                });
            }
        });

        // addto top of ivy section
        ivy_section.insertBefore(button, ivy_section.firstChild);
    });


}


