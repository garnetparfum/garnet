const assert = require("node:assert/strict");
const { resolveUnitPrice, summarizeCampaignCart } = require("./campaign.js");

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

console.log("Campaign pricing scenarios passed.");
