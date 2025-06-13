async function apply_compactSchedule() {
    // wait for the timetable to load
    const tbody = await waitForElement("#div-top-timetable2 > table > tbody");
    const style = document.createElement('style');
    style.textContent = `
    .top-timetable-table-td {
        height: 35px;
    }
    `;
    // append the style to top of tbody
    tbody.prepend(style);
    const parents = document.querySelectorAll('.div-class-name');
    parents.forEach(function (parent) {
        // parent.querySelectorAll('br').forEach(function (br) {
        //     br.remove(); // remove all <br> elements
        // });
        parent.querySelectorAll('a.blue').forEach(function (link) {
            // add max-height: 1lh; to style
            link.style.maxHeight = '1.2em'; // 1lh is approximately 1.2em
            has_classname = true;
        });
        parent.querySelectorAll('div').forEach(function (div) {
            // get div which starts with '教室：'
            if (div.textContent.startsWith('教室：')) {
                
                div.classList.remove('text-center');
                div.classList.add('text-right');

                // surround text with small tag
                let innerText = div.textContent;

                let small = document.createElement('small');
                small.textContent = "教室 :";
                div.textContent = innerText.slice(3);
                div.prepend(small);
                
            }

            // a = button
            const links = div.querySelectorAll('a');
            if (links.length === 0) {
                return; // no links, skip
            }
            links.forEach(link => {
                if (link.textContent.includes('Zoom')) {

                    // simplify text
                    div.querySelector('a').innerText = 'Zoom';

                    div.classList.add('smallzoom');
                }
            });
            
            
        });
    });
    
}

function smallizeClassroom() {
    parents = document.querySelectorAll('.div-class-name');

    // get div which starts with '教室：'
    parents.forEach(function (parent) {
        parent.querySelectorAll('div').forEach(function (div) {
            if (div.textContent.startsWith('教室：')) {

                div.classList.remove('text-center');
                div.classList.add('text-right');

                // surround text with small tag
                let innerText = div.textContent;

                let small = document.createElement('small');
                small.textContent = "教室 :";
                div.textContent = innerText.slice(3);
                div.prepend(small);

            }
        });
    });
}

function zoomDivDown() {
    parents = document.querySelectorAll('.div-class-name');

    parents.forEach(function (parent) {
        parent.querySelectorAll('div').forEach(div => {

            // a = button
            const links = div.querySelectorAll('a');
            links.forEach(link => {
                if (link.textContent.includes('Zoom')) {

                    // simplify text
                    div.querySelector('a').innerText = 'Zoom';

                    div.classList.add('smallzoom');
                }
            });
        });
    });
}