// ======================================
// Smart Application Quality Scanner (API + Validation)
// ======================================

const scanBtn = document.getElementById("scanBtn");

const loadingCard = document.getElementById("loadingCard");
const resultCard = document.getElementById("resultCard");

const progressBar = document.getElementById("progressBar");
const loadingText = document.getElementById("loadingText");

const performanceText = document.getElementById("performance");
const accessibilityText = document.getElementById("accessibility");
const securityText = document.getElementById("security");

const overallText = document.getElementById("overall");
const categoryText = document.getElementById("category");

const recommendation = document.getElementById("recommendation");

//===============================

scanBtn.addEventListener("click", startScan);

//===============================

function startScan() {
    const url = document.getElementById("url").value.trim();

    if (url == "") {
        alert("Masukkan URL Website");
        return;
    }

    resultCard.classList.add("d-none");
    loadingCard.classList.remove("d-none");
    progressBar.style.width = "0%";

    let progress = 0;
    const stepText = [
        "Opening Website...",
        "Scanning Performance...",
        "Checking Accessibility...",
        "Checking Security...",
        "Generating Report..."
    ];

    loadingText.innerHTML = stepText[0];

    const interval = setInterval(() => {
        progress += 5;
        progressBar.style.width = progress + "%";
        progressBar.innerHTML = progress + "%";

        if (progress == 20) loadingText.innerHTML = stepText[1];
        if (progress == 45) loadingText.innerHTML = stepText[2];
        if (progress == 70) loadingText.innerHTML = stepText[3];
        if (progress == 90) loadingText.innerHTML = stepText[4];

        if (progress >= 100) {
            clearInterval(interval);
            generateResult(url);
        }
    }, 120);
}

//===================================
// Validasi URL dengan fetch HEAD
async function validateURL(url) {
    try {
        const res = await fetch(url, { method: "HEAD" });
        return res.ok;
    } catch {
        return false;
    }
}

//===================================

async function generateResult(url) {
    try {
        const response = await fetch(`https://your-vercel-project.vercel.app/api/scan?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (!data.lighthouseResult) {
            throw new Error("Website tidak bisa dianalisis");
        }

        const performance = Math.round(data.lighthouseResult.categories.performance.score * 100);
        const accessibility = Math.round(data.lighthouseResult.categories.accessibility.score * 100);
        const security = Math.round(data.lighthouseResult.categories["best-practices"].score * 100);

        const overall = Math.round((performance + accessibility + security) / 3);

        performanceText.innerHTML = performance;
        accessibilityText.innerHTML = accessibility;
        securityText.innerHTML = security;
        overallText.innerHTML = overall;

        // kategori & rekomendasi tetap sama...
    } catch (error) {
        overallText.innerHTML = "Error";
        categoryText.innerHTML = "Invalid URL";
        recommendation.innerHTML = `<li>${error.message}</li>`;
        console.error(error);
    }
}
