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

function  generatetable(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    let calendarRow = "";
    let dateCount = 1;

    for (let i = 0; i < 6; i++) {
        let row = "<tr>";

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay || dateCount > lastDate) {
                row += "<td></td>";
            }
        }

        row += "</tr>";
        calendarRow += row;
        if (dateCount > lastDate) break;
    }

    const htmlContent = `
<table border="0" cellpadding="0" cellspacing="0" width="1008">
    <tbody>
        ${calendarRow}
    </tbody>
</table>`;
}

function downloadHtml() {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'index.html' });
    a.click();
    URL.revokeObjectURL(a.href);
}

btn.addEventListener("click", handleExport);