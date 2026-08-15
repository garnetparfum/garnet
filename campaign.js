const CAMPAIGN_CONFIG = Object.freeze({
  active: true,
  minimumQuantity: 2,
  hiddenSizesWhenActive: [20],
  allowedSizes: [30, 50],
  defaultCountry: "İsveçrə",
  prices: Object.freeze({
    "İsveçrə": Object.freeze({ 30: 12, 50: 18 }),
    "Fransa": Object.freeze({ 30: 15, 50: 22 })
  })
});

const ORDER_CONFIG = Object.freeze({
  cardLastFour: "0986",
  deliveryFee: null
});

function maskedCardNumber(lastFour = ORDER_CONFIG.cardLastFour) {
  return `•••• •••• •••• ${String(lastFour).slice(-4)}`;
}

function deliveryText(fee = ORDER_CONFIG.deliveryFee) {
  return fee === null || fee === undefined || fee === ""
    ? "Çatdırılma: ayrıca"
    : `Çatdırılma: ${Number(fee)} AZN`;
}

function validateOrderFormData(data, todayIso) {
  const errors = [];
  if (!String(data.name || "").trim()) errors.push("Ad");
  if (!String(data.phone || "").trim()) errors.push("Əlaqə nömrəsi");
  if (!data.deliveryTime) errors.push("Çatdırılma vaxtı");
  if (!data.paymentMethod) errors.push("Ödəniş üsulu");
  if (data.deliveryTime === "Başqa tarix") {
    if (!data.deliveryDate) errors.push("Çatdırılma tarixi");
    else if (data.deliveryDate < todayIso) errors.push("Keçmiş tarix seçilə bilməz");
  }
  return errors;
}

function formatSelectedDeliveryTime(data) {
  if (data.deliveryTime !== "Başqa tarix") return data.deliveryTime;
  const [year, month, day] = data.deliveryDate.split("-");
  return `${day}.${month}.${year}`;
}

function buildWhatsAppOrderText(data, pricedLines, productsTotal, deliveryFee = ORDER_CONFIG.deliveryFee) {
  const productLines = pricedLines.map(item => {
    const quantity = Number(item.qty || 1);
    const quantitySuffix = quantity > 1 ? ` × ${quantity}` : "";
    return `${item.brand} ${item.name} — ${item.country}, ${item.size} ml — ${item.unitPrice} AZN${quantitySuffix}`;
  }).join("\n");
  const paymentLine = data.paymentMethod === "Nağd" ? "Nağd — kuryerə" : "Kartla ödəniş";
  return `${String(data.name).trim()}\n${String(data.phone).trim()}\n${formatSelectedDeliveryTime(data)}\n\n${productLines}\n\nÜmumi ödəniş: ${Math.round(productsTotal)} AZN\n${deliveryText(deliveryFee)}\n${paymentLine}`;
}

function campaignPrice(country, size) {
  return CAMPAIGN_CONFIG.prices[country]?.[Number(size)] ?? null;
}

function resolveUnitPrice(item, totalQuantity) {
  const promoPrice = campaignPrice(item.country, item.size);
  const eligible = CAMPAIGN_CONFIG.active &&
    totalQuantity >= CAMPAIGN_CONFIG.minimumQuantity &&
    promoPrice !== null;
  return eligible ? promoPrice : Number(item.normalPrice ?? item.price ?? 0);
}

function summarizeCampaignCart(cart, promoCode = null, metroPrices = {}) {
  const totalQuantity = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const campaignApplied = CAMPAIGN_CONFIG.active && totalQuantity >= CAMPAIGN_CONFIG.minimumQuantity;
  const lines = cart.map(item => {
    const unitPrice = resolveUnitPrice(item, totalQuantity);
    return { ...item, unitPrice, lineTotal: unitPrice * Number(item.qty || 0) };
  });
  const productsTotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryCost = lines.reduce((sum, item) => sum + (metroPrices[item.metro] || 0) * Number(item.qty || 0), 0);
  const promoFactor = promoCode === "GARNET10" ? 0.9 : (promoCode === "YAY20" ? 0.8 : 1);
  return {
    totalQuantity,
    campaignApplied,
    lines,
    productsTotal,
    deliveryCost,
    total: Math.round((productsTotal + deliveryCost) * promoFactor)
  };
}

