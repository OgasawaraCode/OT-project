// 前提知識ありで改めて書いていく。

// 課題 変数①
let name = "私";
let age = 22;
console.log(name + "は" + age + "歳です。");

// 変数②
let a = 18;
let b = 5;
console.log(a + b);

// 変数 ➡ if文③
let isStudent = false;
if (isStudent) {
    console.log("学生です。");
} else {
    console.log("学生ではありません。")
}

// if文②
let score = 80;
if (score >= 60) {
    console.log("合格");
} else {
    ("不合格");
}

// if文③
let point = 90;
if (point >= 80) {
    console.log("優秀");
} else if (point >= 60) {
    console.log("合格");
} else {
    console.log("不合格");
}

// if文④ 「追加条件（{}の位置）」 ミスしたので注意。
let isLogin = true;
let isAdmin = true;

if (isLogin) {
    console.log("ログイン中");

    if (isLogin) {
        console.log("管理者です");
    }
}
/// 別の書き方
if (isLogin && isAdmin) {
    console.log("管理者ログイン中です");
}

// if文⑤
let core = 90;
let isUndergraduate = true;

if (core >= 80) {
    console.log("優秀");
} else if (core >= 60) {
    console.log("合格");
} else {
    console.log("不合格");
}

if (isUndergraduate) {
    console.log("学生割引あり");
}

// if文⑥
let isLoggedIn = true;
let isAuthorized = false;

if (isLoggedIn && isAuthorized) {
    console.log("管理者ページへ");
} else if (isLoggedIn) {
    console.log("マイページへ");
} else {
    console.log("ログインしてください");
}

// 配列① 「足し算」 忘れているので注意（初期値用の変数記述、+=の記述）。
let numbers = [10, 20, 30, 40];
let sum = 0;

numbers.forEach((figure) => {
    sum += figure;
})

console.log(sum);

// 配列② 「ifの中にif」 ここも忘れているので注意。
let values = [30, 70, 55, 90, 40];
let tally = 0;

for (let i = 0; i >= values.length; i++) {
    if (values[i] >= 60) {
        tally += values[i];
    }
}

console.log(tally);

// 配列「for→forEach」 ③ ここも忘れているので注意。
let users = ["田中", "佐藤", "田中", "鈴木"];
let count = 0;

users.forEach((num) => {
    if (num !== "田中") {
        console.log(num);
        count++;
    }
})

console.log(count);

// filter、map文
let scores = [40, 60, 75, 90];

let passed = scores.filter((digit) => {
    return digit >= 60;
});

let array = passed.map(() => {
    return "合格";
});

console.log(array);

// 実務用filter、map文（「;」まで1文なので注意） 覚える。
let result = scores
    .filter((code) => code >= 60)
    .map(() => "合格");

console.log(result);

// DOM操作① 忘れているので注意
let counts = document.getElementById("counts");
let plusBtn = document.getElementById("plusBtn");

plusBtn.addEventListener("click", () => { // クリックした時の処理。
    let Add = Number(counts.textContent);  // counts.textContentはid"counts"の中の値を意味していて、Number()という既存のオブジェクトに入れ込む事で計算可能な数値に変換している。それをさらに「Add」という変数に変換している。
    Add++; // 「0」をプラスしていくという意味
    counts.textContent = Add;  // HTMLの「0」と先程修正したAddイコールと言う事を定義。
})

// DOM操作② 忘れているので注意
let names = ["田中", "佐藤", "鈴木"];
let list = document.getElementById("list");

names.forEach((nms) => {
    let li = document.createElement("li"); // liタグ新規追加。
    li.textContent = nms; // liのテキストエリア内のテキストと配列がイコールな事を定義（追加している）。
    list.appendChild(li); // 「id"list"のul内に配列を入れ込んだ子要素liを追加した」という事象を画面に追加【必須】。
})