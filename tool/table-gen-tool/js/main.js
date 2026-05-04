// Tampermonkey code
// UIエリア
const toggleBtn = document.createElement("button");
toggleBtn.innerHTML = "📅";
toggleBtn.style.backgroundColor = "#f4f4f4";
toggleBtn.style.padding = "8px 12px";
toggleBtn.style.borderRadius = "4px";
toggleBtn.style.cursor = "pointer";
toggleBtn.style.marginBottom = "5px";
toggleBtn.style.display = "block";
toggleBtn.style.border = "none";
toggleBtn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
document.body.appendChild(toggleBtn);

const container = document.createElement("div");
container.style.backgroundColor = "#fff";
container.style.width = "200px";
container.style.borderRadius = "8px";
container.style.padding = "10px";
container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
container.style.display = "none";
document.body.appendChild(container);

const monthInput = document.createElement("input");
monthInput.type = "month";
monthInput.style.display = "block";
monthInput.style.width = "145px";
monthInput.style.color = "#333";
monthInput.style.padding = "5px";
monthInput.style.marginTop = "10px";
monthInput.style.borderRadius = "4px";
container.appendChild(monthInput);

const freeLabel = document.createElement("label");
freeLabel.style.display = "block";
freeLabel.style.color = "#333";
freeLabel.innerHTML = "空の日のみを記入";
freeLabel.style.fontSize = "14px";
container.appendChild(freeLabel);

const freeInput = document.createElement("input");
freeInput.type = "text";
freeInput.style.display = "block";
freeInput.style.width = "170px";
freeInput.style.height = "25px";
freeInput.style.marginTop = "5px";
freeInput.style.marginBottom = "10px";
container.appendChild(freeInput);

const freeBtn = document.createElement("button");
freeBtn.innerHTML = "実行";
freeBtn.style.display = "block";
freeBtn.style.marginBottom = "8px";
freeBtn.style.backgroundColor = "#007bff";
freeBtn.style.color = "#fff";
freeBtn.style.border = "none";
freeBtn.style.borderRadius = "4px";
freeBtn.style.padding = "4px 12px";
container.appendChild(freeBtn);

const downloadBtn = document.createElement("button");
downloadBtn.innerHTML = "カレンダー生成ボタン";
downloadBtn.style.backgroundColor = "#c82333";
downloadBtn.style.color = "#fff";
downloadBtn.style.border = "none";
downloadBtn.style.borderRadius = "4px";
downloadBtn.style.fontSize = "12px";
downloadBtn.style.padding = "6px 10px";
downloadBtn.style.width = "140px";
downloadBtn.style.height = "30px";
container.appendChild(downloadBtn);

const now = new Date();
monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
container.appendChild(monthInput);

// UI用JS
toggleBtn.addEventListener("click", () => {
    if (container.style.display === "none") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
});

let calendarResults = [];

freeBtn.addEventListener("click", () => {
    const inputValue = freeInput.value.trim();

    if (inputValue === "") {
        alert("入力欄が空です。");
        return;
    }

    calendarResults = new Array(31).fill("満");

    const parts = inputValue.split(/[，,、\s]+/);

    parts.forEach(part => {
        if (part.includes("-") || part.includes("〜") || part.includes("~")) {
            const range = part.split(/[-〜~]/);
            const start = parseInt(range[0].replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)));
            const end = parseInt(range[1].replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)));

            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.min(start, end);
                const e = Math.max(start, end);
                for (let i = s; i <= e; i++) {
                    if (i >= 1 && i <= 31) {
                        calendarResults[i - 1] = "空";
                    }
                }
            }
        } else {
            const day = parseInt(part.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)));
            if (!isNaN(day) && day >= 1 && day <= 31) {
                calendarResults[day - 1] = "空";
            }
        }
    });

    freeInput.value = "";

    alert("カレンダーを更新しました。");
});

function handleExport() {
    if (!monthInput.value) {
        alert("年月を選択してください。");
        return;
    }

    const [year, month] = monthInput.value.split("-").map(Number);
    buildCalendarHtml(year, month);
}

/**
 * @param {number} year
 * @param {number} month
 */
function  buildCalendarHtml(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    let calendarRow = "";
    let dateCount = 1;

    for (let i = 0; i < 18; i++) {
        let row = "<tr>";
        let retenCount = dateCount;

        for (let j = 0; j < 7; j++) {
            let firstRow = (i % 3 === 0);
            let secondRow = (i % 3 === 1);
            let thirdRow = (i % 3 === 2);

            let nowDate = !((i < 3 && j < firstDay) || retenCount > lastDate);

            if (firstRow) {
                row += `<td colspan="2">${nowDate ? retenCount : ""}</td>`;
            } else if (secondRow) {
                row += nowDate ? `<td>午前</td><td>午後</td>` : `<td colspan="2"></td>`;
            } else if (thirdRow) {
                const mark = (nowDate && calendarResults[retenCount - 1]) ? calendarResults[retenCount - 1] : "";
                row += `<td colspan="2">${mark}</td>`;
            }

            if (!(i < 3 && j < firstDay)) {
                retenCount++;
            }
        }

        row += "</tr>";
        calendarRow += row;
        
        if (i % 3 === 2) {
            dateCount = retenCount;
        }
        
        if (dateCount > lastDate && i % 3 === 2) break;
    }

    const htmlContent = `
    <table border="0" cellpadding="0" cellspacing="0" width="1000">
        <tbody>
            <tr><td colspan="14">${year}年${month}月</td></tr>
            <tr><td colspan="2" style="background: #999;">日</td>
            <td colspan="2" style="background: #999;">月</td>
            <td colspan="2" style="background: #999;">火</td>
            <td colspan="2" style="background: #999;">水</td>
            <td colspan="2" style="background: #999;">木</td>
            <td colspan="2" style="background: #999;">金</td>
            <td colspan="2" style="background: #999;">土</td>
            </tr>
            ${calendarRow}
        </tbody>
    </table>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `最新カレンダー.html`
    a.click();
    URL.revokeObjectURL(url);
}

downloadBtn.addEventListener("click", handleExport);