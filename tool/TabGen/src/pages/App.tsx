import { useState } from "react";
// コンポーネントインポート
import MonthInput from "./MonthInput";
import TextInput from "./TextInput";
import GenerateBtn from "./GenerateBtn";
import { buildCalendarData, generateCalendarHtml } from "./utils/CalendarParts";

export default function App() {
    // トグルボタン開閉
    const [isOpen, setIsOpen] = useState(false);
    const toggleBtn = (): void => {
      if (isOpen) {
        setIsOpen(false);
      } else {
          setIsOpen(true);
      }
    }

    // 年月取得
    const nowData = new Date();
    const targetYear = nowData.getFullYear();
    const targetMonth = String(nowData.getMonth() + 1).padStart(2, "0");
    const [monthValue, setMonthValue] = useState(`${targetYear}-${targetMonth}`);

    const [inputValue, setInputValue] = useState("");

    //【ダウンロード処理関数】
    const calendarDownloadButton = async () => {
        if (!monthValue) {
            alert("年月入力欄が空です。");
            return;
        }

        const cleanInputValue = inputValue.trim();
        
        if (cleanInputValue === "") {
            alert("データ入力欄が空です。");
            return;
        }

        const [inputYear, inputMonth] = monthValue.split("-");
        const year = Number(inputYear);
        const month = Number(inputMonth);

        const cleaneCalendarData = buildCalendarData(cleanInputValue);
        const calendarHtmlContent = generateCalendarHtml(year, month, cleaneCalendarData);

        try {
            const htmlblob = new Blob([calendarHtmlContent], {type: 'text/html'});
            const plainblob = new Blob([calendarHtmlContent], {type: 'text/plain'});
            const clipboardItem = new ClipboardItem({
               'text/html': htmlblob,
               'text/plain': plainblob
        });

        await navigator.clipboard.write([clipboardItem]);

        setInputValue("");
        alert(`カレンダーの生成・コピーが完了しました。／貼り付け（Ctrl+V）をしてください。`);
        } catch (err) {
            console.error("コピーに失敗しました:", err);
            alert("クリップボードへのコピーに失敗しました。");
        }
    };

    // CSS
    const styles: { [key: string]: React.CSSProperties } = {
    fixedTool: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 100,  
    },
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