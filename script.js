document.addEventListener("DOMContentLoaded", () => {
document.getElementById("dashboard").style.display = "block";
window.onload = () => {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("display-name").innerText = "USER";
    document.getElementById("today-date").innerText = new Date().toLocaleDateString();
};

function processUID() {
    const input = document.getElementById("uid-input").value.trim();
    if (!input) return;

    const lines = input.split("\n");
    const uidPassPairs = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        return { uid: parts[0], pass: parts[1] || "N/A" };
    });

    const seenUIDs = new Set();
    const duplicates = new Set();
    const ok = [];
    const back = [];

    uidPassPairs.forEach(entry => {
        if (seenUIDs.has(entry.uid)) {
            duplicates.add(entry.uid);
            return;
        }
        seenUIDs.add(entry.uid);
        if (okUIDs.includes(entry.uid)) ok.push(entry);
        else back.push(entry);
    });

    document.getElementById("total-uid").innerText = uidPassPairs.length;
    document.getElementById("ok-uid").innerText = ok.length;
    document.getElementById("back-uid").innerText = back.length;
    document.getElementById("duplicate-uid").innerText = duplicates.size;

    const rate = ok.length < 200 ? 12.00 : 12.50;
    const amount = ok.length * rate;
    document.getElementById("amount").innerText = amount;

    const tbody = document.querySelector("#result-table tbody");
    tbody.innerHTML = "";

    ok.forEach(entry => {
        tbody.innerHTML += `<tr><td>${entry.uid}</td><td>${entry.pass}</td><td class="ok">OK</td></tr>`;
    });

    back.forEach(entry => {
        tbody.innerHTML += `<tr><td>${entry.uid}</td><td>${entry.pass}</td><td class="back">BACK</td></tr>`;
    });
}

function copyUIDs(type) {
    const rows = document.querySelectorAll("#result-table tbody tr");
    let data = [];

    rows.forEach(row => {
        const uid = row.children[0].innerText;
        const pass = row.children[1].innerText;
        const status = row.children[2].innerText;

        if ((type === 'ok' && status === 'OK') ||
            (type === 'back' && status === 'BACK')) {
            data.push(`${uid}\t${pass}`);
        }
    });

    if (type === 'duplicate') {
        const input = document.getElementById("uid-input").value.trim();
        const uidArray = input.split(/\s+/);
        const seen = {};
        const duplicates = [];

        uidArray.forEach(uid => {
            if (seen[uid]) duplicates.push(uid);
            else seen[uid] = true;
        });

        data = duplicates;
    }

    navigator.clipboard.writeText(data.join("\n"));
    alert(`${type.toUpperCase()} UID copied to clipboard`);
}

function downloadExcel(type) {
    const rows = document.querySelectorAll("#result-table tbody tr");
    let lines = [["UID", "Password", "Status"]];

    rows.forEach(row => {
        const uid = row.children[0].innerText;
        const pass = row.children[1].innerText;
        const status = row.children[2].innerText;

        if ((type === 'ok' && status === 'OK') || (type === 'back' && status === 'BACK')) {
            lines.push([uid, pass, status]);
        }
    });

    let csvContent = lines.map(e => e.join("\t")).join("\n");
    let blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${type.toUpperCase()}_UID_Report.xlsx`;
    a.click();
}
