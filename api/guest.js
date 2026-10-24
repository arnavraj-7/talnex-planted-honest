const crypto = require("crypto");

// POST /api/guest : start a guest session (no account needed) that lasts an hour.
module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST." });
  }
  const id = crypto.randomBytes(12).toString("hex");
  res.setHeader("Set-Cookie", `tt_session=guest-${id}; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax; Secure`);
  return res.status(200).json({ ok: true, guest: true });
};
