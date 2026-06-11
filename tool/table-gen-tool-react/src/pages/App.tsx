import { useState } from "react";
// コンポーネント取得
import MonthInput from "./MonthInput";
import TextInput from "./TextInput";
import GenerateBtn from "./GenerateBtn";

// 関数の外で、amとpmに入る値を文字列として型定義（この時点では配列や変数と決まっている訳では無い）
interface CalendarInitialData {
    am: string;
    pm: string;
}

export default function App() {
    // JS
    // トグルボタンの処理 初期値はクローズ
    const [isOpen, setIsOpen] = useState(false);
    // 戻り値がないトグルボタン関数にvoidを指定
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
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///  【データ管理関数】データ管理関数で最終的に外に返される要素がCalendarInitialData配列に入る様に型定義
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function keepDigitsAndBuildCalendar(inputData: string): CalendarInitialData[] {

    // 文字列が入った要素を1個ずつ戻り値として受け取り、最終的にそれを31日分の配列として変数に入れる
    let calendarResults: CalendarInitialData[] = Array.from({ length: 31 }, function(): CalendarInitialData {
        return {
            am: "満",
            pm: "満"
        };
    });

    // 区切った要素を文字列の配列として型定義し変数に格納
    const inputParts: string[] = inputData.split(/[，,、\s]+/);

    // forEach処理を加える引数を文字列として型定義
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
        let cleanPart = converPart.replace(/[休]/g, "");

        // 下のforとifで貰った数値を引数dayに渡して番号として管理 ＋ amとpmに既に埋めてある「満」を条件によって「休」か「空」に変更
        // numberとしてを型定義、関数の戻り値にvoidを指定
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

            // startとendの両方が、有効な数値の場合の処理
            if (!isNaN(start) && !isNaN(end)) {
                const s = Math.min(start, end); // 最小値を取得
                const e = Math.max(start, end); // 最大値を取得
                // daysStatus関数に「表示用」の数値を代入する
                for (let j = s; j <= e; j = j + 1) {
                    daysStatus(j);
                }
            }
        // 数値にハイフンが無い場合の処理
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///  【HTML生成関数】
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function generateCalendarHtml(year: number, month: number, calendarData: CalendarInitialData[]) {
        // 月初、月末の取得
        const firstDay = new Date(year, month - 1, 1).getDay();
        const lastDate = new Date(year, month, 0).getDate();
        
        // カレンダーのHTML用空配列とカウント用変数
        let calendarRow = "";
        let dateCount = 1;
        
        // 全体の行
        for (let k = 0; k < 18; k++) {
            let row = "<tr>";
            // カウントリセット用の記述
            let retenCount = dateCount;
            
            // 1週間の処理
            for (let l = 0; l < 7; l++) {
                // 行の計算式 これをベースにifを展開する
                let firstRow = (k % 3 === 0);
                let secondRow = (k % 3 === 1);
                let thirdRow = (k % 3 === 2);
                
                // 月初、月末の前後を計算しないための記述
                let nowDate = !((k < 3 && l < firstDay) || retenCount > lastDate);
                
                // 3セットの処理
                if (firstRow) {
                    row += `<td colspan="2">${nowDate ? retenCount : ""}</td>`;
                } else if (secondRow) {
                    row += nowDate ? `<td>午前</td><td>午後</td>` : `<td></td><td></td>`;
                } else if (thirdRow) {
                    if (nowDate) {
                        const weekend = (l === 0 || l === 6);
                        const data = calendarData[retenCount - 1];
                        let amHl = weekend ? "休" : data.am;
                        let pmHl = weekend ? "休" : data.pm;
                        row += `<td>${amHl}</td><td>${pmHl}</td>`;
                    } else {
                        row += `<td></td><td></td>`;
                    }
                }
                // 空欄以外をカウントする
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
            // カウントが最終日を超えて、その週のセットが終わった時にカレンダー作成を強制終了
            if (dateCount > lastDate && k % 3 === 2) break;
        }
        
        // 生成したHTMLを戻り値として外に返す
        return `
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
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///  【ダウンロード処理関数】
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 戻り値がないダウンロードボタン関数にvoidを指定
    const calendarDownloadButton = (): void => {
        // 年月欄が空の時の処理
        if (!monthValue) {
            alert("年月入力欄が空です。");
            return;
        }
        
        // valueは無しで取得したデータ入力欄をトリミング
        const trimInputValue = inputValue.trim();
        
        // データ入力欄が空の時の処理
        if (trimInputValue === "") {
            alert("データ入力欄が空です。");
            return;
        }
        
        // 年月欄をハイフンで分割 その後に数値に変えて年と月を取得
        const [inputYear, inputMonth] = monthValue.split("-");
        const year = Number(inputYear);
        const month = Number(inputMonth);
        
        // データ管理関数に入力欄のデータを渡す
        const cleanedCalendarData = keepDigitsAndBuildCalendar(trimInputValue);
        // HTML生成関数へデータを渡す
        const calendarHtmlContent = generateCalendarHtml(year, month, cleanedCalendarData);
        
        // ダウンロードの処理
        const blob = new Blob([calendarHtmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${year}年${month}月_カレンダー.html`;
        a.click();
        URL.revokeObjectURL(url);
        
        // 入力欄のクリアとアラートを記述
        setInputValue("");
        alert(`カレンダーの生成／ダウンロードが完了しました。`);
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
    }
    };

    return (
        <div>
            <button style={styles.toggleBtn} onClick={toggleBtn}>📅</button>
            <div style={styles.container}>
                <MonthInput value={monthValue} onChange={(e) => setMonthValue(e.target.value)}/>
                <TextInput value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <GenerateBtn onClick={calendarDownloadButton}/>
            </div>
        </div>
    );
}