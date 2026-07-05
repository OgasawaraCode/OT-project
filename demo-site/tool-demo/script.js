let currentMode = 'manual';
let isFullscreen = false;

function selectComponent(event) {
    event.stopPropagation();
    document.getElementById('calendarComponent').classList.add('is-selected');
}

document.addEventListener('click', function() {
    const component = document.getElementById('calendarComponent');
    if (component) component.classList.remove('is-selected');
});

function toggleFullscreen() {
    const modal = document.getElementById('modalWindow');
    const btn = document.getElementById('resizeBtn');
    isFullscreen = !isFullscreen;
    if (isFullscreen) { 
        modal.classList.add('is-fullscreen'); 
        btn.innerText = '縮小'; 
    } else { 
        modal.classList.remove('is-fullscreen'); 
        btn.innerText = '拡大'; 
    }
}

function openModal(event) {
    event.stopPropagation();
    const currentHTML = document.getElementById('calendarContainer').querySelector('table').outerHTML;
    const wrapper = document.getElementById('manualCalendarWrapper');
    wrapper.innerHTML = currentHTML;
    
    setupAllEditableCells(wrapper);

    document.getElementById('htmlInput').value = currentHTML.trim();
    document.getElementById('editModal').style.display = 'flex';
}

function setupAllEditableCells(wrapper) {
    const cells = wrapper.querySelectorAll('table td');
    cells.forEach(cell => {
        if (cell.innerText.trim() !== '' || cell.hasAttribute('colspan')) {
            cell.setAttribute('contenteditable', 'true');
            cell.addEventListener('keydown', handleCellKeyDown);
            cell.addEventListener('input', syncToHTMLTextArea);
            cell.addEventListener('blur', syncToHTMLTextArea);
        }
    });
}

function handleCellKeyDown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.innerText = ''; 
        this.blur(); 
        syncToHTMLTextArea();
    }
}

function syncToHTMLTextArea() {
    const wrapper = document.getElementById('manualCalendarWrapper');
    const currentEditingHTML = wrapper.querySelector('table').outerHTML;
    document.getElementById('htmlInput').value = currentEditingHTML.trim();
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    if(isFullscreen) toggleFullscreen(); 
}

function switchTab(mode) {
    currentMode = mode;
    const manualTab = document.getElementById('tab-manual-btn');
    const htmlTab = document.getElementById('tab-html-btn');
    const manualContent = document.getElementById('mode-manual');
    const htmlContent = document.getElementById('mode-html');

    if (mode === 'manual') {
        const currentHTMLText = document.getElementById('htmlInput').value;
        const wrapper = document.getElementById('manualCalendarWrapper');
        wrapper.innerHTML = currentHTMLText;
        setupAllEditableCells(wrapper);
        manualTab.classList.add('is-active');
        htmlTab.classList.remove('is-active');
        manualContent.classList.add('is-active');
        htmlContent.classList.remove('is-active');
    } else {
        syncToHTMLTextArea();
        manualTab.classList.remove('is-active');
        htmlTab.classList.add('is-active');
        manualContent.classList.remove('is-active');
        htmlContent.classList.add('is-active');
    }
}

function saveComponent() {
    const finalHTML = document.getElementById('htmlInput').value;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = finalHTML;
    
    tempDiv.querySelectorAll('td').forEach(cell => {
        cell.removeAttribute('contenteditable');
    });

    document.getElementById('calendarContainer').innerHTML = tempDiv.innerHTML;
    closeModal();
}

const tgBtn = document.querySelector(".tool-toggle-btn");
const iptContainer = document.querySelector(".tool-input-container");
let tgAction = true;

tgBtn.addEventListener("click", () => {
    if (tgAction) {
        iptContainer.style.display = "block";
        iptContainer.animate([
            {opacity: 0, transform: "translateY(-10px)"},
            {opacity: 1, transform: "translateY(0)"}
        ], { duration: 400, easing: "ease", fill: "forwards" });
    } else {
        const tgAnimation = iptContainer.animate([
            {opacity: 1, transform: "translateY(0)"},
            {opacity: 0, transform: "translateY(-10px)"}
        ], { duration: 300, easing: "ease", fill: "forwards" });
        tgAnimation.onfinish = () => { iptContainer.style.display = "none"; };
    }
    tgAction = !tgAction;
});

const monthInput = document.querySelector(".tool-input-month");
const nowData = new Date();
const targetYear = nowData.getFullYear();
const targetMonth = String(nowData.getMonth() + 1).padStart(2, "0");
monthInput.value = `${targetYear}-${targetMonth}`;

