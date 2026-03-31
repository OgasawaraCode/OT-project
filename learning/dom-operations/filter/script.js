// 課題①　➡　〇
let numbers1 = [10, 50, 80, 30];

let result1 = numbers1.filter((num1) => {
    return num1 >= 50;
});

console.log(result1);

// 課題②　➡　〇
let users1 = ["田中", "佐藤", "田中", "鈴木"];

let result2 = users1.filter((num2) => {
    return num2 === "田中"
});

console.log(result2);

// 課題③　➡　×　if文使わない
let scores = [40, 60, 75, 90];

let result3 = scores.filter((num3) => {
    return num3 >= 60;
});

console.log(result3);