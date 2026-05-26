// UIエリア構築
const htmlContent = `
<button class="toggle-btn" style="display: block; background-color: #efefef; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-bottom: 5px; border: none; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">📅</button>
<div class="input-container" style="background-color: #ffffff; width: 200px; padding: 10px; border-radius: 8px; box-sizing: 0 4px 12px rgba(0,0,0,0.15); display: none;">
    <input type="month" style="display: block; width: 145px; color: #333; padding: 5px; margin-bottom: 10px; border-radius: 4px;">
    <label style="display: block; color: #333; font-size: 12px;">
        空日／休日を記入↓
        <input type="text" style="display: block; width: 170px; height: 25px; margin-top: 5px; margin-bottom: 10px;">
    </label>
</div>
`;

const div = document.createElement("div");
div.style.cssText = "position: fixed; top: 10px; left: 10px; z-index: 1000;"
div.innerHTML = htmlContent;
document.body.appendChild(div);

// UI機能実装
const tgBtn = document.querySelector(".toggle-btn");
const iptContainer = document.querySelector(".input-container");
let tgAction = true;

tgBtn.addEventListener("click", () => {
    if (tgAction) {
        iptContainer.style.display = "block";
        
        iptContainer.animate([
            {opacity: 0, transform: "translateY(-10px)"},
            {opacity: 1, transform: "translateY(0)"}
        ], {
            duration: 400,
            easing: "ease",
            fill: "forwards"
        });
    } else {
        const tgAnimation = iptContainer.animate([
            {opacity: 1, transform: "translateY(0)"},
            {opacity: 0, transform: "translateY(-10px)"}
        ], {
            duration: 300,
            easing: "ease",
            fill: "forwards"
        });

        tgAnimation.onfinish = () => {
            iptContainer.style.display = "none";
        };
    }
    tgAction = !tgAction;
});