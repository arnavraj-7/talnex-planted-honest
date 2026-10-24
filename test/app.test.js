const test = require("node:test");
const assert = require("node:assert");
const { convert, RATES } = require("../lib/convert");
const convertApi = require("../api/convert");
const guestApi = require("../api/guest");
const meApi = require("../api/me");

function call(handler, { method = "GET", query = {}, headers = {} } = {}) {
  const out = { status: null, body: null, headers: {} };
  const res = {
    setHeader: (k, v) => { out.headers[k] = v; },
    status(code) { out.status = code; return this; },
    json(body) { out.body = body; return this; },
  };
  handler({ method, query, headers }, res);
  return out;
}

test("100 USD is about 8,320 INR (the known answer)", () => {
  const r = convert("100", "USD", "INR");
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.result, 8320);
});

test("converting to the same currency gives the same amount", () => {
  assert.strictEqual(convert("42.5", "EUR", "EUR").result, 42.5);
});

test("converting there and back gets about the same amount", () => {
  const there = convert("250", "GBP", "INR").result;
  const back = convert(String(there), "INR", "GBP").result;
  assert.ok(Math.abs(back - 250) < 0.05);
});

test("an empty amount, text, and a negative number give clear messages", () => {
  assert.strictEqual(convert("", "USD", "INR").error, "Please enter an amount.");
  assert.strictEqual(convert("   ", "USD", "INR").error, "Please enter an amount.");
  assert.strictEqual(convert("abc", "USD", "INR").error, "That is not a number.");
  assert.strictEqual(convert("-5", "USD", "INR").error, "Amount cannot be negative.");
});

test("a huge amount and an unknown currency are refused politely", () => {
  assert.strictEqual(convert("1e15", "USD", "INR").error, "That amount is too large.");
  assert.match(convert("5", "USD", "XYZ").error, /Choose one of/);
});

test("thousands separators are understood", () => {
  assert.strictEqual(convert("1,000", "USD", "USD").result, 1000);
});

test("every supported currency has a rate", () => {
  assert.deepStrictEqual(Object.keys(RATES).sort(), ["EUR", "GBP", "INR", "USD"]);
});

test("the convert endpoint answers 200 with a result and 400 with an error", () => {
  const ok = call(convertApi, { query: { amount: "100", from: "usd", to: "inr" } });
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.result, 8320);
  const bad = call(convertApi, { query: { amount: "", from: "USD", to: "INR" } });
  assert.strictEqual(bad.status, 400);
  assert.strictEqual(bad.body.error, "Please enter an amount.");
  assert.strictEqual(call(convertApi, { method: "POST" }).status, 405);
});

test("a guest session is created, and only then is /api/me allowed", () => {
  assert.strictEqual(call(meApi).status, 401);
  const guest = call(guestApi, { method: "POST" });
  assert.strictEqual(guest.status, 200);
  const cookie = guest.headers["Set-Cookie"].split(";")[0];
  assert.match(cookie, /^tt_session=guest-[0-9a-f]{24}$/);
  assert.strictEqual(call(meApi, { headers: { cookie } }).status, 200);
  assert.strictEqual(call(meApi, { headers: { cookie: "tt_session=hacker" } }).status, 401);
  assert.strictEqual(call(guestApi, { method: "GET" }).status, 405);
});
