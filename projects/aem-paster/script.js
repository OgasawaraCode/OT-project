const btn = document.createElement("button");
btn.textContent = "貼り付け";
document.body.appendChild(btn);

btn.style.position = "fixed";
btn.style.top = "10px";
btn.style.left = "10px";
btn.style.padding = "10px 20px";
btn.style.zIndex = "1000";
btn.style.cursor = "pointer";

const tbody = document.querySelector("tbody");

btn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();

        const rows = text
            .split(/\r?\n/)
            .map(row => row.split(/\t/));

        let calendarData = {};
        let currentDay = null;

        rows.forEach(row => {
            row.forEach(cell => {
                const value = cell.trim();

                if (!value) return;

                if (/^\d+$/.test(value)) {
                    currentDay = Number(value);
                } 
                else if (currentDay !== null) {
                    if (!calendarData[currentDay]) {
                        calendarData[currentDay] = [];
                    }
                    calendarData[currentDay].push(value);
                }
            });
        });

        tbody.innerHTML = "";

        let day = 1;
        const totalDays = 31;

        for (let week = 0; week < 6; week++) {
            const trDate = document.createElement("tr");
            trDate.style.background = "#F0F0F0";
            trDate.style.fontWeight = "bold";

            const trLabel = document.createElement("tr");
            trLabel.style.fontSize = "11px";

            const trData = document.createElement("tr");

            for (let d = 0; d < 7; d++) {
                const tdDate = document.createElement("td");
                tdDate.colSpan = 2;

                if (day <= totalDays) {
                    tdDate.textContent = day;
                }
                trDate.appendChild(tdDate);

                const tdAM = document.createElement("td");
                tdAM.textContent = "AM";
                const tdPM = document.createElement("td");
                tdPM.textContent = "PM";

                trLabel.appendChild(tdAM);
                trLabel.appendChild(tdPM);

                const td1 = document.createElement("td");
                const td2 = document.createElement("td");

                if (day <= totalDays) {
                    const content = calendarData[day] || [];

                    td1.textContent = content[0] || "";
                    td2.textContent = content[1] || "";

                    if (d === 0 || d === 6) {
                        td1.style.color = "red";
                        td2.style.color = "red";
                    }
                }

                trData.appendChild(td1);
                trData.appendChild(td2);

                day++;
            }

            tbody.appendChild(trDate);
            tbody.appendChild(trLabel);
            tbody.appendChild(trData);

            if (day > totalDays) break;
        }

    } catch (err) {
        console.error("エラーが発生しました", err);
        alert("クリップボードの読み取りを許可してください。");
    }
});