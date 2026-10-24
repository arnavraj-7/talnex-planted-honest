const { convert } = require("../lib/convert");

// GET /api/convert?amount=100&from=USD&to=INR
module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Use GET." });
  }
  const { amount, from, to } = req.query || {};
  const out = convert(amount, String(from || "").toUpperCase(), String(to || "").toUpperCase());
  if (!out.ok) return res.status(400).json({ error: out.error });
  return res.status(200).json(out);
};
