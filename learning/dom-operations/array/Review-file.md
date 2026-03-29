# 配列
番号札のついた仕切り付きの箱。
これがあれば1つの変数名で複数のデータをまとめて管理出来る。

課題⑥
let numbers = [30, 70, 55, 90, 40];
let smt = 0;

for (let i =0; i < numbers.length; i++) {
    if (numbers[i] >= 60) {
        console.log(numbers[i]);
    smt += numbers[i];
        console.log(smt);
    }
}

**
ミス内容：
if内にコンソールがあるせいで無駄に表示されている。
目的：60以上の数字表示＋それの合計値の表示なので、
計算途中の合計値「0+70=70」の表示がいらない。（「70」が最終結果ではないのに表示されてしまっている。）

**

課題⑦
let users3 = ["田中", "佐藤", "田中", "鈴木"];

for (let i = 0; i < users3.length; i++) {
    if (users3[i] !== "田中") {
        console.log(users3[i]);
        console.log(users3.length);
    }
}

**
ミス内容：
人数を表示したいのに、lengthで記述してしまっている、
数字の合計や人数を出したい時はカウント用の変数を用意する必要がある。
また、同じくif内に書いているので1回言えば良い全体の長さを連呼してしまっている。

**