if (typeof window !== "undefined") window.CAMPAIGN_CONFIG = CAMPAIGN_CONFIG;
if (typeof window !== "undefined") window.ORDER_CONFIG = ORDER_CONFIG;

if (typeof document !== "undefined") {
  (() => {
    const originalLoadCart = loadCart;

    function productFor(item) {
      return getProducts().find(product => product.id === item.id);
    }

    function normalUnitPrice(item) {
      const product = productFor(item);
      return product ? priceBySize(product.price20, item.size) : Number(item.normalPrice ?? item.price ?? 0);
    }

    function normalizeCart(cart) {
      return cart
        .filter(item => !CAMPAIGN_CONFIG.active || CAMPAIGN_CONFIG.allowedSizes.includes(Number(item.size)))
        .map(item => ({
          ...item,
          country: item.country || CAMPAIGN_CONFIG.defaultCountry,
          normalPrice: normalUnitPrice(item),
          delivery: null,
          metro: null
        }));
    }

    loadCart = function campaignAwareLoadCart() {
      return normalizeCart(originalLoadCart());
    };

    calculateFinalTotal = function campaignAwareTotal(cart) {
      const result = summarizeCampaignCart(normalizeCart(cart), appliedPromo, METRO_PRICES);
      return {
        ...result,
        msg: result.campaignApplied
          ? "Kampaniya qiymətləri tətbiq edildi."
          : (result.totalQuantity === 1
            ? "Kampaniya qiymətlərindən yararlanmaq üçün səbətə daha 1 məhsul əlavə edin."
            : "")
      };
    };

    function normalPricesFor(product) {
      return CAMPAIGN_CONFIG.allowedSizes.map(size => `${size} ml — ${money(priceBySize(product.price20, size))}`).join(" | ");
    }

    function campaignPriceRows() {
      return Object.entries(CAMPAIGN_CONFIG.prices).map(([country, prices]) =>
        `<div><strong>${country}:</strong> 30 ml — ${prices[30]} AZN <span>|</span> 50 ml — ${prices[50]} AZN</div>`
      ).join("");
    }

    render = function campaignAwareCatalog() {
      const query = state.q.toLowerCase();
      const list = getProducts().filter(product =>
        (state.gender === "all" || product.gender === state.gender) &&
        (state.cat === "all" || product.cat === state.cat) &&
        (!query || `${product.brand} ${product.name}`.toLowerCase().includes(query))
      );
      const liveViewMap = getLiveViewMap(list);
      $("#grid").innerHTML = list.map(product => `
        <div class="card campaign-card">
          <div class="cTop">
            <img src="${product.img}" onerror="this.src='assets/placeholder.jpg';">
            ${CAMPAIGN_CONFIG.active ? '<div class="campaign-ribbon">KAMPANİYA</div>' : ''}
            <div class="catBadge">${catLabel(product.cat)}</div>
          </div>
          <div class="cBody">
            <div class="cName">${product.brand} — ${product.name}</div>
            <div class="cNotes">${product.notes}</div>
            ${CAMPAIGN_CONFIG.active ? `
              <div class="campaign-card-prices">
                <div class="normal-price-line">Normal: ${normalPricesFor(product)}</div>
                ${campaignPriceRows()}
                <small>Minimum 2 məhsul</small>
              </div>` : `<div class="regular-card-price">20 ml — ${money(product.price20)}</div>`}
            ${liveViewMap[product.id] ? `<div class="liveView">👀 Hazırda ${liveViewMap[product.id]} nəfər baxır</div>` : ""}
            <button class="sbtn primary" onclick="openModal('${product.id}')">Sifariş et</button>
          </div>
        </div>`).join("");
    };

    function ensureCountryPicker() {
      if ($("#mCountries")) return;
      const sizeBlock = $("#mSizes").closest(".optBlock");
      const block = document.createElement("div");
      block.className = "optBlock";
      block.id = "mCountryWrap";
      block.innerHTML = `
        <div class="optTitle">İstehsal ölkəsi:</div>
        <div class="optRow" id="mCountries">
          <button class="optBtn" data-country="İsveçrə">İsveçrə</button>
          <button class="optBtn" data-country="Fransa">Fransa</button>
        </div>`;
      sizeBlock.parentNode.insertBefore(block, sizeBlock);
    }

    function configureSizes() {
      $$("#mSizes [data-size]").forEach(button => {
        const hidden = CAMPAIGN_CONFIG.active && CAMPAIGN_CONFIG.hiddenSizesWhenActive.includes(Number(button.dataset.size));
        button.classList.toggle("hidden", hidden);
        button.disabled = hidden;
      });
    }

    function updateModalPrice() {
      if (!current || !pick.size) {
        $("#mPrice").textContent = "Ölkə və həcm seçin";
        return;
      }
      const normal = priceBySize(current.price20, pick.size);
      const promo = pick.country ? campaignPrice(pick.country, pick.size) : null;
      $("#mPrice").innerHTML = CAMPAIGN_CONFIG.active && promo !== null
        ? `<span class="modalOldPrice">${money(normal)}</span> <span class="modalNewPrice">${money(promo)}</span><small class="modal-price-note">minimum 2 məhsulda</small>`
        : money(normal);
    }

    window.openModal = id => {
      current = getProducts().find(product => product.id === id);
      $("#mImg").src = current.img;
      $("#mName").textContent = `${current.brand} — ${current.name}`;
      $("#mNotes").textContent = current.notes;
      pick = { size: null, country: null, delivery: null, metro: null };
      $$(".optBtn").forEach(button => button.classList.remove("active"));
      updateModalPrice();
      $("#modalBack").classList.add("show");
      document.body.style.overflow = "hidden";
    };

    renderCart = function campaignAwareCart() {
      const cart = loadCart();
      const wrap = $("#cartItems");
      if (!wrap) return;
      if (!cart.length) {
        wrap.innerHTML = '<div class="cart-empty">Səbət boşdur.</div>';
        $("#cartTotal").textContent = "0 AZN";
        $("#bundleInfo").textContent = "";
        return;
      }
      const result = calculateFinalTotal(cart);
      wrap.innerHTML = result.lines.map(item => `
        <div class="campaign-cart-row">
          <img src="${item.img}" alt="${item.name}">
          <div class="campaign-cart-info">
            <strong>${item.brand} — ${item.name}</strong>
            <span>${item.country} istehsalı • ${item.size} ml</span>
            <span>${item.qty} ədəd × ${money(item.unitPrice)} = <b>${money(item.lineTotal)}</b></span>
          </div>
          <div class="cart-qty-controls">
            <button class="btn ghost" onclick="updateQty('${item.key}', -1)">−</button>
            <span>${item.qty}</span>
            <button class="btn ghost" onclick="updateQty('${item.key}', 1)">+</button>
          </div>
        </div>`).join("");
      $("#cartTotal").textContent = money(result.total);
      $("#bundleInfo").textContent = result.msg;
      $("#bundleInfo").className = result.campaignApplied ? "campaign-status applied" : "campaign-status pending";
    };

    window.updateQty = (key, delta) => {
      let cart = loadCart();
      const item = cart.find(entry => entry.key === key);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(entry => entry.key !== key);
        saveCart(cart);
        renderCart();
      }
    };

    function showCampaignModal() {
      if (!CAMPAIGN_CONFIG.active || $("#campaignBack")) return;
      const back = document.createElement("div");
      back.id = "campaignBack";
      back.className = "campaign-back show";
      back.innerHTML = `
        <section class="campaign-modal" role="dialog" aria-modal="true" aria-labelledby="campaignTitle">
          <button class="campaign-close" type="button" aria-label="Bağla">✕</button>
          <div class="campaign-kicker">GARNET PARFUM</div>
          <h2 id="campaignTitle">BÖYÜK KAMPANİYA<br><span>TƏK QİYMƏT</span></h2>
          <div class="campaign-modal-grid">
            <div><strong>İsveçrə istehsalı</strong><span>30 ml — 12 AZN</span><span>50 ml — 18 AZN</span></div>
            <div><strong>Fransa istehsalı</strong><span>30 ml — 15 AZN</span><span>50 ml — 22 AZN</span></div>
          </div>
          <div class="campaign-condition">Kampaniyadan yararlanmaq üçün minimum sifariş sayı 2 ədəddir.</div>
        </section>`;
      document.body.appendChild(back);
      document.body.classList.add("campaign-open");
      const close = () => { back.classList.remove("show"); document.body.classList.remove("campaign-open"); setTimeout(() => back.remove(), 250); };
      back.querySelector(".campaign-close").onclick = close;
      back.onclick = event => { if (event.target === back) close(); };
      document.addEventListener("keydown", event => { if (event.key === "Escape" && document.body.contains(back)) close(); }, { once: true });
    }

    function todayIso() {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
    }

    function closeOrderForm() {
      $("#orderFormBack")?.remove();
      if (!$("#campaignBack") && !$("#modalBack").classList.contains("show") && !$("#cartBack").classList.contains("show")) {
        document.body.style.overflow = "auto";
      }
    }

    function openOrderForm() {
      const cart = loadCart();
      if (!cart.length || $("#orderFormBack")) return;
      const back = document.createElement("div");
      back.id = "orderFormBack";
      back.className = "order-form-back";
      back.innerHTML = `
        <section class="order-form-modal" role="dialog" aria-modal="true" aria-labelledby="orderFormTitle">
          <button type="button" class="order-form-close" aria-label="Bağla">✕</button>
          <h2 id="orderFormTitle">Sifarişi tamamla</h2>
          <form id="orderForm" novalidate>
            <label>Ad<input id="customerName" name="name" autocomplete="name" required></label>
            <label>Əlaqə nömrəsi<input id="customerPhone" name="phone" type="tel" autocomplete="tel" required></label>
            <label>Çatdırılma vaxtı
              <select id="deliveryTime" name="deliveryTime" required>
                <option value="">Seçin</option>
                <option>Bu gün</option>
                <option>Sabah</option>
                <option>Başqa tarix</option>
              </select>
            </label>
            <label id="deliveryDateWrap" class="hidden">Tarix
              <input id="deliveryDate" name="deliveryDate" type="date" min="${todayIso()}">
            </label>
            <fieldset>
              <legend>Ödəniş üsulu</legend>
              <label class="choice"><input type="radio" name="paymentMethod" value="Kartla" required> Kartla</label>
              <label class="choice"><input type="radio" name="paymentMethod" value="Nağd" required> Nağd</label>
            </fieldset>
            <div id="cardPaymentBox" class="card-payment-box hidden">
              <div class="card-payment-meta">
                <small>KARTLA ÖDƏNİŞ</small>
                <strong class="card-number-mask">${maskedCardNumber()}</strong>
                <span>Tam kart məlumatı WhatsApp vasitəsilə təqdim ediləcək.</span>
              </div>
              <button type="button" id="requestCardDetails">Kart məlumatını WhatsApp-da al</button>
            </div>
            <div id="orderFormError" class="order-form-error" aria-live="polite"></div>
            <button class="btn primary order-submit" type="submit">Sifarişi tamamla</button>
          </form>
        </section>`;
      document.body.appendChild(back);
      document.body.style.overflow = "hidden";
      const form = $("#orderForm");
      const dateWrap = $("#deliveryDateWrap");
      const dateInput = $("#deliveryDate");
      const cardBox = $("#cardPaymentBox");

      $("#deliveryTime").onchange = event => {
        const custom = event.target.value === "Başqa tarix";
        dateWrap.classList.toggle("hidden", !custom);
        dateInput.required = custom;
        if (!custom) dateInput.value = "";
      };
      form.querySelectorAll('[name="paymentMethod"]').forEach(input => {
        input.onchange = () => cardBox.classList.toggle("hidden", input.value !== "Kartla" || !input.checked);
      });
      $("#requestCardDetails").onclick = () => {
        const requestText = "Salam, kartla ödəniş üçün kart məlumatlarını göndərin.";
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(requestText)}`);
      };
      back.querySelector(".order-form-close").onclick = closeOrderForm;
      back.onclick = event => { if (event.target === back) closeOrderForm(); };

      form.onsubmit = event => {
        event.preventDefault();
        const payment = form.querySelector('[name="paymentMethod"]:checked')?.value || "";
        const data = {
          name: $("#customerName").value,
          phone: $("#customerPhone").value,
          deliveryTime: $("#deliveryTime").value,
          deliveryDate: dateInput.value,
          paymentMethod: payment
        };
        const errors = validateOrderFormData(data, todayIso());
        if (errors.length) {
          $("#orderFormError").textContent = errors[0] === "Keçmiş tarix seçilə bilməz"
            ? errors[0]
            : `Zəhmət olmasa doldurun: ${errors.join(", ")}`;
          return;
        }
        const result = calculateFinalTotal(loadCart());
        const message = buildWhatsAppOrderText(data, result.lines, result.total, ORDER_CONFIG.deliveryFee);
        saveToHistory(loadCart(), result.total);
        window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`);
        saveCart([]);
        $("#cartBack").classList.remove("show");
        closeOrderForm();
      };
    }

    document.addEventListener("DOMContentLoaded", () => {
      ensureCountryPicker();
      configureSizes();
      $("#mDeliveryWrap")?.remove();
      saveCart(loadCart());
      render();

      $("#mCountries").onclick = event => {
        const button = event.target.closest("[data-country]");
        if (!button) return;
        $$("#mCountries .optBtn").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        pick.country = button.dataset.country;
        updateModalPrice();
      };

      $("#mSizes").onclick = event => {
        const button = event.target.closest("[data-size]");
        if (!button || button.disabled) return;
        $$("#mSizes .optBtn").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        pick.size = button.dataset.size;
        $("#mSizeLabel").textContent = `${pick.size} ml`;
        updateModalPrice();
      };

      $("#mCopy").onclick = () => {
        if (!pick.country || !pick.size) return alert("İstehsal ölkəsi və həcmi seçin.");
        let cart = loadCart();
        const normalPrice = priceBySize(current.price20, pick.size);
        const key = `${current.id}_${pick.country}_${pick.size}`;
        const found = cart.find(item => item.key === key);
        if (found) found.qty += 1;
        else cart.push({
          key,
          id: current.id,
          brand: current.brand,
          name: current.name,
          img: current.img,
          country: pick.country,
          size: Number(pick.size),
          normalPrice,
          price: normalPrice,
          qty: 1
        });
        saveCart(cart);
        alert("Səbətə əlavə edildi!");
        closeModal();
      };

      $("#cartCheckout").textContent = "Sifariş et";
      $("#cartCheckout").onclick = openOrderForm;

      let modalShown = false;
      const showAfterPreloader = () => {
        if (modalShown) return;
        modalShown = true;
        setTimeout(showCampaignModal, 700);
      };
      window.addEventListener("load", showAfterPreloader);
      setTimeout(showAfterPreloader, 3200);
    });
  })();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CAMPAIGN_CONFIG,
    ORDER_CONFIG,
    campaignPrice,
    resolveUnitPrice,
    summarizeCampaignCart,
    maskedCardNumber,
    deliveryText,
    validateOrderFormData,
    formatSelectedDeliveryTime,
    buildWhatsAppOrderText
  };
}
