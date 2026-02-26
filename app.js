// =========================
// Garnet Parfum - app.js (FINAL FIXED)
// =========================

const WHATSAPP_PHONE = "994517238896"; // 0517238896

// ✅ 20ml baza qiymət → 30/50 avtomatik yuvarlaqlanır
function roundAzN(x){
  return Math.round(x * 2) / 2; // 0.5 AZN addımı
}
function priceBySize(base20, sizeMl){
  const s = Number(sizeMl);
  if(s === 20) return base20;
  if(s === 30) return roundAzN(base20 * 1.25);
  if(s === 50) return roundAzN(base20 * 1.90);
  return base20;
}

// =========================
// PRODUCTS
// =========================
const PRODUCTS = [
  // KİŞİ
  { id:"m_9pm", brand:"Afnan", name:"9PM", gender:"male", cat:"sweet", price20:18,
    notes:"Şirin • Vanil • Tonka", desc:"Şirin və cazibədar kişi ətri.", img:"assets/m_9pm.jpg" },
  { id:"m_dalal", brand:"Al-Rehab", name:"Dalal", gender:"male", cat:"sweet", price20:15,
    notes:"Şirin • Karamel • Vanil", desc:"Gourmand şirin notlar.", img:"assets/m_dalal.jpg" },
  { id:"m_bleu", brand:"Chanel", name:"Bleu de Chanel", gender:"male", cat:"fresh", price20:17,
    notes:"Sərin • Sitrus • Təmiz", desc:"Təravətli və klassik kişi ətri.", img:"assets/m_bleu.jpg" },
  { id:"m_burberry_men", brand:"Burberry", name:"Burberry Men", gender:"male", cat:"woody", price20:15,
    notes:"Odunsu • Ədviyyat", desc:"Odunsu və ciddi kompozisiya.", img:"assets/m_burberry_men.jpg" },
  { id:"m_egoist", brand:"Chanel", name:"Egoiste", gender:"male", cat:"woody", price20:15,
    notes:"Odunsu • Ədviyyat", desc:"Qalıcı və güclü aura.", img:"assets/m_egoist.jpg" },
  { id:"m_terre", brand:"Hermes", name:"Terre d’Hermes", gender:"male", cat:"woody", price20:15,
    notes:"Odunsu • Sitrus", desc:"Klassik və çox sevilən seçim.", img:"assets/m_terre.jpg" },
  { id:"m_blue", brand:"Antonio Banderas", name:"Blue", gender:"male", cat:"fresh", price20:15,
    notes:"Sərin • Təmiz", desc:"Yüngül və gündəlik təravət.", img:"assets/m_blue.jpg" },
  { id:"m_chrome", brand:"Azzaro", name:"Chrome", gender:"male", cat:"fresh", price20:15,
    notes:"Sərin • Təmiz", desc:"Təmiz və fresh notlar.", img:"assets/m_chrome.jpg" },

  // UNISEX
  { id:"u_tribute_blue", brand:"Afnan", name:"Tribute Blue", gender:"unisex", cat:"fresh", price20:25,
    notes:"Sərin • Dəniz • Təmiz", desc:"Unisex təravətli seçim.", img:"assets/u_tribute_blue.jpg" },
  { id:"u_amber_wood", brand:"Ajmal", name:"Amber Wood", gender:"unisex", cat:"dark", price20:22,
    notes:"Tünd • Amber • Dərin", desc:"Dərin və premium unisex.", img:"assets/u_amber_wood.jpg" },
  { id:"u_br540", brand:"Baccarat", name:"Rouge 540", gender:"unisex", cat:"sweet", price20:25,
    notes:"Şirin • Amber • Zərif", desc:"Əfsanəvi unisex qoxu.", img:"assets/u_br540.jpg" },

  // QADIN
  { id:"f_chance", brand:"Chanel", name:"Chance", gender:"female", cat:"fresh", price20:15,
    notes:"Sərin • Çiçək", desc:"Yüngül və təravətli qadın ətri.", img:"assets/f_chance.jpg" },
  { id:"f_fresh", brand:"Chanel", name:"Fresh", gender:"female", cat:"fresh", price20:15,
    notes:"Sərin • Təmiz", desc:"Gündəlik fresh seçim.", img:"assets/f_fresh.jpg" },
  { id:"f_coco", brand:"Chanel", name:"Coco Mademoiselle", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Çiçək • Zərif", desc:"Zərif və çox sevilən qadın ətri.", img:"assets/f_coco.jpg" },
  { id:"f_si", brand:"Armani", name:"Si", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Qalıcı", desc:"Şirin və elegant aura.", img:"assets/f_si.jpg" },
  { id:"f_poison", brand:"Hypnotic Poison", name:"Poison", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Vanil", desc:"Gourmand şirin qoxu.", img:"assets/f_poison.jpg" },
  { id:"f_libre", brand:"YSL", name:"Libre", gender:"female", cat:"sweet", price20:20,
    notes:"Şirin • Lavanda", desc:"Cazibədar və qalıcı.", img:"assets/f_libre.jpg" },
  { id:"f_opium", brand:"YSL", name:"Black Opium", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Qəhvə", desc:"Şirin və gecəlik aura.", img:"assets/f_opium.jpg" },
  { id:"f_goodgirl", brand:"Carolina Herrera", name:"Good Girl", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Dərin", desc:"Çox məşhur şirin seçim.", img:"assets/f_goodgirl.jpg" },
  { id:"f_golden", brand:"Antonio Banderas", name:"Her Golden Secret", gender:"female", cat:"sweet", price20:15,
    notes:"Şirin • Zərif", desc:"Şirin və yumşaq iz buraxır.", img:"assets/f_golden.jpg" },
  { id:"f_burberryher", brand:"Burberry", name:"Her", gender:"female", cat:"sweet", price20:25,
    notes:"Şirin • Meyvəli", desc:"Gourmand meyvəli şirin seçim.", img:"assets/f_burberryher.jpg" },
  { id:"f_myburberry", brand:"Burberry", name:"My Burberry", gender:"female", cat:"fresh", price20:15,
    notes:"Sərin • Çiçək", desc:"Təmiz və klassik qadın ətri.", img:"assets/f_myburberry.jpg" },
];

// =========================
// DOM helpers + state
// =========================
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let state = { gender: "all", cat: "all", q: "" };
let current = null;
let pick = { size: null, delivery: null };

// =========================
// labels / format
// =========================
function genderLabel(g){
  return g === "male" ? "Kişi" : (g === "female" ? "Qadın" : "Unisex");
}
function catLabel(cat){
  return { sweet:"Şirin ətir", dark:"Tünd ətir", fresh:"Sərin ətir", woody:"Odunsu ətir" }[cat] || "Ətir";
}
function money(v){
  const n = Number(v);
  return `${Number.isInteger(n) ? n : n}AZN`;
}
function openWAHello(){
  window.open(
    `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Salam Garnet Parfum! Mən ətir sifarişi etmək istəyirəm.")}`,
    "_blank"
  );
}

// =========================
// Modal selection
// =========================
function requireSelectionsOrWarn(){
  if(!pick.size){
    alert("Zəhmət olmasa həcm seçin: 20ml / 30ml / 50ml");
    return false;
  }
  if(!pick.delivery){
    alert("Zəhmət olmasa çatdırılma seçin: Metro / Taksi");
    return false;
  }
  return true;
}

function resetModalSelections(){
  pick.size = null;
  pick.delivery = null;

  $$("#mSizes .optBtn").forEach(b => b.classList.remove("active"));
  $("#mDeliveryWrap") && $("#mDeliveryWrap").classList.add("hidden");
  $$("#mDelivery .optBtn").forEach(b => b.classList.remove("active"));
  $("#mSize") && ($("#mSize").textContent = "Seç");

  if(current){
    $("#mPrice") && ($("#mPrice").textContent = money(current.price20));
  }
}

function updateModalPrice(){
  if(!current) return;
  const size = pick.size ? Number(pick.size) : 20;
  const finalPrice = priceBySize(current.price20, size);
  $("#mPrice") && ($("#mPrice").textContent = money(finalPrice));
}

// ✅ Modal düymələri event delegation ilə (hər dəfə 100% işləyir)
function bindModalOptionHandlers(){
  const sizesWrap = $("#mSizes");
  const delWrap = $("#mDelivery");

  if(sizesWrap && !sizesWrap.dataset.bound){
    sizesWrap.dataset.bound = "1";
    sizesWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".optBtn");
      if(!btn) return;

      sizesWrap.querySelectorAll(".optBtn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");

      pick.size = btn.dataset.size;
      $("#mSize") && ($("#mSize").textContent = `${pick.size}ml`);

      $("#mDeliveryWrap") && $("#mDeliveryWrap").classList.remove("hidden");

      // delivery reset
      pick.delivery = null;
      delWrap && delWrap.querySelectorAll(".optBtn").forEach(x => x.classList.remove("active"));

      updateModalPrice();
    });
  }

  if(delWrap && !delWrap.dataset.bound){
    delWrap.dataset.bound = "1";
    delWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".optBtn");
      if(!btn) return;

      if(!pick.size){
        alert("Əvvəlcə həcm seçin (20/30/50ml).");
        return;
      }

      delWrap.querySelectorAll(".optBtn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      pick.delivery = btn.dataset.delivery;
    });
  }
}

