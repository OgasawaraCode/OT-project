const btn = document.getElementById("btn");
const targets = document.querySelectorAll(".target");
const labelMap = {
    name: "名前",
    age: "年齢",
    email: "メール"
}

async function copyPasteFunction() {
    if (targets.length === 0) {
        console.error("target要素がありません");
        return;
    }
    try {
        const text = await navigator.clipboard.readText();
        if (!text) {
            targets.forEach(el => el.value = "クリップボードが空です");
            return;
        }
        const lines = text.split(/\r?\n/);
        const date = {};

        lines.forEach(line => {
            const [key, ...rest] = line.split(":");
            const value = rest.join(":");
            if (key && value) {
                date[key.trim()] = value.trim();
            }
        });

        targets.forEach(el => {
            const type = el.dataset.type;
            const label = labelMap[type];
            if (!label) {
                console.warn(`未対応のtype: ${type}`);
                return;
            }
            el.value = date[label];
        });
    } catch (err) {
        console.error(err);
        targets.forEach(el => el.value = "失敗しました");
    }
}

btn.addEventListener("click", copyPasteFunction);