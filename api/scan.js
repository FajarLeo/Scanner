export default async function handler(req, res) {
  const allowedOrigins = ["https://fajarleo.github.io"];
  const origin = req.headers.origin;

  // Pastikan origin ada dan cocok
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // fallback: jangan pakai undefined
    return res.status(403).json({ error: "Origin tidak diizinkan" });
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "URL diperlukan" });
    }

    const apiKey = process.env.PAGESPEED_API_KEYS;
    if (!apiKey) {
      return res.status(500).json({ error: "API key tidak ditemukan" });
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
}
