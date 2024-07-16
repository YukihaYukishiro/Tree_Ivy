document.addEventListener('DOMContentLoaded', function() {
    const switchInput = document.querySelector('.switch input[type="checkbox"]');
    const labelSwitch = switchInput.parentNode;

    // テキストノードをspanで囲む
    const nodes = Array.from(labelSwitch.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
    nodes.forEach(node => {
        const span = document.createElement('span');
        span.textContent = node.nodeValue.trim();
        labelSwitch.insertBefore(span, node);
        labelSwitch.removeChild(node);
    });

    const spans = labelSwitch.querySelectorAll('span');

    // 初期状態の設定
    spans[switchInput.checked ? 1 : 0].classList.add('highlight');

    switchInput.addEventListener('change', function() {
        spans.forEach(span => span.classList.toggle('highlight'));
    });
});
