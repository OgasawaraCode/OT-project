/////////////////////////////////////////////////
// 【UI構築】 ＊＊ページ表示用のHTMLを作成＊＊
////////////////////////////////////////////////
// 処理を軽くするためにHTMLコンテンツを一括で構築する方法に変更 CSSも一緒に追加
const htmlContent = `
<button class="toggle-btn" style="display: block; background-color: #efefef; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 5px; border: none; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">📅</button>
<div class="input-container" style="background-color: #ffffff; width: 200px; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: none;">
<input class="input-month" type="month" style="display: block; width: 145px; color: #333; padding: 5px; margin-bottom: 10px; border-radius: 4px;">
<label style="display: block; color: #333; font-size: 12px;">
    空日／休日を記入↓
    <input class="input-field" type="text" style="display: block; width: 170px; height: 25px; margin-top: 5px; margin-bottom: 10px;">
</label>
<p style="font-size: 10px; color: #666; margin-top: 0; margin-bottom: 10px; line-height: 1.2;">※入力例：1,2-4,5am,6pm,7~15休<br>※5-7pmなどの範囲指定も可</p>
<button style="width: 150px; height: 30px; background-color: #c82333; color: #ffffff; font-size: 12px; border: none; border-radius: 4px; padding: 6px 10px;">カレンダー生成ボタン</button>
</div>
`;
// 大枠のdivだけDOM操作する
const div = document.createElement("div");
div.style.cssText = "position: fixed; top: 10px; left: 10px; z-index: 1000;"
div.innerHTML = htmlContent;
document.body.appendChild(div);

/////////////////////////////////////////////////
// 【UI機能】 ＊＊トグルボタンのクリックイベント＊＊
////////////////////////////////////////////////
// DOMのクラスを取得
const tgBtn = document.querySelector(".toggle-btn");
const iptContainer = document.querySelector(".input-container");

// 初期設定として状態を「true」に設定（最初に読み込まれるコードを指定）
let tgAction = true;

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

///////////////////////////////////////////////////
//  【カレンダー用関数】＊＊データ管理＋配列作成用＊＊
//////////////////////////////////////////////////
function keepDigitsAndBuildCalendar(inputData) {

// 最終的なカレンダーの配列データ
let calendarResults = [];

// まず項目全部に「満」を入れる
for (let i = 0; i < 31; i++) {
    let daysData = {
        am: "満",
        pm: "満"
    };
    calendarResults.push(daysData);
}

// 入力データをカンマ、スペース、タブで区切って配列に入れる
const inputParts = inputData.split(/[，,、\s]+/);

// カンマで分けた配列の文字列それぞれに各処理を加える
inputParts.forEach(iPart => {
    // 入力データから「休」「午前」「午後」を検索
    const targetHl = /休$/i.test(iPart);
    const targetAm = /am$/i.test(iPart);
    const targetPm = /pm$/i.test(iPart);
    
    // 入力データからアルファベットと休み（1am、2休）を削除し、さらに全角数字も半角に変更（データの洗浄）
    let strDelete = iPart.replace(/[apmAPM]/g, "");
    let converPart = strDelete.replace(/[０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
    let cleanPart = converPart.replace(/[休]/g, "");

    // 【重要：データ管理の関数】下のforとifで貰った数値を引数に渡して「インデックス」として管理 ＋ amとpmに既に埋めてある「満」を条件によって「休」か「空」に変更
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
    
    //  綺麗にした配列（cleanPart）にハイフン類（-~ー～）が含まれているか確認する
    if (cleanPart.includes("-") || cleanPart.includes("~") || cleanPart.includes("ー") || cleanPart.includes("～")) {
        // 配列をハイフンで区切って配列に再代入し、配列の1番目（左側）と2番目（右側）の数値を取得
        const hyphenDel = cleanPart.split(/[-~ー～]/);
        const start = Number(hyphenDel[0]);
        const end = Number(hyphenDel[1]);
        
        // start（1番目の数値）とend（2番目の数値）の両方が、有効な数値の場合の処理 （数値に「-」等のハイフンがある場合の処理）
        // 【重要】if else共にさっき作ったdaysStatus関数に「表示用」の数値を代入する
        if (!isNaN(start) && !isNaN(end)) {
            const s = Math.min(start, end); // 最小値を取得
            const e = Math.max(start, end); // 最大値を取得
            // 最小値から最大値まで数値をdaysStatusに代入
            for (let j = s; j <= e; j++) {
                daysStatus(j);
            }
        // 数値が単一の場合の処理
        }
    } else {
        const singleNb = Number(cleanPart);
        if (!isNaN(singleNb)) {
            daysStatus(singleNb);
        }
    }
});

// 【重要】完成した31日分のデータを戻り値として外に返す
return calendarResults;
};

// テーブルタグ生成 UI出力関数
/** JSDoc
 * @param {number} year // 表示する年
 * @param {number} month // 表示する月
 * @param {Object[]} calendarData // カレンダーのデータ配列
 * @param {string} calendarData[].am // 午前の予定
 * @param {string} calendarData[].pm // 午後の予定
 */

///////////////////////////////////////////////////
//  【カレンダー用関数】＊＊データ管理＋配列作成用＊＊
//////////////////////////////////////////////////
function generateCalendarHtml(year, month, calendarData) {
    
}