// =========================
// CART (localStorage)
// =========================
const CART_KEY = "garnet_cart_v1";

function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch{ return []; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function setCartCountUI(){
  const cart = loadCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  const el = $("#cartCount");
  if(el) el.textContent = `(${count})`;
}
function cartTotal(cart){
  return cart.reduce((s,i)=> s + (Number(i.price)||0) * (i.qty||0), 0);
}

function addToCart(p, sizeMl, delivery){
  const size = Number(sizeMl);
  const price = priceBySize(p.price20, size);
  const key = `${p.id}_${size}_${delivery}`;

  const cart = loadCart();
  const found = cart.find(i => i.key === key);
  if(found){
    found.qty += 1; // ✅ eyni məhsulu limitsiz artırır
  }else{
    cart.push({
      key,
      id: p.id,
      brand: p.brand,
      name: p.name,
      img: p.img,
      gender: p.gender,
      cat: p.cat,
      size,
      delivery,
      price,
      qty: 1
    });
  }

  saveCart(cart);
  setCartCountUI();
  renderCart();
}

function removeFromCart(key){
  const cart = loadCart().filter(i => i.key !== key);
  saveCart(cart);
  setCartCountUI();
  renderCart();
}

function changeQty(key, delta){
  const cart = loadCart();
  const it = cart.find(i => i.key === key);
  if(!it) return;
  it.qty = Math.max(1, (it.qty||1) + delta);
  saveCart(cart);
  setCartCountUI();
  renderCart();
}

function clearCart(){
  saveCart([]);
  setCartCountUI();
  renderCart();
}

function openCart(){
  $("#cartBack") && $("#cartBack").classList.add("show");
  renderCart();
}
function closeCart(){
  $("#cartBack") && $("#cartBack").classList.remove("show");
}

function renderCart(){
  const cart = loadCart();
  const wrap = $("#cartItems");
  const totalEl = $("#cartTotal");
  if(!wrap || !totalEl) return;

  if(cart.length === 0){
    wrap.innerHTML = `<div style="color:#666; font-size:13px;">Səbət boşdur 🙂</div>`;
    totalEl.textContent = `0 AZN`;
    return;
  }

  wrap.innerHTML = cart.map(i => `
    <div style="display:flex; gap:10px; align-items:center; padding:10px; border:1px solid rgba(0,0,0,.08); border-radius:14px; background:rgba(255,255,255,.65);">
      <img src="${i.img}" onerror="this.src='assets/placeholder.jpg';"
           style="width:56px; height:56px; border-radius:12px; object-fit:cover; border:1px solid rgba(0,0,0,.08);" />

      <div style="flex:1;">
        <div style="font-weight:1100;">${i.brand} — ${i.name}</div>
        <div style="font-size:12px; color:#666; margin-top:2px;">
          ${i.size}ml • ${i.delivery} • ${money(i.price)}
        </div>

        <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
          <button class="btn ghost" data-minus="${i.key}" style="padding:8px 10px;">-</button>
          <div style="font-weight:1100;">${i.qty}</div>
          <button class="btn ghost" data-plus="${i.key}" style="padding:8px 10px;">+</button>

          <button class="btn ghost" data-remove="${i.key}" style="margin-left:auto; padding:8px 10px; border-color:rgba(160,18,61,.35); color:#a0123d;">
            Sil
          </button>
        </div>
      </div>
    </div>
  `).join("");

  const total = cartTotal(cart);
  totalEl.textContent = `${Math.round(total)} AZN`;

  $$("[data-remove]").forEach(b => b.onclick = () => removeFromCart(b.dataset.remove));
  $$("[data-plus]").forEach(b => b.onclick = () => changeQty(b.dataset.plus, +1));
  $$("[data-minus]").forEach(b => b.onclick = () => changeQty(b.dataset.minus, -1));
}

function cartWhatsAppText(){
  const cart = loadCart();
  if(cart.length === 0) return null;

  const lines = [];
  lines.push("Salam Garnet Parfum! Səbətdəki məhsulları sifariş etmək istəyirəm:");
  cart.forEach((i, idx) => {
    lines.push(`${idx+1}) ${i.brand} — ${i.name} | ${i.size}ml | ${i.delivery} | ${money(i.price)} x${i.qty}`);
  });

  const total = cartTotal(cart);
  lines.push(`Toplam: ${Math.round(total)} AZN`);
  lines.push("Ünvan: ");

  return encodeURIComponent(lines.join("\n"));
}

function checkoutCartToWhatsApp(){
  const txt = cartWhatsAppText();
  if(!txt){
    alert("Səbət boşdur 🙂");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${txt}`, "_blank");
}

// =========================
// Render catalog
// =========================
function render(){
  const q = (state.q || "").trim().toLowerCase();

  const list = PRODUCTS.filter(p => {
    const okGender = state.gender === "all" ? true : p.gender === state.gender;
    const okCat = state.cat === "all" ? true : p.cat === state.cat;

    const okQ = !q ? true : (
      `${p.brand} ${p.name}`.toLowerCase().includes(q) ||
      (p.notes || "").toLowerCase().includes(q) ||
      catLabel(p.cat).toLowerCase().includes(q) ||
      genderLabel(p.gender).toLowerCase().includes(q)
    );

    return okGender && okCat && okQ;
  });

  const grid = $("#grid");
  if(!grid) return;

  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="cTop">
        <img src="${p.img}" alt="${p.brand} ${p.name}" onerror="this.src='assets/placeholder.jpg';">
        <div class="priceBadge">${money(p.price20)} <span style="font-size:12px; opacity:.75;">(20ml)</span></div>
        <div class="catBadge">${catLabel(p.cat)}</div>
      </div>

      <div class="cBody">
        <div class="cName">${p.brand} — ${p.name}</div>
        <div class="cNotes">${p.notes || ""}</div>

        <div class="cBtns">
          <button class="sbtn primary" data-open="${p.id}">Sifariş et</button>
        </div>
      </div>
    </div>
  `).join("");

  $$("[data-open]").forEach(b => b.onclick = () => openModal(b.dataset.open));
}

// =========================
// Modal open/close + WhatsApp
// =========================
function openModal(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;

  current = p;

  $("#mImg") && ($("#mImg").src = p.img);
  $("#mName") && ($("#mName").textContent = `${p.brand} — ${p.name}`);
  $("#mNotes") && ($("#mNotes").textContent = p.notes || "");
  $("#mDesc") && ($("#mDesc").textContent = p.desc || "");
  $("#mCat") && ($("#mCat").textContent = catLabel(p.cat));
  $("#mPrice") && ($("#mPrice").textContent = money(p.price20));

  resetModalSelections();

  // ✅ modal düymə adları
  if($("#mOrder")) $("#mOrder").textContent = "İndi sifariş et";
  if($("#mCopy")) $("#mCopy").textContent = "Səbətə əlavə et";

  // ✅ sarı yazı
  const mCopy = $("#mCopy");
  if(mCopy) mCopy.style.color = "#FFD700";

  $("#modalBack") && $("#modalBack").classList.add("show");
  bindModalOptionHandlers();
}

function closeModal(){
  $("#modalBack") && $("#modalBack").classList.remove("show");
}

function waText(p, sizeMl, delivery, finalPrice){
  const msg =
    `Salam Garnet Parfum! Sifariş etmək istəyirəm:\n` +
    `• Məhsul: ${p.brand} — ${p.name}\n` +
    `• Cins: ${genderLabel(p.gender)}\n` +
    `• Növ: ${catLabel(p.cat)}\n` +
    `• Həcm: ${sizeMl}ml\n` +
    `• Çatdırılma: ${delivery}\n` +
    `• Qiymət: ${money(finalPrice)}\n` +
    `• Ünvan: `;
  return encodeURIComponent(msg);
}
function openWA(p, sizeMl, delivery, finalPrice){
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${waText(p, sizeMl, delivery, finalPrice)}`, "_blank");
}

// =========================
// DOMContentLoaded binds
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // WhatsApp buttons
  $("#btnWhatsAppTop") && ($("#btnWhatsAppTop").onclick = openWAHello);
  $("#btnWhatsApp") && ($("#btnWhatsApp").onclick = openWAHello);

  // Scroll to catalog
  const goCatalog = () => $("#catalog")?.scrollIntoView({behavior:"smooth"});
  $("#btnToCatalog") && ($("#btnToCatalog").onclick = goCatalog);
  $("#btnToCatalog2") && ($("#btnToCatalog2").onclick = goCatalog);

  // Gender selector
  $$("#genderPick .gbtn").forEach(btn => {
    btn.onclick = () => {
      $$("#genderPick .gbtn").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.gender = btn.dataset.gender;
      render();
      goCatalog();
    };
  });

  // Category chips
  $$("#chips .chip").forEach(ch => {
    ch.onclick = () => {
      $$("#chips .chip").forEach(x => x.classList.remove("active"));
      ch.classList.add("active");
      state.cat = ch.dataset.cat;
      render();
    };
  });

  // Search
  $("#search")?.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    render();
  });

  // Modal close
  $("#x") && ($("#x").onclick = closeModal);
  $("#modalBack")?.addEventListener("click", (e) => {
    if(e.target.id === "modalBack") closeModal();
  });

  // ✅ Modal: İndi sifariş et
  $("#mOrder") && ($("#mOrder").onclick = () => {
    if(!current) return;
    if(!requireSelectionsOrWarn()) return;
    const finalPrice = priceBySize(current.price20, pick.size);
    openWA(current, pick.size, pick.delivery, finalPrice);
  });

  // ✅ Modal: Səbətə əlavə et (limitsiz)
  $("#mCopy") && ($("#mCopy").onclick = () => {
    if(!current) return;
    if(!requireSelectionsOrWarn()) return;

    addToCart(current, pick.size, pick.delivery);

    const btn = $("#mCopy");
    if(btn){
      const old = btn.textContent;
      btn.textContent = "Əlavə olundu ✅";
      setTimeout(() => btn.textContent = old, 900);
    }
  });

  // ✅ Cart open/close
  $("#btnCart") && ($("#btnCart").onclick = openCart);
  $("#cartX") && ($("#cartX").onclick = closeCart);
  $("#cartBack")?.addEventListener("click", (e) => {
    if(e.target.id === "cartBack") closeCart();
  });

  // ✅ Cart actions
  $("#cartClear") && ($("#cartClear").onclick = () => {
    clearCart();
    alert("Səbət təmizləndi ✅");
  });
  $("#cartCheckout") && ($("#cartCheckout").onclick = checkoutCartToWhatsApp);

  // init
  setCartCountUI();
  render();
});