export default async function handler(req, res) {
  const allowedOrigins = ["https://fajarleo.github.io"];
  const origin = req.headers.origin;

  // Tambahkan header CORS di semua response
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "null");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Tangani preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;
    if (!url) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      return res.status(400).json({ error: "URL diperlukan" });
    }

    const apiKey = process.env.PAGESPEED_API_KEYS;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.status(200).json(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.status(500).json({ error: "Gagal memanggil API" });
  }
}
