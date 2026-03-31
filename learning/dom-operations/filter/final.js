// 課題④
// let scores = [40, 60, 75, 90];

// let result = scores.filter((num) => {
//     return num >= 60;
//     let result = scores.map((num) => {
//         return num = "合格";
//     });
// });

// console.log(result);

// 正解
let scores = [40, 60, 75, 90];

let pass = scores.filter((num) => {
    return num >= 60;
});

let result = pass.map((num) => {
    return "合格";
});

console.log(result);

// 本当の省略化コード
let result2 = scores
   .filter((num) => num >= 60)
   .map(() => "合格");

console.log(result2);