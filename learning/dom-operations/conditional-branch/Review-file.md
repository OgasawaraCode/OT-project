# 条件分岐
もし〜なら、～する。等とプログラムに判断をさせる仕組み。

## マイコード
if (score >= 80) {
    console.log("優秀");
  if (score >= 60) {
    console.log("合格");
  } if (isStudent) {
    console.log("学生割引あり");
  }
} else {
    console.log("不合格");
}
**
ミス内容：
前提としてどれか1つ出す事が目的。
マイコードは80でも60でもtureになるので、優秀と合格がコンソールに出てしまう。

➡　最初に80のボーダーラインがあり、以上なら「優秀」。80以下ではあるが、60以上である場合「合格」。それ以外は不合格。
**

## 正解コード
let score = 85;
let isStudent = true;

if (score >= 80) {
    console.log("優秀");
} else if (score >= 60) {
    console.log("合格");
} else {
    console.log("不合格");
}

if (isStudent) {
    console.log("学生割引あり");
}

## マイコード（正解）
let isLogin = true;
let isAdmin = false;

if (isLogin) {
 if (isAdmin) {
    console.log("管理者ページへ");
 } else {
    console.log("マイページへ");
 }
} else {
    console.log("ログインしてください");
}

## 意図
**
前提として、現在ログイン中、管理者では無い。
その上で、ログイン中且つ管理者であれば「管理者ページへ」の文言がログに出る。
ログインしているが管理者では無い場合、「マイページへ」の文言が出現。
それら全てfalseなら「ログインしてください」が出る。
**