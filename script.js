function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const found = users.find(u => u.username === user && u.password === pass);

    if (found) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        document.getElementById("display-name").innerText = found.name;
    } else {
        document.getElementById("login-error").innerText = "Invalid Credentials!";
    }
}

function processUID() {
    const input = document.getElementById("uid-input").value.trim();
    if (!input) return;

    const uidArray = input.split(/\s+/);
    const uniqueUIDs = [...new Set(uidArray)];
    const duplicates = uidArray.length - uniqueUIDs.length;

    let ok = [], back = [];
    uniqueUIDs.forEach(uid => {
        if (okUIDs.includes(uid)) ok.push(uid);
        else back.push(uid);
    });

    document.getElementById("total-uid").innerText = uniqueUIDs.length;
    document.getElementById("ok-uid").innerText = ok.length;
    document.getElementById("back-uid").innerText = back.length;
    document.getElementById("duplicate-uid").innerText = duplicates;

    const rate = ok.length < 50 ? 9.50 : 10.00;
    const amount = ok.length * rate;
    document.getElementById("amount").innerText = amount;

    const tbody = document.querySelector("#result-table tbody");
    tbody.innerHTML = "";
    ok.forEach(uid => {
        const row = `<tr><td>${uid}</td><td class="ok"> OK</td></tr>`;
        tbody.innerHTML += row;
    });
    back.forEach(uid => {
        const row = `<tr><td>${uid}</td><td class="back"> Back</td></tr>`;
        tbody.innerHTML += row;
    });
}

function copyOK() {
    const ok = [];
    document.querySelectorAll(".ok").forEach(td => {
        ok.push(td.parentElement.firstChild.textContent);
    });
    navigator.clipboard.writeText(ok.join("\n"));
}

function copyBack() {
    const back = [];
    document.querySelectorAll(".back").forEach(td => {
        back.push(td.parentElement.firstChild.textContent);
    });
    navigator.clipboard.writeText(back.join("\n"));
}

function copyDuplicate() {
    const input = document.getElementById("uid-input").value.trim();
    if (!input) return;
    const uidArray = input.split(/\s+/);
    const seen = {};
    const duplicates = [];
    uidArray.forEach(uid => {
        if (seen[uid]) duplicates.push(uid);
        else seen[uid] = true;
    });
    navigator.clipboard.writeText(duplicates.join("\n"));
}

function downloadReport() {
    let text = "UID Report:\n";
    document.querySelectorAll("#result-table tbody tr").forEach(row => {
        text += row.children[0].innerText + " - " + row.children[1].innerText + "\n";
    });
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "uid-report.txt";
    a.click();
}
