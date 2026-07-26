export default async function handler(req, res) {
  // 🔒 Daftar domain yang diizinkan
  const allowedOrigins = ["https://fajarleo.github.io"];
  const origin = req.headers.origin;
  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  // 🧭 Header CORS universal
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Tangani preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { url } = req.query;
    if (!url) {
      // Tetap kirim header CORS di error
      return res.status(400).json({ error: "URL diperlukan" });
    }

    const apiKey = process.env.PAGESPEED_API_KEYS;
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=desktop&key=${apiKey}`;

   const response = await fetch(apiUrl, { redirect: "follow" });
  const data = await response.json();
  
  // Tampilkan response Google di Vercel Logs
  console.log("Google API Response:", JSON.stringify(data, null, 2));
  
  // Jika Google mengembalikan error
  if (!response.ok || data.error) {
    return res.status(response.status || 500).json({
      error: data.error || data
    });
  }
  
  // Jika berhasil
  return res.status(200).json(data);
    });
  }
}
