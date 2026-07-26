async function generateResult(url) {
    try {
        const response = await fetch(
            `https://scanner-santorina.vercel.app/api/scan?url=${encodeURIComponent(url)}`
        );

        // Cek status HTTP
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Pastikan data Lighthouse ada
        if (!data.lighthouseResult) {
            throw new Error("Website tidak dapat dianalisis oleh Google PageSpeed.");
        }

        // Ambil skor
        const performance = Math.round(
            (data.lighthouseResult.categories.performance.score ?? 0) * 100
        );

        const accessibility = Math.round(
            (data.lighthouseResult.categories.accessibility.score ?? 0) * 100
        );

        const security = Math.round(
            (data.lighthouseResult.categories["best-practices"].score ?? 0) * 100
        );

        const overall = Math.round(
            (performance + accessibility + security) / 3
        );

        // Tampilkan hasil
        performanceText.textContent = performance;
        accessibilityText.textContent = accessibility;
        securityText.textContent = security;
        overallText.textContent = overall;

        // Tentukan kategori
        let category = "";
        let recommendations = [];

        if (overall >= 90) {
            category = "Excellent";
            recommendations = [
                "Application quality is excellent.",
                "Maintain performance consistency.",
                "Continue regular monitoring."
            ];
        } else if (overall >= 75) {
            category = "Good";
            recommendations = [
                "Optimize page loading speed.",
                "Improve accessibility.",
                "Review best practices."
            ];
        } else if (overall >= 60) {
            category = "Fair";
            recommendations = [
                "Improve website performance.",
                "Reduce unused resources.",
                "Increase accessibility compliance."
            ];
        } else {
            category = "Poor";
            recommendations = [
                "Major optimization required.",
                "Improve performance and security.",
                "Review overall website quality."
            ];
        }

        categoryText.textContent = category;

        recommendation.innerHTML = recommendations
            .map(item => `<li>${item}</li>`)
            .join("");

        loadingCard.classList.add("d-none");
        resultCard.classList.remove("d-none");

    } catch (error) {

        console.error("Scan Error:", error);

        loadingCard.classList.add("d-none");
        resultCard.classList.remove("d-none");

        performanceText.textContent = "--";
        accessibilityText.textContent = "--";
        securityText.textContent = "--";
        overallText.textContent = "--";

        categoryText.textContent = "Scan Failed";

        recommendation.innerHTML = `
            <li>${error.message}</li>
        `;
    }
}
