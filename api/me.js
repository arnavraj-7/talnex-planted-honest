// GET /api/me : is there a guest session? 200 if yes, 401 if not.
module.exports = (req, res) => {
  const cookie = String(req.headers.cookie || "");
  const hasSession = /(?:^|;\s*)tt_session=guest-[0-9a-f]{24}(?:;|$)/.test(cookie);
  if (!hasSession) return res.status(401).json({ error: "Please continue as a guest first." });
  return res.status(200).json({ guest: true });
};
