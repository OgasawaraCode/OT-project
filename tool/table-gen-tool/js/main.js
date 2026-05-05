// Tampermonkey code
// UIエリア
const togglecontainer = document.createElement("div");
togglecontainer.style.position = "fixed";
togglecontainer.style.top = "10px";
togglecontainer.style.left = "10px";
togglecontainer.style.zIndex = "1000";
document.body.appendChild(togglecontainer);

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
togglecontainer.appendChild(toggleBtn);

const container = document.createElement("div");
container.style.backgroundColor = "#fff";
container.style.width = "200px";
container.style.borderRadius = "8px";
container.style.padding = "10px";
container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
container.style.display = "none";
togglecontainer.appendChild(container);

const monthInput = document.createElement("input");
monthInput.type = "month";
monthInput.style.display = "block";
monthInput.style.width = "145px";
monthInput.style.color = "#333";
monthInput.style.padding = "5px";
monthInput.style.marginBottom = "10px";
monthInput.style.borderRadius = "4px";
container.appendChild(monthInput);

const freeLabel = document.createElement("label");
freeLabel.style.display = "block";
freeLabel.style.color = "#333";
freeLabel.innerHTML = "空日のみを記入↓";
freeLabel.style.fontSize = "12px";
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
freeBtn.innerHTML = "1.実行";
freeBtn.style.display = "block";
freeBtn.style.marginBottom = "8px";
freeBtn.style.backgroundColor = "#007bff";
freeBtn.style.color = "#fff";
freeBtn.style.border = "none";
freeBtn.style.borderRadius = "4px";
freeBtn.style.padding = "4px 12px";
container.appendChild(freeBtn);

const helpText = document.createElement("p");
helpText.innerHTML = "※入力例：1,2-4,5am,6pm,7~15休<br>※5-7pmなどの範囲指定も可";
helpText.style.fontSize = "10px";
helpText.style.color = "#666";
helpText.style.marginTop = "0px";
helpText.style.marginBottom = "10px";
helpText.style.lineHeight = "1.2";
container.insertBefore(helpText, freeBtn);

const downloadBtn = document.createElement("button");
downloadBtn.innerHTML = "2.カレンダー生成ボタン";
downloadBtn.style.backgroundColor = "#c82333";
downloadBtn.style.color = "#fff";
downloadBtn.style.border = "none";
downloadBtn.style.borderRadius = "4px";
downloadBtn.style.fontSize = "12px";
downloadBtn.style.padding = "6px 10px";
downloadBtn.style.width = "150px";
downloadBtn.style.height = "30px";
container.appendChild(downloadBtn);

const now = new Date();
const targetYear = now.getFullYear();
const targetMonth = String(now.getMonth() + 1).padStart(2, '0');
monthInput.value = `${targetYear}-${targetMonth}`;

// UI用JS
toggleBtn.addEventListener("click", () => {
    const hidden = window.getComputedStyle(container).display === "none" || container.style.opacity === "0";

    if (hidden) {
        container.style.display = "block";
        
        container.animate([
            { opacity: 0, transform: "translateY(-10px)" },
            { opacity: 1, transform: "translateY(0)" }
        ], {
            duration: 400,
            easing: "ease",
            fill: "forwards"
        });

    } else {
        const animation = container.animate([
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-10px)" }
        ], {
            duration: 300,
            easing: "ease",
            fill: "forwards"
        });

        animation.onfinish = () => {
            container.style.display = "none";
        };
    }
});

let calendarResults = [];

for (let d = 0; d < 31; d++) {
    let dayStatus = {
        am: "満",
        pm: "満"
    };

    calendarResults.push(dayStatus);
}

freeBtn.addEventListener("click", () => {
    const inputValue = freeInput.value.trim();

    if (inputValue === "") {
        alert("入力欄が空です。");
        return;
    }

    const parts = inputValue.split(/[，,、\s]+/);

    parts.forEach(part => {
        const targetAm = /am$/i.test(part);
        const targetPm = /pm$/i.test(part);
        const targetHol = /休$/i.test(part);

        const setStatus = (day) => {
            if (day >= 1 && day <= 31) {
                let HolFree = targetHol ? "休" : "空";

                if (targetAm) {
                    calendarResults[day - 1].am = HolFree;
                } else if (targetPm) {
                    calendarResults[day - 1].pm = HolFree;
                } else {
                    calendarResults[day - 1].am = HolFree;
                    calendarResults[day - 1].pm = HolFree;
                }
            }
        };

        let convert1 = part.replace(/[apmAPM]/g, "");
        let convert2 = convert1.replace(/[０-９]/g, function(s) {
            let charCode = s.charCodeAt(0);
            let halfCode = charCode - 0xFEE0;
            return String.fromCharCode(halfCode);
        });

        const cleanPart = convert2;

        if (cleanPart.includes("-") || cleanPart.includes("〜") || cleanPart.includes("~")) {
            const days = cleanPart.split(/[-〜~]/);
            const start = parseInt(days[0]);
            const end = parseInt(days[1]);

            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.min(start, end);
                const e = Math.max(start, end);
                for (let i = s; i <= e; i++) {
                    setStatus(i);
                }
            }
        } else {
            const day = parseInt(cleanPart);
            if (!isNaN(day)) {
                setStatus(day);
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

    const [inputYear, inputMonth] = monthInput.value.split("-");
    const year = Number(inputYear);
    const month = Number(inputMonth);
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
                row += nowDate ? `<td>午前</td><td>午後</td>` : `<td></td><td></td>`;
            } else if (thirdRow) {
                if (nowDate) {
                    const weekend = (j === 0 || j === 6);
                    const data = calendarResults[retenCount - 1];
                    let amHol = weekend ? "休" : data.am;
                    let pmHol = weekend ? "休" : data.pm;
                    row += `<td>${amHol}</td><td>${pmHol}</td>`;
                } else {
                    row += `<td></td><td></td>`;
                }
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
    a.download = `最新のカレンダー.html`
    a.click();
    URL.revokeObjectURL(url);
}

downloadBtn.addEventListener("click", () => {
    alert("カレンダーを生成しました。");
    handleExport();
});