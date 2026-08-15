const CAMPAIGN_CONFIG = Object.freeze({
  active: true,
  minimumQuantity: 2,
  hiddenSizesWhenActive: Object.freeze([20]),
  allowedSizes: Object.freeze([30, 50]),
  defaultCountry: "İsveçrə",
  prices: Object.freeze({
    "İsveçrə": Object.freeze({ 30: 12, 50: 18 }),
    "Fransa": Object.freeze({ 30: 15, 50: 22 })
  })
});

const ORDER_CONFIG = Object.freeze({
  whatsappPhone: "994517238896"
});

function campaignPrice(country, size) {
  return CAMPAIGN_CONFIG.prices[country]?.[Number(size)] ?? null;
}

function resolveUnitPrice(item, totalQuantity) {
  const promotionalPrice = campaignPrice(item.country, item.size);
  const eligible = CAMPAIGN_CONFIG.active &&
    Number(totalQuantity) >= CAMPAIGN_CONFIG.minimumQuantity &&
    promotionalPrice !== null;
  return eligible ? promotionalPrice : Number(item.normalPrice ?? item.price ?? 0);
}

function summarizeCampaignCart(cart) {
  const totalQuantity = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const campaignApplied = CAMPAIGN_CONFIG.active && totalQuantity >= CAMPAIGN_CONFIG.minimumQuantity;
  const lines = cart.map(item => {
    const qty = Number(item.qty || 0);
    const unitPrice = resolveUnitPrice(item, totalQuantity);
    return { ...item, qty, unitPrice, lineTotal: unitPrice * qty };
  });
  const subtotal = lines.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    totalQuantity,
    campaignApplied,
    lines,
    subtotal,
    productsTotal: subtotal,
    total: subtotal
  };
}

function formatAzPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("994")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  digits = digits.slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean);
  return "+994" + (parts.length ? " " : "") + parts.join(" ");
}

function isValidAzPhone(value) {
  return /^\+994 (10|50|51|55|60|70|77|99) \d{3} \d{2} \d{2}$/.test(String(value || ""));
}

function validateSimpleOrder(data) {
  const errors = {};
  if (!String(data.name || "").trim()) errors.name = "Bu sahəni doldurun";
  if (!String(data.phone || "").trim()) errors.phone = "Bu sahəni doldurun";
  else if (!isValidAzPhone(data.phone)) errors.phone = "Nömrəni düzgün daxil edin";
  if (!String(data.address || "").trim()) errors.address = "Bu sahəni doldurun";
  if (!data.paymentMethod) errors.paymentMethod = "Bu sahəni doldurun";
  return errors;
}
function buildWhatsAppOrderText(data, pricedLines, productsTotal) {
  const productLines = pricedLines.map((item, index) => {
    const qty = Number(item.qty || 1);
    return (index + 1) + ". " + item.brand + " — " + item.name + ", " + item.country + ", " +
      item.size + " ml, " + qty + " ədəd × " + item.unitPrice + " AZN — " + item.lineTotal + " AZN";
  }).join("\n");
  return "Salam, Garnet Parfumdan sifariş vermək istəyirəm.\n\n" +
    "Ad: " + String(data.name).trim() + "\n" +
    "Telefon: " + String(data.phone).trim() + "\n" +
    "Ünvan: " + String(data.address).trim() + "\n" +
    "Ödəniş: " + data.paymentMethod + "\n\n" +
    "Sifariş:\n" + productLines + "\n\nYekun məbləğ: " + Math.round(productsTotal) + " AZN";
}

if (typeof window !== "undefined") {
  window.CAMPAIGN_CONFIG = CAMPAIGN_CONFIG;
  window.ORDER_CONFIG = ORDER_CONFIG;
}

