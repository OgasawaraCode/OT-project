// 基礎学習

// 課題①
let score = 70;
let isStudent = true;

if (score >=60) {
    console.log("合格");
} if (isStudent) {
    console.log("学生割引あり");
} else {
    console.log("不合格");
}

// 正解（70以上且つ学生の記述を一括りにする）（追加条件）
if (score >=60) {
    console.log("合格");

  if (isStudent) {
    console.log("学生割引あり");
  } 

  } else {
      console.log("不合格");
}


// 課題②
let isLogin = true;
let isAdmin = true;

if (isLogin) {
    console.log("ログイン中");
} if (isAdmin) {
    console.log("管理者ログイン中");
}

// 正解（学生の様に孤立してない条件が2つある時は&&を使う）（同時条件）
let isLogin2 = true;
let isAdmin2 = true;

if (isLogin2 && isAdmin2) {
    console.log("管理者ログイン中");
}