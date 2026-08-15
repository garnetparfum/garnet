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
          normalPrice: normalUnitPrice(item)
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
      $("#metroStation").value = "";
      $("#mDeliveryWrap").classList.add("hidden");
      $("#metroSelectWrap").classList.add("hidden");
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
            ${item.metro ? `<small>Metro: ${item.metro} (+${money((METRO_PRICES[item.metro] || 0) * item.qty)})</small>` : `<small>Çatdırılma: ${item.delivery}</small>`}
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

    function whatsappOrder() {
      const cart = loadCart();
      if (!cart.length) return;
      const result = calculateFinalTotal(cart);
      saveToHistory(cart, result.total);
      const lines = result.lines.map(item => [
        `• ${item.brand} — ${item.name}`,
        `  İstehsal: ${item.country}`,
        `  Həcm: ${item.size} ml`,
        `  Say: ${item.qty} ədəd`,
        `  Bir ədəd: ${money(item.unitPrice)}`,
        `  Məhsul üzrə cəmi: ${money(item.lineTotal)}`,
        item.metro ? `  Metro: ${item.metro} (+${money((METRO_PRICES[item.metro] || 0) * item.qty)})` : `  Çatdırılma: ${item.delivery}`
      ].join("\n")).join("\n\n");
      const campaignLine = result.campaignApplied ? "\n✅ Kampaniya qiymətləri tətbiq edildi.\n" : "\n";
      const message = `Salam Garnet Parfum! Sifariş:\n\n${lines}${campaignLine}\nYekun məbləğ: ${money(result.total)}`;
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`);
      saveCart([]);
      $("#cartBack").classList.remove("show");
    }

    document.addEventListener("DOMContentLoaded", () => {
      ensureCountryPicker();
      configureSizes();
      saveCart(loadCart());
      render();

      $("#mCountries").onclick = event => {
        const button = event.target.closest("[data-country]");
        if (!button) return;
        $$("#mCountries .optBtn").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        pick.country = button.dataset.country;
        updateModalPrice();
        if (pick.size) $("#mDeliveryWrap").classList.remove("hidden");
      };

      $("#mSizes").onclick = event => {
        const button = event.target.closest("[data-size]");
        if (!button || button.disabled) return;
        $$("#mSizes .optBtn").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        pick.size = button.dataset.size;
        $("#mSizeLabel").textContent = `${pick.size} ml`;
        updateModalPrice();
        if (pick.country) $("#mDeliveryWrap").classList.remove("hidden");
      };

      $("#mCopy").onclick = () => {
        if (!pick.country || !pick.size || !pick.delivery) return alert("İstehsal ölkəsi, həcm və çatdırılmanı seçin.");
        if (pick.delivery === "Metro" && !$("#metroStation").value) return alert("Zəhmət olmasa metronu seçin.");
        let cart = loadCart();
        const metro = pick.delivery === "Metro" ? $("#metroStation").value : null;
        const normalPrice = priceBySize(current.price20, pick.size);
        const key = `${current.id}_${pick.country}_${pick.size}_${pick.delivery}_${metro || ""}`;
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
          delivery: pick.delivery,
          metro,
          normalPrice,
          price: normalPrice,
          qty: 1
        });
        saveCart(cart);
        alert("Səbətə əlavə edildi!");
        closeModal();
      };

      $("#cartCheckout").onclick = whatsappOrder;

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
  module.exports = { CAMPAIGN_CONFIG, campaignPrice, resolveUnitPrice, summarizeCampaignCart };
}
