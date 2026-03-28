// 最終問題

// 課題①
let score = 85;
let isStudent = true;
// マイコード ×

// if (score >= 80) {
//     console.log("優秀");
//   if (score >= 60) {
//     console.log("合格");
//   } if (isStudent) {
//     console.log("学生割引あり");
//   }
// } else {
//     console.log("不合格");
// }

// 正解コード
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

// 課題②（実務寄り）
// 正解
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