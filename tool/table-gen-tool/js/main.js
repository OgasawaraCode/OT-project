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

// 入力データ整理 → 現在の年月を取得 → カレンダー生成関数（一塊に変更）
function buildCalendar() {
// 入力データの管理
    // DOMのクラスを取得
    const inputField = document.querySelector(".input-field");
    
    // inputタグの入力データを取り出す
    const textInputVal = inputField.value.trim();
    // 読点が入っている入力データを分割
    const divisionInput = textInputVal.split(/[，,、\s]+/);
    // 入力データの不要な文字を削除
    const alphabetDeleteInput = divisionInput.replace(/[apmAPM]/g, "");
    // 大文字の数字を小文字に変換
    const cleanInput = alphabetDeleteInput.replace(/[０-９]/g, function(s) {
       return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); 
    });
    
    // 入力データ内の「-」「~」「ー」「～」を検索
    if (cleanInput.includes("-") || cleanInput.includes("~") || cleanInput.includes("ー") || cleanInput.includes("～")) {
        // ハイフン等が入っている入力データを分割
        const inputHyphen = cleanInput.split(/[-~ー～]/);
        // 入力データの最初と最後の値を取得（安全性担保の為Numberに変更）
        const inputStart = Number(inputHyphen[0]);
        const inputEnd = Number(inputHyphen[1]);
        
        // ハイフン間の最小値と最大値を取り出し順にカウント
        if (!isNaN(inputStart) && !isNaN(inputEnd)) {
            const inputMin = Math.min(inputStart, inputEnd);
            const inputMax = Math.max(inputStart, inputEnd);
            for (let inputCount = inputMin; inputCount <= inputMax; inputCount++) {
                inputStatus(inputCount);
            }
        } else {
            const completedInput = Number(cleanInput);
            if (!isNaN(completedInput)) {
                inputStatus(completedInput);
            }
        }
    }
    
// 年月選択インプットの処理
// DOMのクラスを取得
const monthInput = document.querySelector(".monthInput");
// 現在の年月を取得
const now = new Date();
// 現在の年月から「年」を取得
const searchYear = now.getFullYear();
// 現在の年月から「月」を取得
const searchMonth = String(now.getMonth() + 1).padStart(2, '0');
// DOMに現在の年月を流し込む
monthInput.value = `${searchYear}-${searchMonth}`;

// 年月インプットが入力されていない場合アラートと処理停止
if (!monthInput.value) {
    alert("年月を選択してください。");
    return;
}

// 年月インプットにデフォルトで入っている「-」を分割して変数に代入
const [inputYear, inputMonth] = monthInput.value.split("-");

// 分割した値を数値に変換
const year = Number(inputYear);
const month = Number(inputMonth);

// カレンダー生成
completedInput.forEach(cmpdInput => {
    // 現在の最初の曜日を取得
    const firstDay = new Date(year, month - 1, 1).getDay();
    // 現在の日を取得
    const lastDate = new Date(year, month, 0).getDate();
    
    // 入力欄から「休」「午前」「午後」を調べる
    const searchHl = /休$/i.test(cmpdInput);
    const searchAm = /am$/i.test(cmpdInput);
    const searchPm = /pm$/i.test(cmpdInput);
});
}