if (typeof document !== "undefined") {
  (() => {
    const CART_KEY_CURRENT = "garnet_cart_v2";
    const HISTORY_KEY_CURRENT = "garnet_history_v1";
    const ui = { product: null, country: null, size: null, busy: false, lastFocus: null };
    const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#f3eadc"/><text x="50%" y="48%" text-anchor="middle" font-family="serif" font-size="110" fill="#6f1734">G</text><text x="50%" y="60%" text-anchor="middle" font-family="sans-serif" font-size="20" letter-spacing="6" fill="#8a2442">GARNET</text></svg>'
    );

    function productFor(item) {
      return getProducts().find(product => product.id === item.id);
    }

    function normalUnitPrice(item) {
      const product = productFor(item);
      return product ? priceBySize(product.price20, item.size) : Number(item.normalPrice ?? item.price ?? 0);
    }

    function normalizeCart(cart) {
      return (Array.isArray(cart) ? cart : [])
        .filter(item => !CAMPAIGN_CONFIG.active || CAMPAIGN_CONFIG.allowedSizes.includes(Number(item.size)))
        .map(item => ({
          ...item,
          key: item.key || [item.id, item.country || CAMPAIGN_CONFIG.defaultCountry, item.size].join("_"),
          country: item.country || CAMPAIGN_CONFIG.defaultCountry,
          size: Number(item.size),
          qty: Math.max(1, Number(item.qty || 1)),
          normalPrice: normalUnitPrice(item),
          delivery: null,
          metro: null
        }));
    }

    const baseLoadCart = loadCart;
    loadCart = () => normalizeCart(baseLoadCart());
    saveCart = cart => {
      localStorage.setItem(CART_KEY_CURRENT, JSON.stringify(normalizeCart(cart)));
      updateCartCountUI();
    };
    calculateFinalTotal = cart => {
      const result = summarizeCampaignCart(normalizeCart(cart));
      return {
        ...result,
        msg: result.campaignApplied
          ? "Kampaniya qiymətləri tətbiq edildi."
          : (result.totalQuantity === 1
            ? "Kampaniya üçün daha 1 məhsul əlavə edin."
            : "")
      };
    };

    function setImageFallback(image) {
      image.onerror = () => {
        image.onerror = null;
        image.src = fallbackImage;
      };
    }

    function updateCartCountUI() {
      const count = loadCart().reduce((sum, item) => sum + item.qty, 0);
      if ($("#cartCount")) $("#cartCount").textContent = String(count);
      $("#btnCart")?.setAttribute("aria-label", "Səbəti aç — " + count + " məhsul");
    }
    window.updateCartCountUI = updateCartCountUI;

    function showToast(message, type, actionLabel, action) {
      const toast = document.createElement("div");
      toast.className = "toast " + (type || "success");
      toast.innerHTML = "<span>" + message + "</span>" +
        (actionLabel ? '<button type="button">' + actionLabel + "</button>" : "");
      $("#toastRegion").appendChild(toast);
      const remove = () => {
        if (!toast.isConnected) return;
        toast.classList.add("leaving");
        setTimeout(() => toast.remove(), 260);
      };
      if (actionLabel && action) toast.querySelector("button").onclick = () => { action(); remove(); };
      setTimeout(remove, 3600);
    }

    function pulseCart() {
      const button = $("#btnCart");
      button.classList.remove("pulse");
      void button.offsetWidth;
      button.classList.add("pulse");
      setTimeout(() => button.classList.remove("pulse"), 500);
    }

    function flyToCart(sourceImage) {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || !sourceImage) return;
      const start = sourceImage.getBoundingClientRect();
      const end = $("#btnCart").getBoundingClientRect();
      const clone = document.createElement("img");
      clone.className = "fly-image";
      clone.src = sourceImage.currentSrc || sourceImage.src;
      clone.alt = "";
      Object.assign(clone.style, { left: start.left + "px", top: start.top + "px", width: "58px", height: "58px" });
      document.body.appendChild(clone);
      requestAnimationFrame(() => {
        clone.style.transform = "translate(" + (end.left - start.left) + "px," + (end.top - start.top) + "px) scale(.32)";
        clone.style.opacity = "0";
      });
      setTimeout(() => clone.remove(), 700);
    }

    function focusable(container) {
      return [...container.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.classList.contains("hidden") && element.offsetParent !== null);
    }

    function trapFocus(event, container) {
      if (event.key !== "Tab") return;
      const items = focusable(container);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    function syncBodyLock() {
      const locked = $(".overlay.show") || $(".drawer-backdrop.show") || $(".campaign-back.show");
      document.body.classList.toggle("no-scroll", Boolean(locked));
    }

    function openLayer(element, focusTarget) {
      ui.lastFocus = document.activeElement;
      element.classList.add("show");
      element.setAttribute("aria-hidden", "false");
      syncBodyLock();
      setTimeout(() => (focusTarget || focusable(element)[0])?.focus(), 30);
    }

    function closeLayer(element) {
      element.classList.remove("show");
      element.setAttribute("aria-hidden", "true");
      syncBodyLock();
      ui.lastFocus?.focus?.();
    }

    function normalPricesFor(product) {
      return CAMPAIGN_CONFIG.allowedSizes
        .map(size => size + " ml — " + money(priceBySize(product.price20, size)))
        .join(" · ");
    }

    function renderCatalog() {
      const query = state.q.trim().toLocaleLowerCase("az");
      const list = getProducts().filter(product =>
        (state.gender === "all" || product.gender === state.gender) &&
        (state.cat === "all" || product.cat === state.cat) &&
        (!query || (product.brand + " " + product.name).toLocaleLowerCase("az").includes(query))
      );
      $("#catalogCount").textContent = list.length + " ətir";
      if (!list.length) {
        $("#grid").innerHTML = '<div class="empty-state"><span class="empty-state-icon">G</span><h3>Nəticə tapılmadı</h3><p>Axtarışı və ya filtrləri dəyişərək yenidən yoxlayın.</p></div>';
        return;
      }
      const swiss = CAMPAIGN_CONFIG.prices["İsveçrə"];
      const france = CAMPAIGN_CONFIG.prices["Fransa"];
      $("#grid").innerHTML = list.map(product =>
        '<article class="product-card campaign-card">' +
          '<div class="product-media">' +
            '<img src="' + product.img + '" alt="' + product.brand + " " + product.name + ' ətiri" loading="lazy">' +
            '<span class="product-category">' + catLabel(product.cat).toLocaleUpperCase("az") + '</span>' +
            (CAMPAIGN_CONFIG.active ? '<span class="campaign-label">KAMPANİYA</span>' : "") +
          '</div>' +
          '<div class="product-body">' +
            '<div><p class="product-brand">' + product.brand + '</p><h3 class="product-name">' + product.name + '</h3></div>' +
            '<p class="product-notes">' + product.notes + '</p>' +
            (CAMPAIGN_CONFIG.active
              ? '<div class="price-table">' +
                  '<span class="normal-prices">Normal: ' + normalPricesFor(product) + '</span>' +
                  '<div class="promo-row"><strong>İsveçrə</strong><span>30 ml — ' + swiss[30] + ' · 50 ml — ' + swiss[50] + ' AZN</span></div>' +
                  '<div class="promo-row"><strong>Fransa</strong><span>30 ml — ' + france[30] + ' · 50 ml — ' + france[50] + ' AZN</span></div>' +
                  '<span class="minimum-warning">Minimum 2 məhsul</span>' +
                '</div>'
              : '<div class="price-table"><strong>' + money(product.price20) + '</strong></div>') +
            '<button class="button button-primary product-order" type="button" data-product-id="' + product.id + '">Sifariş et</button>' +
          '</div>' +
        '</article>'
      ).join("");
      $$("#grid img").forEach(setImageFallback);
    }

    function syncModalSelection() {
      const complete = Boolean(ui.country && ui.size);
      $("#mCopy").disabled = !complete || ui.busy;
      $("#mAddHint").textContent = complete ? "" : "Ölkə və həcmi seçin";
      if (!complete) {
        $("#mPrice").textContent = "";
        return;
      }
      const normal = priceBySize(ui.product.price20, ui.size);
      const promotional = campaignPrice(ui.country, ui.size);
      $("#mPrice").innerHTML = CAMPAIGN_CONFIG.active && promotional !== null
        ? '<span class="modal-old-price">' + money(normal) + '</span><strong class="modal-new-price">' +
            money(promotional) + '</strong><small>minimum 2 məhsulda</small>'
        : '<strong class="modal-new-price">' + money(normal) + '</strong>';
      $("#mPrice").classList.remove("price-updated");
      void $("#mPrice").offsetWidth;
      $("#mPrice").classList.add("price-updated");
    }

    function resetSelection() {
      ui.country = null;
      ui.size = null;
      $$("#mCountries .option-btn, #mSizes .option-btn").forEach(button => {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      });
      syncModalSelection();
    }

    function openProductModal(productId) {
      const product = getProducts().find(item => item.id === productId);
      if (!product) return;
      ui.product = product;
      $("#mImg").src = product.img;
      $("#mImg").alt = product.brand + " " + product.name + " ətiri";
      setImageFallback($("#mImg"));
      $("#mName").textContent = product.brand + " — " + product.name;
      $("#mNotes").textContent = product.notes;
      $$("#mSizes [data-size]").forEach(button => {
        const hidden = CAMPAIGN_CONFIG.active &&
          CAMPAIGN_CONFIG.hiddenSizesWhenActive.includes(Number(button.dataset.size));
        button.classList.toggle("hidden", hidden);
        button.disabled = hidden;
      });
      resetSelection();
      openLayer($("#modalBack"), $("#x"));
    }

    function closeProductModal() {
      closeLayer($("#modalBack"));
    }

    function addCurrentProduct() {
      if (ui.busy || !ui.product || !ui.country || !ui.size) return;
      ui.busy = true;
      $("#mCopy").disabled = true;
      $("#mCopy").textContent = "Əlavə edilir...";
      const product = ui.product;
      const key = [product.id, ui.country, ui.size].join("_");
      const cart = loadCart();
      const found = cart.find(item => item.key === key);
      if (found) found.qty += 1;
      else {
        const normalPrice = priceBySize(product.price20, ui.size);
        cart.push({
          key,
          id: product.id,
          brand: product.brand,
          name: product.name,
          img: product.img,
          country: ui.country,
          size: Number(ui.size),
          normalPrice,
          price: normalPrice,
          qty: 1
        });
      }
      flyToCart($("#mImg"));
      saveCart(cart);
      pulseCart();
      setTimeout(() => {
        closeProductModal();
        ui.busy = false;
        $("#mCopy").textContent = "Səbətə əlavə et";
        showToast("Məhsul səbətə əlavə edildi", "success", "Səbətə bax", openCart);
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260);
    }

    function renderCart() {
      const cart = loadCart();
      const wrap = $("#cartItems");
      if (!cart.length) {
        wrap.innerHTML = '<div class="cart-empty"><div><span class="empty-state-icon">G</span><h3>Səbətiniz boşdur</h3><p>Bəyəndiyiniz ətri seçərək sifarişə başlayın.</p><button class="button button-primary" type="button" data-cart-action="catalog">Kataloqa qayıt</button></div></div>';
        $("#cartTotal").textContent = "0 AZN";
        $("#bundleInfo").textContent = "";
        $("#cartCheckout").disabled = true;
        return;
      }
      const result = calculateFinalTotal(cart);
      wrap.innerHTML = result.lines.map(item =>
        '<article class="cart-row">' +
          '<img src="' + item.img + '" alt="' + item.brand + " " + item.name + ' ətiri">' +
          '<div class="cart-row-info"><strong>' + item.brand + " — " + item.name + '</strong>' +
            '<span>' + item.country + ' istehsalı · ' + item.size + ' ml</span>' +
            '<span>' + item.qty + ' ədəd × ' + money(item.unitPrice) + '</span>' +
            '<span class="cart-line-total">' + money(item.lineTotal) + '</span></div>' +
          '<div class="cart-row-actions">' +
            '<div class="quantity-control" aria-label="' + item.name + ' miqdarı">' +
              '<button type="button" data-cart-action="decrease" data-key="' + item.key + '" aria-label="Miqdarı azalt">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button type="button" data-cart-action="increase" data-key="' + item.key + '" aria-label="Miqdarı artır">+</button>' +
            '</div>' +
            '<button class="remove-item" type="button" data-cart-action="remove" data-key="' + item.key + '">Sil</button>' +
          '</div>' +
        '</article>'
      ).join("");
      $$("#cartItems img").forEach(setImageFallback);
      $("#cartTotal").textContent = money(result.total);
      $("#bundleInfo").textContent = result.msg;
      $("#bundleInfo").className = "campaign-status " + (result.campaignApplied ? "applied" : "pending");
      $("#cartCheckout").disabled = false;
    }
    window.renderCart = renderCart;

    function openCart() {
      renderCart();
      openLayer($("#cartBack"), $("#cartX"));
    }

    function closeCart() {
      closeLayer($("#cartBack"));
    }

    function updateCartItem(key, delta) {
      let cart = loadCart();
      const item = cart.find(entry => entry.key === key);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) cart = cart.filter(entry => entry.key !== key);
      saveCart(cart);
      renderCart();
    }

    function removeCartItem(button, key) {
      if (button.dataset.confirming !== "true") {
        button.dataset.confirming = "true";
        button.textContent = "Silməni təsdiqlə";
        showToast("Məhsulu silmək üçün düyməyə yenidən basın.", "error");
        setTimeout(() => {
          if (button.isConnected) {
            button.dataset.confirming = "false";
            button.textContent = "Sil";
          }
        }, 3000);
        return;
      }
      saveCart(loadCart().filter(item => item.key !== key));
      renderCart();
      showToast("Məhsul səbətdən silindi.");
    }

    function normalizeHistoryEntry(entry, index) {
      if (entry.id) return entry;
      return {
        id: "GP-" + String(Date.now() - index).slice(-6),
        date: entry.date || "",
        total: Number(entry.total || 0),
        items: typeof entry.items === "string" ? entry.items : "",
        status: "Tamamlandı"
      };
    }

    function getHistory() {
      try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY_CURRENT) || "[]").map(normalizeHistoryEntry);
      } catch {
        return [];
      }
    }

    function saveDetailedHistory(cart, total, data) {
      const history = getHistory();
      history.unshift({
        id: "GP-" + String(Date.now()).slice(-6),
        date: new Date().toLocaleString("az-AZ"),
        total,
        items: cart.map(item => item.brand + " " + item.name + " × " + item.qty).join(", "),
        status: "WhatsApp-a yönləndirildi",
        customer: String(data.name || "").trim()
      });
      localStorage.setItem(HISTORY_KEY_CURRENT, JSON.stringify(history.slice(0, 20)));
    }

    function renderHistory() {
      const history = getHistory();
      $("#historyItems").innerHTML = history.length
        ? history.map(order =>
            '<article class="history-card">' +
              '<header><span class="history-number">#' + order.id + '</span><span class="history-status">' +
                (order.status || "Tamamlandı") + '</span></header>' +
              '<p><strong>' + order.date + '</strong></p>' +
              '<p>' + (order.items || "Məhsul məlumatı yoxdur") + '</p>' +
              '<p>Məbləğ: <strong>' + money(order.total) + '</strong></p>' +
            '</article>'
          ).join("")
        : '<div class="empty-state"><span class="empty-state-icon">G</span><h3>Tarixçə boşdur</h3><p>Tamamladığınız sifarişlər burada görünəcək.</p></div>';
    }
    window.renderHistory = renderHistory;

    function orderData() {
      return {
        name: $("#customerName").value,
        phone: $("#customerPhone").value,
        address: $("#deliveryAddress").value,
        paymentMethod: $('#orderForm [name="paymentMethod"]:checked')?.value || ""
      };
    }

    function clearOrderErrors() {
      $$("#orderForm .field").forEach(field => field.classList.remove("invalid"));
      $$("#orderForm .field-error").forEach(error => { error.textContent = ""; });
    }

    function showOrderErrors(errors) {
      clearOrderErrors();
      Object.entries(errors).forEach(([name, message]) => {
        if (name === "paymentMethod") {
          $("#paymentError").textContent = message;
          return;
        }
        const input = $('#orderForm [name="' + name + '"]');
        const field = input?.closest(".field");
        if (field) {
          field.classList.add("invalid");
          field.querySelector(".field-error").textContent = message;
        }
      });
      $('#orderForm .invalid input')?.focus();
    }

    function openOrder() {
      const cart = loadCart();
      if (!cart.length) {
        showToast("Səbət boşdur. Əvvəlcə məhsul əlavə edin.", "error");
        return;
      }
      closeCart();
      $("#orderTotal").textContent = money(calculateFinalTotal(cart).total);
      openLayer($("#orderBack"), $("#customerName"));
    }

    function closeOrder() {
      closeLayer($("#orderBack"));
    }

    function completeOrder(event) {
      event.preventDefault();
      if (ui.busy) return;
      const cart = loadCart();
      if (!cart.length) {
        closeOrder();
        showToast("Səbət boşdur. Əvvəlcə məhsul əlavə edin.", "error");
        return;
      }
      const data = orderData();
      const errors = validateSimpleOrder(data);
      if (Object.keys(errors).length) {
        showOrderErrors(errors);
        return;
      }
      clearOrderErrors();
      const result = calculateFinalTotal(cart);
      const message = buildWhatsAppOrderText(data, result.lines, result.total);
      const whatsappUrl = "https://wa.me/" + ORDER_CONFIG.whatsappPhone +
        "?text=" + encodeURIComponent(message);
      ui.busy = true;
      $("#continueWhatsApp").disabled = true;
      $("#continueWhatsApp").textContent = "Hazırlanır...";
      saveDetailedHistory(cart, result.total, data);
      window.open(whatsappUrl, "_blank", "noopener");
      saveCart([]);
      renderHistory();
      setTimeout(() => {
        ui.busy = false;
        $("#continueWhatsApp").disabled = false;
        $("#continueWhatsApp").textContent = "Davam et";
        $("#orderForm").reset();
        closeOrder();
        showToast("Sifariş mətni WhatsApp-da hazırlandı.");
      }, 200);
    }
    function showCampaignModal() {
      if (!CAMPAIGN_CONFIG.active || $("#campaignBack")) return;
      const back = document.createElement("div");
      back.id = "campaignBack";
      back.className = "campaign-back";
      back.setAttribute("aria-hidden", "true");
      back.innerHTML =
        '<section class="campaign-modal" role="dialog" aria-modal="true" aria-labelledby="campaignTitle">' +
          '<button class="campaign-close" type="button" aria-label="Kampaniya pəncərəsini bağla">×</button>' +
          '<div class="campaign-kicker">GARNET PARFUM</div>' +
          '<h2 id="campaignTitle">BÖYÜK KAMPANİYA<br><span>TƏK QİYMƏT</span></h2>' +
          '<div class="campaign-modal-grid">' +
            '<div><strong>İsveçrə istehsalı</strong><span>30 ml — 12 AZN</span><span>50 ml — 18 AZN</span></div>' +
            '<div><strong>Fransa istehsalı</strong><span>30 ml — 15 AZN</span><span>50 ml — 22 AZN</span></div>' +
          '</div>' +
          '<div class="campaign-condition">Kampaniyadan yararlanmaq üçün minimum sifariş sayı 2 ədəddir.</div>' +
        '</section>';
      document.body.appendChild(back);
      const close = () => {
        closeLayer(back);
        setTimeout(() => back.remove(), 260);
      };
      back.querySelector(".campaign-close").onclick = close;
      back.onclick = event => { if (event.target === back) close(); };
      openLayer(back, back.querySelector(".campaign-close"));
    }

    function setupNavigation() {
      $("#menuToggle").onclick = () => {
        const open = $("#mainNav").classList.toggle("open");
        $("#menuToggle").setAttribute("aria-expanded", String(open));
        $("#menuToggle").setAttribute("aria-label", open ? "Menyunu bağla" : "Menyunu aç");
      };
      $$("#mainNav a").forEach(link => {
        link.onclick = () => {
          $("#mainNav").classList.remove("open");
          $("#menuToggle").setAttribute("aria-expanded", "false");
        };
      });
      addEventListener("scroll", () => {
        $("#siteHeader").classList.toggle("scrolled", scrollY > 10);
      }, { passive: true });
      const observer = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        $$("#mainNav a").forEach(link =>
          link.classList.toggle("active", link.getAttribute("href") === "#" + visible.target.id)
        );
      }, { rootMargin: "-38% 0px -52% 0px", threshold: [0, .2, .6] });
      ["home", "catalog", "about", "contact"].forEach(id =>
        observer.observe(document.getElementById(id))
      );
    }

    function setupEvents() {
      $("#search").oninput = event => {
        state.q = event.target.value;
        renderCatalog();
      };
      $("#genderPick").onclick = event => {
        const button = event.target.closest("[data-gender]");
        if (!button) return;
        $$("#genderPick [data-gender]").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        state.gender = button.dataset.gender;
        renderCatalog();
      };
      $("#chips").onclick = event => {
        const button = event.target.closest("[data-cat]");
        if (!button) return;
        $$("#chips [data-cat]").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        state.cat = button.dataset.cat;
        renderCatalog();
      };
      $("#grid").onclick = event => {
        const button = event.target.closest("[data-product-id]");
        if (button) openProductModal(button.dataset.productId);
      };
      $("#mCountries").onclick = event => {
        const button = event.target.closest("[data-country]");
        if (!button) return;
        $$("#mCountries .option-btn").forEach(item => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        ui.country = button.dataset.country;
        syncModalSelection();
      };
      $("#mSizes").onclick = event => {
        const button = event.target.closest("[data-size]");
        if (!button || button.disabled) return;
        $$("#mSizes .option-btn").forEach(item => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        ui.size = Number(button.dataset.size);
        syncModalSelection();
      };
      $("#mCopy").onclick = addCurrentProduct;
      $("#x").onclick = closeProductModal;
      $("#modalBack").onclick = event => {
        if (event.target === $("#modalBack")) closeProductModal();
      };
      $("#btnCart").onclick = openCart;
      $("#cartX").onclick = closeCart;
      $("#cartBack").onclick = event => {
        if (event.target === $("#cartBack")) closeCart();
      };
      $("#cartItems").onclick = event => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;
        const action = button.dataset.cartAction;
        if (action === "catalog") {
          closeCart();
          $("#catalog").scrollIntoView({ behavior: "smooth" });
        } else if (action === "increase") {
          updateCartItem(button.dataset.key, 1);
        } else if (action === "decrease") {
          updateCartItem(button.dataset.key, -1);
        } else if (action === "remove") {
          removeCartItem(button, button.dataset.key);
        }
      };
      $("#cartCheckout").onclick = openOrder;
      $("#orderClose").onclick = closeOrder;
      $("#orderBack").onclick = event => {
        if (event.target === $("#orderBack")) closeOrder();
      };
      $("#customerPhone").oninput = event => {
        event.target.value = formatAzPhone(event.target.value);
      };
      $("#orderForm").onsubmit = completeOrder;
      $$("#orderForm input").forEach(input => {
        input.addEventListener("input", () => {
          input.closest(".field")?.classList.remove("invalid");
          const error = input.closest(".field")?.querySelector(".field-error");
          if (error) error.textContent = "";
        });
      });
      $$('#orderForm [name="paymentMethod"]').forEach(input => {
        input.onchange = () => { $("#paymentError").textContent = ""; };
      });
      document.addEventListener("keydown", event => {
        const active = $(".campaign-back.show") || $("#orderBack.show") ||
          $(".overlay.show") || $(".drawer-backdrop.show");
        if (!active) return;
        if (event.key === "Escape") {
          if (active.id === "campaignBack") active.querySelector(".campaign-close").click();
          else if (active.id === "orderBack") closeOrder();
          else if (active.id === "modalBack") closeProductModal();
          else closeCart();
        } else {
          trapFocus(event, active);
        }
      });
    }

    function initialize() {
      setupNavigation();
      setupEvents();
      $$('[data-whatsapp-link]').forEach(link => {
        link.href = "https://wa.me/" + ORDER_CONFIG.whatsappPhone;
      });
      updateCartCountUI();
      renderCatalog();
      renderHistory();
      const hidePreloader = () => {
        const loader = $("#preloader");
        if (!loader.classList.contains("fade-out")) {
          loader.classList.add("fade-out");
          setTimeout(showCampaignModal, 500);
        }
      };
      addEventListener("load", hidePreloader, { once: true });
      setTimeout(hidePreloader, 1800);
    }

    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  })();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CAMPAIGN_CONFIG,
    ORDER_CONFIG,
    campaignPrice,
    resolveUnitPrice,
    summarizeCampaignCart,
    formatAzPhone,
    isValidAzPhone,
    validateSimpleOrder,
    buildWhatsAppOrderText
  };
}
