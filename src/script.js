const dropZone = document.getElementById('drop-zone');
const output = document.getElementById('output');
const popup = document.getElementById('popup');

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#555';
});

dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#444';
});

dropZone.addEventListener('drop', async (event) => {
    event.preventDefault();
    dropZone.style.backgroundColor = '#444';
    output.drawContent = '';

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf') {
            const drawContent = await readText(file);
            output.innerHTML = markMaliciousCode(drawContent);
            if (codeCheck(drawContent)) {
                showPopup();
            }
        } else {
            output.drawContent = 'Please provide a valid PDF file to scan currently nothing else is supported';
        }
    }
});

async function readText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            resolve(text);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

function codeCheck(drawContent) {
    const keywordPattern = /\b(eval|function|if|else|switch|case|default|while|do|for|continue|break|return|throw|try|catch|finally|new|delete|typeof|instanceof|this|true|false|null|undefined)\b/gi;

    return keywordPattern.test(drawContent);
}

function showPopup() {
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}

function markMaliciousCode(drawContent) {
    const maliciousCodePattern = /\b(eval|document\.write|setTimeout|setInterval|Function)\b/gi;
    const formattedContent = drawContent.replace(maliciousCodePattern, '<span class="malicious">$&</span>');
    const formattedWithBreaks = formattedContent.replace(/\n/g, '<br>');
    return formattedWithBreaks;
}
