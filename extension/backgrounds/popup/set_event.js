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

document.addEventListener('DOMContentLoaded', function() {

    set_switch();

});

