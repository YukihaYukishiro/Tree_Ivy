// common

function set_switch() {
    const switchInputs = document.querySelectorAll('.switch input[type="checkbox"]');
    switchInputs.forEach(switchInput => {
        const spans = switchInput.parentNode.querySelectorAll('span');

        // 初期状態の設定
        spans[switchInput.checked ? 1 : 0].classList.add('highlight');

        switchInput.addEventListener('change', function() {
            spans.forEach(span => span.classList.toggle('highlight'));
        });
    });
}

function set_choice() {
    const choiceInputs = document.querySelectorAll('.choice input[type="radio"]');
    
    choiceInputs.forEach(choiceInput => {

        // 初期状態の設定
        if (choiceInput.checked) {
            choiceInput.parentNode.classList.add('highlight');
        }

        choiceInput.addEventListener('change', function() {
            choiceInputs.forEach(input => {
                input.parentNode.classList.remove('highlight');
            });
            choiceInput.parentNode.classList.add('highlight');
        });
    });
}

// unique


document.addEventListener('DOMContentLoaded', function() {

    set_switch();
    set_choice();

});


