// Currency conversion with fixed rates (units per 1 US dollar). Kept apart from the API file so it can be tested alone.
const RATES = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.2 };

const MAX_AMOUNT = 1e12;

// Returns { ok: true, result, rate } or { ok: false, error } with a message a person can understand.
function convert(amountText, from, to) {
  const text = String(amountText ?? "").trim();
  if (text === "") return { ok: false, error: "Please enter an amount." };
  const amount = Number(text.replace(/,/g, ""));
  if (!Number.isFinite(amount)) return { ok: false, error: "That is not a number." };
  if (amount < 0) return { ok: false, error: "Amount cannot be negative." };
  if (amount > MAX_AMOUNT) return { ok: false, error: "That amount is too large." };
  if (!(from in RATES) || !(to in RATES)) return { ok: false, error: "Choose one of USD, EUR, GBP or INR." };

  const rate = RATES[to] / RATES[from];
  const result = Math.round(amount * rate * 100) / 100;
  return { ok: true, amount, from, to, rate: Math.round(rate * 1e6) / 1e6, result };
}

module.exports = { convert, RATES, MAX_AMOUNT };
