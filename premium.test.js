const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  ORDER_CONFIG,
  resolveUnitPrice,
  summarizeCampaignCart,
  deliveryText,
  formatAzPhone,
  isValidAzPhone,
  validateCheckoutStep,
  formatOrderDate,
  buildWhatsAppOrderText
} = require("./premium.js");

const swiss30 = { brand: "Montale", name: "Vanilla", country: "İsveçrə", size: 30, normalPrice: 25, qty: 1 };
const france50 = { brand: "Narciso", name: "Poudrée", country: "Fransa", size: 50, normalPrice: 38, qty: 1 };

assert.equal(resolveUnitPrice(swiss30, 1), 25);
assert.equal(resolveUnitPrice(swiss30, 2), 12);

let result = summarizeCampaignCart([swiss30]);
assert.equal(result.total, 25);
assert.equal(result.campaignApplied, false);

result = summarizeCampaignCart([swiss30, france50]);
assert.equal(result.subtotal, 34);
assert.equal(result.total, 34);
assert.equal(result.campaignApplied, true);

result = summarizeCampaignCart([{ ...swiss30, qty: 2 }]);
assert.equal(result.total, 24);
assert.equal(result.campaignApplied, true);

result = summarizeCampaignCart([swiss30, france50], "GARNET10");
assert.equal(result.discount, 3);
assert.equal(result.total, 31);

assert.equal(deliveryText(), "Çatdırılma: ayrıca");
assert.equal(deliveryText(5), "Çatdırılma: 5 AZN");
assert.equal(ORDER_CONFIG.paymentCard, null);

assert.equal(formatAzPhone("0501234567"), "+994 50 123 45 67");
assert.equal(formatAzPhone("994501234567"), "+994 50 123 45 67");
assert.equal(isValidAzPhone("+994 50 123 45 67"), true);
assert.equal(isValidAzPhone("+994 40 123 45 67"), false);

const today = "2026-08-15";
assert.deepEqual(validateCheckoutStep({}, 1, today), {
  name: "Ad və soyadı tam daxil edin.",
  phone: "Nömrəni +994 XX XXX XX XX formatında daxil edin."
});
assert.equal(validateCheckoutStep({
  address: "Bakı şəhəri, Nizami küçəsi 10",
  deliveryDate: "2026-08-14",
  deliveryTime: "10:00–13:00"
}, 2, today).deliveryDate, "Keçmiş tarix seçilə bilməz.");
assert.deepEqual(validateCheckoutStep({
  address: "Bakı şəhəri, Nizami küçəsi 10",
  deliveryDate: "2026-08-16",
  deliveryTime: "10:00–13:00"
}, 2, today), {});
assert.equal(formatOrderDate("2026-08-20"), "20.08.2026");

const message = buildWhatsAppOrderText({
  name: "Fatimə Məmmədova",
  phone: "+994 50 123 45 67",
  address: "Bakı şəhəri, Nizami küçəsi 10",
  deliveryDate: "2026-08-20",
  deliveryTime: "13:00–17:00",
  note: "Zəng edin",
  paymentMethod: "Nağd"
}, [{ ...swiss30, unitPrice: 12, lineTotal: 12 }], 12);
assert.match(message, /Fatimə Məmmədova/);
assert.match(message, /Montale Vanilla — İsveçrə, 30 ml — 12 AZN/);
assert.match(message, /Ümumi ödəniş: 12 AZN/);
assert.match(message, /Çatdırılma: ayrıca/);
assert.match(message, /Nağd — kuryerə$/);

for (const file of ["app.js", "premium.js", "index.html"]) {
  const source = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(source, /\b(?:alert|confirm|prompt)\s*\(/, file + " standard browser dialogs must not exist");
}

console.log("Premium storefront and checkout scenarios passed.");
