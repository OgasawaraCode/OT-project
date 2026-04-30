// Tampermonkey code
const btn = document.createElement("button");
btn.innerHTML = "HTML生成ボタン";

document.body.appendChild(btn);

/**
 * @param {number} year
 * @param {number} month
 */

function handleExport() {
    generatetable();
    downloadHtml();
}

function  generatetable() {
    const firstDay = new Data(year, month - 1, 1).getDay();







    // const htmlContent = ``;
}

function downloadHtml() {
    const blob = new Blob(["<h1>hello world</h1>"], { type: 'text/html' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'index.html' });
    a.click();
    URL.revokeObjectURL(a.href);
}

btn.addEventListener("click", handleExport);