// CalendarParts.ts
interface CalendarInitialData {
    am: string;
    pm: string;
}

//【データ管理関数】
export function buildCalendarData(inputData: string): CalendarInitialData[] {
    
let calendarResults: CalendarInitialData[] = Array.from({ length: 31 }, function(): CalendarInitialData {
    return {
        am: "満",
        pm: "満"
    };
});

const inputParts: string[] = inputData.split(/[，,、\s]+/);

inputParts.forEach((iPart: string) => {
    const targetHl = /休$/i.test(iPart);
    const targetAm = /[amａｍ]$/i.test(iPart);
    const targetPm = /[pmｐｍ]$/i.test(iPart);

    let stringDel = iPart.replace(/[apmAPMａ-ｚＡ-Ｚ]/g, "");
    
    let converPart = stringDel.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    let cleanPart = converPart.replace(/[休]/g, "");

    const daysStatus = (day: number): void => {
        if (day >= 1 && day <= 31) {
            let holOrEmpty = "空";
            if (targetHl === true) {
                holOrEmpty = "休";
            }
            if (targetAm === true) {
                calendarResults[day - 1].am = holOrEmpty;
            } else if (targetPm === true) {
                calendarResults[day - 1].pm = holOrEmpty;
            } else {
                calendarResults[day - 1].am = holOrEmpty;
                calendarResults[day - 1].pm = holOrEmpty;
            }
        }
    };

    if (cleanPart.includes("-") || cleanPart.includes("~") || cleanPart.includes("ー") || cleanPart.includes("～") || cleanPart.includes("－")) {
        
        const hyphenDel = cleanPart.split(/[-~ー～－]/);
        const start = Number(hyphenDel[0]);
        const end = Number(hyphenDel[1]);

        if (!isNaN(start) && !isNaN(end)) {
            const s = Math.min(start, end);
            const e = Math.max(start, end);
            for (let j = s; j <= e; j = j + 1) {
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
    // 完成した31日分のデータを戻り値として外に返す
    return calendarResults;
}

//【HTML生成関数】
export function generateCalendarHtml(year: number, month: number, calendarData: CalendarInitialData[]): string {
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

    // 生成したHTMLを戻り値として外に返す
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