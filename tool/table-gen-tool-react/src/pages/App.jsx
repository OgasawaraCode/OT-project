import { useState } from "react";
// コンポーネント取得
import MonthInput from "./MonthInput";
import TextInput from "./TextInput";
import GenerateBtn from "./GenerateBtn";

export default function App() {
    // JS
    // トグルボタンの処理 初期値はクローズ
    const [isOpen, setIsOpen] = useState(false);
    const toggleBtn = () => {
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
    ///  【カレンダー用関数】
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function keepDigitsAndBuildCalendar(inputData) {

    // 項目全てに「満」が入った配列を作成
    let calendarResults = Array.from({ length: 31 }, function() {
        return {
            am: "満",
            pm: "満"
        };
    });

    // 入力データをカンマ、スペース、タブで区切って配列に入れる
    const inputParts = inputData.split(/[，,、\s]+/);

    // 区切った配列の各文字列に処理を追加
    inputParts.forEach((iPart) => {
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
        const daysStatus = (day) => {
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
        
        // 完成した31日分のデータを戻り値として外に返す
        return calendarResults;
    });
    }
    
    function generateCalendarHtml(year, month, calendarData) {
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
        }
    }

    // CSS
    const styles = {
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
    }
    };

    return (
        <div>
            <button onClick={toggleBtn}>📅</button>
            <div style={styles.container}>
                <MonthInput value={monthValue}/>
                <TextInput value={inputValue}/>
                <GenerateBtn/>
            </div>
        </div>
    );
}