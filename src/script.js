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

function showPopup() {
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 10000); // 10k milisecond timeout so the popup will be gone after
}

function markMaliciousCode(drawContent) {
    const keywords = ['eval', 'const', 'document.write', 'setTimeout', 'setInterval', 'Function']; // Where we store out keywords

    for (const keyword of keywords) {
        const keywordPattern = new RegExp('\\b' + keyword + '\\b', 'gi');
        drawContent = drawContent.replace(keywordPattern, `*${keyword}*`);
    }

    return drawContent;
}
