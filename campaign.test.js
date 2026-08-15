const assert = require("node:assert/strict");
const {
  resolveUnitPrice,
  summarizeCampaignCart,
  maskedCardNumber,
  deliveryText,
  validateOrderFormData,
  formatSelectedDeliveryTime,
  buildWhatsAppOrderText
} = require("./campaign.js");

const swiss30 = { country: "İsveçrə", size: 30, normalPrice: 25, qty: 1 };
const france50 = { country: "Fransa", size: 50, normalPrice: 38, qty: 1 };

assert.equal(resolveUnitPrice(swiss30, 1), 25, "One item must use the normal price");
assert.equal(resolveUnitPrice(swiss30, 2), 12, "Two items must activate Swiss 30 ml price");

let result = summarizeCampaignCart([swiss30]);
assert.equal(result.total, 25);
assert.equal(result.campaignApplied, false);

result = summarizeCampaignCart([swiss30, france50]);
assert.equal(result.total, 34);
assert.equal(result.campaignApplied, true);

result = summarizeCampaignCart([{ ...swiss30, qty: 2 }]);
assert.equal(result.total, 24);
assert.equal(result.campaignApplied, true);

result = summarizeCampaignCart([{ ...swiss30, qty: 2 }, france50]);
assert.equal(result.total, 46);
result = summarizeCampaignCart([swiss30]);
assert.equal(result.total, 25, "Dropping from two items to one must restore normal price");

assert.equal(maskedCardNumber(), "•••• •••• •••• 0986");
assert.doesNotMatch(maskedCardNumber(), /\d{16}/);
assert.equal(deliveryText(), "Çatdırılma: ayrıca");
assert.equal(deliveryText(5), "Çatdırılma: 5 AZN");

const today = "2026-08-15";
assert.deepEqual(validateOrderFormData({}, today), ["Ad", "Əlaqə nömrəsi", "Çatdırılma vaxtı", "Ödəniş üsulu"]);
assert.deepEqual(validateOrderFormData({ name: "Fatimə", phone: "051", deliveryTime: "Başqa tarix", deliveryDate: "2026-08-14", paymentMethod: "Nağd" }, today), ["Keçmiş tarix seçilə bilməz"]);
assert.deepEqual(validateOrderFormData({ name: "Fatimə", phone: "051", deliveryTime: "Bu gün", paymentMethod: "Nağd" }, today), []);
assert.equal(formatSelectedDeliveryTime({ deliveryTime: "Bu gün" }), "Bu gün");
assert.equal(formatSelectedDeliveryTime({ deliveryTime: "Sabah" }), "Sabah");
assert.equal(formatSelectedDeliveryTime({ deliveryTime: "Başqa tarix", deliveryDate: "2026-08-20" }), "20.08.2026");

const orderText = buildWhatsAppOrderText(
  { name: "Fatimə", phone: "051 300 29 31", deliveryTime: "Bu gün", paymentMethod: "Nağd" },
  [{ brand: "Montale", name: "Vanilla", country: "İsveçrə", size: 30, unitPrice: 12, qty: 1 }],
  12
);
assert.match(orderText, /^Fatimə\n051 300 29 31\nBu gün/);
assert.match(orderText, /Montale Vanilla — İsveçrə, 30 ml — 12 AZN/);
assert.match(orderText, /Ümumi ödəniş: 12 AZN\nÇatdırılma: ayrıca\nNağd — kuryerə$/);
assert.doesNotMatch(orderText, /Yeni sifariş|Müştəri|Əlaqə nömrəsi|Çatdırılma vaxtı|Sifariş|Məhsulların cəmi/);

const cardOrderText = buildWhatsAppOrderText(
  { name: "A", phone: "B", deliveryTime: "Sabah", paymentMethod: "Kartla" },
  [{ brand: "Narciso", name: "Pudra", country: "Fransa", size: 50, unitPrice: 22, qty: 2 }],
  44,
  7
);
assert.match(cardOrderText, /22 AZN × 2/);
assert.match(cardOrderText, /Çatdırılma: 7 AZN\nKartla ödəniş$/);

console.log("Campaign and checkout scenarios passed.");
