# filter
条件に合うものだけ残す。

## マイコード
let scores = [40, 60, 75, 90];

let result = scores.filter((num) => {
    return num >= 60;
    let result = scores.map((num) => {
        return num = "合格";
    });
});

**
ミス内容：
全て内部で完結しようとしている。（無意識に省略的な事をしている。）
今回のfilterの中でmapは構造的に不可。
その為まずはfilterで条件絞って、その後別途mapで変換する。（役割を意識する。）
**

## 正解コード
let scores = [40, 60, 75, 90];

let pass = scores.filter((num) => {
    return num >= 60;
});

let result = pass.map((num) => {
    return "合格";
});

console.log(result);