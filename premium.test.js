const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
  ORDER_CONFIG,
  resolveUnitPrice,
  summarizeCampaignCart,
  formatAzPhone,
  isValidAzPhone,
  validateSimpleOrder,
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
assert.equal(result.total, 34);
assert.equal(result.campaignApplied, true);

result = summarizeCampaignCart([{ ...swiss30, qty: 2 }]);
assert.equal(result.total, 24);
assert.equal(result.campaignApplied, true);

assert.equal(ORDER_CONFIG.whatsappPhone, "994517238896");
assert.equal(formatAzPhone("0501234567"), "+994 50 123 45 67");
assert.equal(formatAzPhone("994501234567"), "+994 50 123 45 67");
assert.equal(isValidAzPhone("+994 50 123 45 67"), true);
assert.equal(isValidAzPhone("+994 40 123 45 67"), false);

assert.deepEqual(validateSimpleOrder({}), {
  name: "Bu sahəni doldurun",
  phone: "Bu sahəni doldurun",
  address: "Bu sahəni doldurun",
  paymentMethod: "Bu sahəni doldurun"
});
assert.deepEqual(validateSimpleOrder({
  name: "Fatimə",
  phone: "+994 50 123 45 67",
  address: "Bakı, Nizami küçəsi 10",
  paymentMethod: "Nağd"
}), {});

const message = buildWhatsAppOrderText({
  name: "Fatimə",
  phone: "+994 50 123 45 67",
  address: "Bakı, Nizami küçəsi 10",
  paymentMethod: "Nağd"
}, [{ ...swiss30, unitPrice: 12, lineTotal: 12 }], 12);
assert.match(message, /^Salam, Garnet Parfumdan sifariş vermək istəyirəm\./);
assert.match(message, /Ad: Fatimə/);
assert.match(message, /Ünvan: Bakı, Nizami küçəsi 10/);
assert.match(message, /Ödəniş: Nağd/);
assert.match(message, /1\. Montale — Vanilla, İsveçrə, 30 ml, 1 ədəd × 12 AZN — 12 AZN/);
assert.match(message, /Yekun məbləğ: 12 AZN$/);
assert.equal(decodeURIComponent(encodeURIComponent(message)), message);

for (const file of ["app.js", "premium.js", "index.html"]) {
  const source = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(source, /\b(?:alert|confirm|prompt)\s*\(/, file + " standard browser dialogs must not exist");
}
const html = fs.readFileSync("index.html", "utf8");
assert.doesNotMatch(html, /Promokod|checkout-step|deliveryDate|customerNote/);
assert.match(html, /Sifarişi rəsmiləşdir/);
assert.match(html, /Məlumatları daxil edin, sifarişiniz WhatsApp-da hazır şəkildə açılsın\./);

console.log("Sadə sifariş axını və kampaniya ssenariləri uğurla keçdi.");