function keepDigitsAndBuildCalendar(inputData) {
    let calendarResults = Array.from({ length: 31 }, function() {
        return { am: "満", pm: "満" };
    });

    const inputParts = inputData.split(/[，,、\s]+/);

    inputParts.forEach((iPart) => {
        let normaltext = iPart.toLowerCase();

        normaltext = normaltext.replace(/[０-９ａ-ｚ]/g, s => {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        }).replace(/－/g, "-");

        const targetHl = /休$/i.test(normaltext);
        const targetAm = /am/i.test(normaltext);
        const targetPm = /pm/i.test(normaltext);

        let cleanPart = normaltext.replace(/[^0-9\-~ー～]/g, "");

        const daysStatus = (day) => {
            if (day >= 1 && day <= 31) {
                let holOrEmpty = targetHl ? "休" : "空";
                if (targetAm) {
                    calendarResults[day - 1].am = holOrEmpty;
                } else if (targetPm) {
                    calendarResults[day - 1].pm = holOrEmpty;
                } else {
                    calendarResults[day - 1].am = holOrEmpty;
                    calendarResults[day - 1].pm = holOrEmpty;
                }
            }
        };

        if (cleanPart.includes("-") || cleanPart.includes("~") || cleanPart.includes("ー") || cleanPart.includes("～")) {
            const hyphenDel = cleanPart.split(/[-~ー～]/);
            const start = Number(hyphenDel[0]);
            const end = Number(hyphenDel[1]);

            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.min(start, end);
                const e = Math.max(start, end);
                for (let j = s; j <= e; j++) {
                    daysStatus(j);
                }
            }
        } else {
            const singleNb = Number(cleanPart);
            if (!isNaN(singleNb)) {
                daysStatus(singleNb);
            }
        }
    });
    return calendarResults;
}

function generateCalendarHtml(year, month, calendarData) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    let calendarRow = "";
    let dateCount = 1;

    for (let k = 0; k < 18; k++) {
        let row = "<tr>";
        let retenCount = dateCount;

        for (let l = 0; l < 7; l++) {
            let firstRow = (k % 3 === 0);
            let secondRow = (k % 3 === 1);
            let thirdRow = (k % 3 === 2);

            let nowDate = !((k < 3 && l < firstDay) || retenCount > lastDate);

            if (firstRow) {
                row += `<td colspan="2">${nowDate ? retenCount : ""}</td>\n`;
            } else if (secondRow) {
                row += nowDate ? `<td>午前</td>\n<td>午後</td>\n` : `<td></td>\n<td></td>\n`;
            } else if (thirdRow) {
                if (nowDate) {
                    const weekend = (l === 0 || l === 6);
                    const data = calendarData[retenCount - 1];
                    let amHl = weekend ? "休" : data.am;
                    let pmHl = weekend ? "休" : data.pm;
                    row += `<td>${amHl}</td>\n<td>${pmHl}</td>\n`;
                } else {
                    row += `<td></td>\n<td></td>\n`;
                }
            }
            if (!(k < 3 && l < firstDay)) {
                retenCount++;
            }
        }

        row += "</tr>";
        calendarRow += row;
        
        if (k % 3 === 2) {
            dateCount = retenCount;
        }
        if (dateCount > lastDate && k % 3 === 2) break;
    }

    return `
<table border="0" cellpadding="0" cellspacing="0" width="1000">
<tbody><tr><td colspan="14">${year}年${month}月</td>
</tr><tr><td colspan="2" style="background: #999;">日</td>
<td colspan="2" style="background: #999;">月</td>
<td colspan="2" style="background: #999;">火</td>
<td colspan="2" style="background: #999;">水</td>
<td colspan="2" style="background: #999;">木</td>
<td colspan="2" style="background: #999;">金</td>
<td colspan="2" style="background: #999;">土</td>
</tr>${calendarRow}</tbody></table>`;
}

const generateBtn = document.querySelector(".tool-generate-btn");
const inputField = document.querySelector(".tool-input-field");

generateBtn.addEventListener("click", async () => {
    if (!monthInput.value) {
        alert("年月入力欄が空です。");
        return;
    }

    const trimInputValue = inputField.value.trim();
    if (trimInputValue === "") {
        alert("データ入力欄が空です。");
        return;
    }

    const [inputYear, inputMonth] = monthInput.value.split("-");
    const year = Number(inputYear);
    const month = Number(inputMonth);

    const cleanedCalendarData = keepDigitsAndBuildCalendar(trimInputValue);
    const calendarHtmlContent = generateCalendarHtml(year, month, cleanedCalendarData);

    try {
        const htmlblob = new Blob([calendarHtmlContent], {type: 'text/html'});
        const plainblob = new Blob([calendarHtmlContent], {type: 'text/plain'});
        const clipboardItem = new ClipboardItem({
           'text/html': htmlblob,
           'text/plain': plainblob
        });

        await navigator.clipboard.write([clipboardItem]);

        document.getElementById('calendarContainer').innerHTML = calendarHtmlContent;
        document.getElementById('htmlInput').value = calendarHtmlContent.trim();

        inputField.value = "";
        alert(`カレンダーの生成／コピーが完了しました。／貼り付け（Ctrl+V）をしてください。`);
    } catch (err) {
        console.error("コピーに失敗しました:", err);
<<<<<<< Updated upstream
        
        document.getElementById('calendarContainer').innerHTML = calendarHtmlContent;
        document.getElementById('htmlInput').value = calendarHtmlContent.trim();
        inputField.value = "";
        alert(`${year}年${month}月のカレンダーをプレビューに反映しました。（コピー処理はスキップされました）`);
=======
        alert("クリップボードへのコピーに失敗しました。");
>>>>>>> Stashed changes
    }
});