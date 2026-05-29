// ＊＊UIエリア構築＊＊
// 処理を軽くするためにDOMコンテンツを一括で構築する方法に変更 CSSも一緒に追加
const htmlContent = `
<button class="toggle-btn" style="display: block; background-color: #efefef; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 5px; border: none; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">📅</button>
<div class="input-container" style="background-color: #ffffff; width: 200px; padding: 10px; border-radius: 8px; box-sizing: 0 4px 12px rgba(0,0,0,0.15); display: none;">
    <input class="input-month" type="month" style="display: block; width: 145px; color: #333; padding: 5px; margin-bottom: 10px; border-radius: 4px;">
    <label style="display: block; color: #333; font-size: 12px;">
        空日／休日を記入↓
        <input class="input-field" type="text" style="display: block; width: 170px; height: 25px; margin-top: 5px; margin-bottom: 10px;">
    </label>
    <p style="font-size: 10px; color: #666; margin-top: 0; margin-bottom: 10px; line-height: 1.2;">※入力例：1,2-4,5am,6pm,7~15休<br>※5-7pmなどの範囲指定も可</p>
    <button class="input-button" style="display: block; margin-bottom: 8px; background-color: #007bff; color: #ffffff; border-radius: 4px; border: none; padding: 4px 12px;">実行</button>
    <button style="width: 150px; height: 30px; background-color: #c82333; color: #ffffff; font-size: 12px; border: none; border-radius: 4px; padding: 6px 10px;">カレンダー生成ボタン</button>
</div>
`;
// 大枠のdivだけDON操作する
const div = document.createElement("div");
div.style.cssText = "position: fixed; top: 10px; left: 10px; z-index: 1000;"
div.innerHTML = htmlContent;
document.body.appendChild(div);

// ＊＊UI機能実装＊＊
// DOMのクラスを取得
const tgBtn = document.querySelector(".toggle-btn");
const iptContainer = document.querySelector(".input-container");

// 初期設定として状態を「true」に設定（最初に読み込まれるコードを指定）
let tgAction = true;

// トグルボタンのクリックイベント
tgBtn.addEventListener("click", () => {
    // 最初にここが読まれる ボタンの状態を「非表示」から「表示」に変動
    if (tgAction) {
        iptContainer.style.display = "block";
        
        // トグルボタンのアニメーション（非表示時に少し上に上げる、0,4秒間で、緩急追加、状態キープ）
        iptContainer.animate([
            {opacity: 0, transform: "translateY(-10px)"},
            {opacity: 1, transform: "translateY(0)"}
        ], {
            duration: 400,
            easing: "ease",
            fill: "forwards"
        });
        // トグルボタンが開いた後にここが読まれる ボタンの状態を「表示」から「非表示」に変動
    } else {
        
        // トグルボタンのアニメーション（非表示時に少し上に上げる、0,3秒間で、緩急追加、状態キープ）
        const tgAnimation = iptContainer.animate([
            {opacity: 1, transform: "translateY(0)"},
            {opacity: 0, transform: "translateY(-10px)"}
        ], {
            duration: 300,
            easing: "ease",
            fill: "forwards"
        });

        // ここで「非表示」になる
        tgAnimation.onfinish = () => {
            iptContainer.style.display = "none";
        };
    }
    
    // 【重要】状態のスイッチ ボタン開く → 閉じると繰り返す事が出来る
    tgAction = !tgAction;
});

// データ洗浄＋配列作成用関数
function cleansingAndBuildCalendar(inputData) {
// 最終的なカレンダーの配列データ
let calendarResults = [];
    // 入力欄が空の場合、全部に「満」を入れる
    if (inputData === "") {
        for (let d = 0; d < 31; d++) {
            let daysData = {
                am: "満",
                pm: "満"
            };
          calendarResults.push(daysData);
        }
    }
    // 入力データをカンマ、スペース、タブで区切って配列に入れる
    const inputParts = inputData.split(/[，,、\s]+/);
    
    // 配列の1つずつの文字列に各処理を加える
    inputParts.forEach(iPart => {
        // 入力データから「休」「午前」「午後」を検索
        const targetHl = /休$/i.test(iPart);
        const targetAm = /am$/i.test(iPart);
        const targetPm = /pm$/i.test(iPart);
        
        // 文字列からアルファベットを削除し、全角数字を半角に変更
        let strDelete = iPart.replace(/[apmAPM]/g, "");
        let cleanPart = strDelete.replace(/[０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        return cleanPart;
        
        // 【データ管理】数字以外の検索結果を利用して配列データに格納
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
    });
};