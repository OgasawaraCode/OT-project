import { useState } from "react";
// コンポーネント取得
import MonthInput from "./MonthInput";
import TextInput from "./TextInput";
import GenerateBtn from "./GenerateBtn";

// 関数の外で、amとpmに入る値を文字列として型定義
interface CalendarInitialData {
    am: string;
    pm: string;
}

//【データ管理関数】
function keepDigitsAndBuildCalendar(inputData: string): CalendarInitialData[] {
    
// 初期位置として午前午後に分けて値を「満」にする
let calendarResults: CalendarInitialData[] = Array.from({ length: 31 }, function(): CalendarInitialData {
    return {
        am: "満",
        pm: "満"
    };
});

// 区切った要素を文字列の配列として型定義し変数に格納
const inputParts: string[] = inputData.split(/[，,、\s]+/);

inputParts.forEach((iPart: string) => {
    // 休、午前、午後の検索結果を変数に格納
    const targetHl = /休$/i.test(iPart);
    const targetAm = /am$/i.test(iPart);
    const targetPm = /pm$/i.test(iPart);

    // 文字列から不要な要素を削除（am、pm、休）、全角数字も半角に変更
    let strDelete = iPart.replace(/[apmAPM]/g, "");
    let converPart = strDelete.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    // 文字列から「休」も削除
    let cleanPart = converPart.replace(/[休]/g, "");

    // 下のforとifで貰った数値を引数dayに渡して番号管理 + 午前午後に分けて値を「休」か「空」に変更
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

    //  綺麗にした配列（cleanPart）にハイフン類（-~ー～）が含まれているか確認
    if (cleanPart.includes("-") || cleanPart.includes("~") || cleanPart.includes("ー") || cleanPart.includes("～")) {
        // ハイフンで区切った文字列を配列に再格納、配列の1番目と2番目の数値を取得し変数に格納
        const hyphenDel = cleanPart.split(/[-~ー～]/);
        const start = Number(hyphenDel[0]);
        const end = Number(hyphenDel[1]);

        if (!isNaN(start) && !isNaN(end)) {
            const s = Math.min(start, end); // 最小値を取得
            const e = Math.max(start, end); // 最大値を取得
            // daysStatus関数に表示用の数値を代入する
            for (let j = s; j <= e; j = j + 1) {
                daysStatus(j);
            }
        }
    // 「-」無し数値の処理
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
function generateCalendarHtml(year: number, month: number, calendarData: CalendarInitialData[]) {
    // 月初、月末の取得
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    // カレンダーのHTML用空配列
    let calendarRow = "";
    // カウント用変数
    let dateCount = 1;

    // 全体の行
    for (let k = 0; k < 18; k++) {
        let row = "<tr>";
        // カウントリセット
        let retenCount = dateCount;

        // 1週間の処理
        for (let l = 0; l < 7; l++) {
            // 行の計算式
            let firstRow = (k % 3 === 0);
            let secondRow = (k % 3 === 1);
            let thirdRow = (k % 3 === 2);

            // 月初、月末の前後を計算しない為の記述
            let nowDate = !((k < 3 && l < firstDay) || retenCount > lastDate);

            // 3セットの処理
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
            // 空欄以外をカウント
            if (!(k < 3 && l < firstDay)) {
                retenCount++;
            }
        }

        row += "</tr>";
        calendarRow += row;
        
        // 3セット目から再カウント
        if (k % 3 === 2) {
            dateCount = retenCount;
        }
        // カウントが最終日を超えて、その週のセットが終わった時にカレンダー生成を強制終了
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

export default function App() {
    // トグルボタンの処理 初期値はクローズ
    const [isOpen, setIsOpen] = useState(false);
    const toggleBtn = (): void => {
      if (isOpen) {
        setIsOpen(false);
      } else {
          setIsOpen(true);
      }
    }
    // 現在の年月を取得
    const nowData = new Date();
    const targetYear = nowData.getFullYear();
    const targetMonth = String(nowData.getMonth() + 1).padStart(2, "0");
    const [monthValue, setMonthValue] = useState(`${targetYear}-${targetMonth}`);

    // インプットタグの入力値設定
    const [inputValue, setInputValue] = useState("");

    //【ダウンロード処理関数】
    const calendarDownloadButton = async () => {
        if (!monthValue) {
            alert("年月入力欄が空です。");
            return;
        }

        // 取得したデータ入力欄をトリミング
        const trimInputValue = inputValue.trim();
        
        if (trimInputValue === "") {
            alert("データ入力欄が空です。");
            return;
        }

        // 年月を分割して数値化
        const [inputYear, inputMonth] = monthValue.split("-");
        const year = Number(inputYear);
        const month = Number(inputMonth);

        // データ管理関数に入力欄のデータを渡す
        const cleanedCalendarData = keepDigitsAndBuildCalendar(trimInputValue);
        // HTML生成関数へデータを渡す
        const calendarHtmlContent = generateCalendarHtml(year, month, cleanedCalendarData);

        // データをクリップボードに保存
        try {
            const htmlblob = new Blob([calendarHtmlContent], {type: 'text/html'});
            const plainblob = new Blob([calendarHtmlContent], {type: 'text/plain'});
            const clipboardItem = new ClipboardItem({
               'text/html': htmlblob,
               'text/plain': plainblob
        });

        await navigator.clipboard.write([clipboardItem]);

        // 入力欄のクリアとアラート
        setInputValue("");
        alert(`カレンダーの生成／コピーが完了しました。／貼り付け（Ctrl+V）をしてください。`);
        } catch (err) {
            console.error("コピーに失敗しました:", err);
            alert("クリップボードへのコピーに失敗しました。");
        }
    };

    // CSS
    const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: '200px',
      padding: '10px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      // アニメーション処理
      transition: 'all 0.4s ease',
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
      visibility: isOpen ? 'visible' : 'hidden'
    },
    toggleBtn: {
        display: 'block',
        backgroundColor: '#efefef',
        padding: '8px 12px',
        borderRadius: '4px',
        marginBottom: '5px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    },
    fixedTool: {
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 100,
        }
    };

    return (
        <div style={styles.fixedTool}>
            <button style={styles.toggleBtn} onClick={toggleBtn}>📅</button>
            <div style={styles.container}>
                <MonthInput value={monthValue} onChange={(e) => setMonthValue(e.target.value)}/>
                <TextInput value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <GenerateBtn onClick={calendarDownloadButton}/>
            </div>
        </div>
    );
}