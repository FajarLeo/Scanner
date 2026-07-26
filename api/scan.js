export default async function handler(req, res) {
  // Daftar origin yang diizinkan
  const allowedOrigins = ["https://fajarleo.github.io"];
  const origin = req.headers.origin;

  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  // Header CORS
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: "URL diperlukan"
      });
    }

    const apiKey = process.env.PAGESPEED_API_KEYS;

    if (!apiKey) {
      return res.status(500).json({
        error: "PAGESPEED_API_KEYS belum diset di Vercel."
      });
    }

    const apiUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=desktop&key=${apiKey}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    console.log("Google Response:", JSON.stringify(data));

    if (!response.ok || data.error) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal Server Error",
      detail: err.message
    });
  }
}
