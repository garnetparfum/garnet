// =========================
// Garnet Parfum - app.js (FINAL)
// Profil qeydiyyatı silinib, digər funksiyalar aktivdir.
// =========================

const WHATSAPP_PHONE = "994517238896";
let appliedPromo = null; 

// ✅ Metro qiymət siyahısı
const METRO_PRICES = {
  "Koroğlu": 3, "Ulduz": 3, "Nəriman Nərimanov": 3, "Gənclik": 3, "28 May": 3, "Nizami": 3, 
  "Elmlər Akademiyası": 3, "İnşaatçılar": 3, "20 Yanvar": 3, "Memar Əcəmi": 3, "Nəsimi": 3, "Azadlıq Prospekti": 3,
  "Qara Qarayev": 4, "Nefçilər": 4, "Xalqlar Dostluğu": 4, "Sahil": 4, "İçərişəhər": 4,
  "Əhmədli": 5, "Həzi Aslanov": 5, "Xətai": 5, "Avtovağzal": 5, "Bakmil": 5, "8 Noyabr": 5, "Xocəsən": 5, "Dərnəgül": 5
};

// ✅ Qiymətlər tam AZN
function priceBySize(base20, sizeMl){
  const s = Number(sizeMl);
  if (s === 20) return Math.round(base20);
  if (s === 30) return Math.round(base20 * 1.25);
  if (s === 50) return Math.round(base20 * 1.90);
  return Math.round(base20);
}

const PRODUCTS = [
  // ==========================================
  // SWEET (Şirin, Gourmand, Meyvəli-Şirin)
  // ==========================================
  { id:"m_9pm", brand:"Afnan", name:"9PM", gender:"male", cat:"sweet", price20:18, notes:"Vanil • Tonka • Şirin", desc:"", img:"assets/m_afnan_9pm.jpg" },
  { id:"m_dalal", brand:"Al-Rehab", name:"Dalal", gender:"male", cat:"sweet", price20:15, notes:"Karamel • Vanil • Şirin", desc:"", img:"assets/m_alrehab_dalal.jpg" },
  { id:"m_armani_stronger_with_you", brand:"Giorgio Armani", name:"Stronger With You", gender:"male", cat:"sweet", price20:20, notes:"Şirin • Tonka • Qalıcı", desc:"", img:"assets/m_armani_stronger_with_you.jpg" },
  { id:"m_lacoste_red", brand:"Lacoste", name:"Red", gender:"male", cat:"sweet", price20:15, notes:"Meyvəli • Şirin • Gündəlik", desc:"", img:"assets/m_lacoste_red.jpg" },
  { id:"m_versace_eros", brand:"Versace", name:"Eros", gender:"male", cat:"sweet", price20:15, notes:"Vanil • Şirin • Cazibə", desc:"", img:"assets/m_versace_eros.jpg" },
  { id:"u_baccarat_rouge_540", brand:"Baccarat", name:"Rouge 540", gender:"unisex", cat:"sweet", price20:25, notes:"Amber • Şirin • Zərif", desc:"", img:"assets/u_baccarat_rouge_540.jpg" },
  { id:"u_bond_no_9_signature", brand:"Bond No. 9", name:"Signature", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Zərif • Premium", desc:"", img:"assets/u_bond_no_9_signature.jpg" },
  { id:"u_bond_no_9_lafayette_street", brand:"Bond No. 9", name:"Lafayette Street", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Fresh • Qalıcı", desc:"", img:"assets/u_bond_no_9_lafayette_street.jpg" },
  { id:"u_sospiro_erba_pura", brand:"Sospiro", name:"Erba Pura", gender:"unisex", cat:"sweet", price20:15, notes:"Meyvəli • Şirin • Populyar", desc:"", img:"assets/u_sospiro_erba_pura.jpg" },
  { id:"u_tom_ford_bitter_peach", brand:"Tom Ford", name:"Bitter Peach", gender:"unisex", cat:"sweet", price20:25, notes:"Şaftalı • Şirin • Qalıcı", desc:"", img:"assets/u_tom_ford_bitter_peach.jpg" },
  { id:"u_tom_ford_vanille_sex", brand:"Tom Ford", name:"Vanille Sex", gender:"unisex", cat:"sweet", price20:25, notes:"Vanil • Şirin • Premium", desc:"", img:"assets/u_tom_ford_vanille_sex.jpg" },
  { id:"u_xerjoff_gran_ballo", brand:"Xerjoff", name:"Gran Ballo", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Zərif • Çiçək", desc:"", img:"assets/u_xerjoff_gran_ballo.jpg" },
  { id:"u_xerjoff_naxos", brand:"Xerjoff", name:"Naxos", gender:"unisex", cat:"sweet", price20:25, notes:"Bal • Tütün • Qalıcı", desc:"", img:"assets/u_xerjoff_naxos.jpg" },
  { id:"u_ysl_libre_intense", brand:"YSL", name:"Libre Intense", gender:"unisex", cat:"sweet", price20:18, notes:"Lavanda • Şirin • Qalıcı", desc:"", img:"assets/u_ysl_libre_intense.jpg" },
  { id:"f_coco_mademoiselle", brand:"Chanel", name:"Coco Mademoiselle", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Çiçək • Zərif", desc:"", img:"assets/f_chanel_coco_mademoiselle.jpg" },
  { id:"f_armani_si", brand:"Giorgio Armani", name:"Sì", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Qalıcı • Zərif", desc:"", img:"assets/f_armani_si.jpg" },
  { id:"f_ysl_libre", brand:"YSL", name:"Libre", gender:"female", cat:"sweet", price20:20, notes:"Lavanda • Şirin • Qalıcı", desc:"", img:"assets/f_ysl_libre.jpg" },
  { id:"f_black_opium", brand:"YSL", name:"Black Opium", gender:"female", cat:"sweet", price20:15, notes:"Qəhvə • Şirin • Gecə", desc:"", img:"assets/f_ysl_black_opium.jpg" },
  { id:"f_good_girl", brand:"Carolina Herrera", name:"Good Girl", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Dərin • Populyar", desc:"", img:"assets/f_ch_good_girl.jpg" },
  { id:"f_burberry_her", brand:"Burberry", name:"Her", gender:"female", cat:"sweet", price20:25, notes:"Meyvəli • Şirin • Gourmand", desc:"", img:"assets/f_burberry_her.jpg" },
  { id:"f_burberry_goddess", brand:"Burberry", name:"Goddess", gender:"female", cat:"sweet", price20:25, notes:"Vanil • Şirin • Qalıcı", desc:"", img:"assets/f_burberry_goddess.jpg" },
  { id:"f_cartier_la_panthere", brand:"Cartier", name:"La Panthère", gender:"female", cat:"sweet", price20:25, notes:"Çiçək • Şirin • Premium", desc:"", img:"assets/f_cartier_la_panthere.jpg" },
  { id:"f_mancera_roses_vanille", brand:"Mancera", name:"Roses Vanille", gender:"female", cat:"sweet", price20:20, notes:"Gül • Vanil • Şirin", desc:"", img:"assets/f_mancera_roses_vanille.jpg" },
  { id:"f_montale_vanilla_cake", brand:"Montale", name:"Vanilla Cake", gender:"female", cat:"sweet", price20:20, notes:"Vanil • Şirin • Gourmand", desc:"", img:"assets/f_montale_vanilla_cake.jpg" },
  { id:"f_montale_chocolate_greedy", brand:"Montale", name:"Chocolate Greedy", gender:"female", cat:"sweet", price20:15, notes:"Şokolad • Şirin • Gourmand", desc:"", img:"assets/f_montale_chocolate_greedy.jpg" },
  { id:"f_montale_intense_cafe", brand:"Montale", name:"Intense Café", gender:"female", cat:"sweet", price20:18, notes:"Qəhvə • Vanil • Şirin", desc:"", img:"assets/f_montale_intense_cafe.jpg" },
  { id:"f_moschino_toy2_bubble_gum", brand:"Moschino", name:"Toy 2 Bubble Gum", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Gənc", desc:"", img:"assets/f_moschino_toy2_bubble_gum.jpg" },
  { id:"f_prada_candy", brand:"Prada", name:"Candy", gender:"female", cat:"sweet", price20:15, notes:"Karamel • Şirin • Gourmand", desc:"", img:"assets/f_prada_candy.jpg" },
  { id:"f_tiziana_terenzi_kirke", brand:"Tiziana Terenzi", name:"Kirke", gender:"female", cat:"sweet", price20:25, notes:"Meyvəli • Şirin • Qalıcı", desc:"", img:"assets/f_tiziana_kirke.jpg" },
  { id:"f_tom_ford_lost_cherry", brand:"Tom Ford", name:"Lost Cherry", gender:"female", cat:"sweet", price20:25, notes:"Albalı • Şirin • Premium", desc:"", img:"assets/f_tom_ford_lost_cherry.jpg" },
  { id:"f_xerjoff_lira", brand:"Xerjoff", name:"Casamorati Lira", gender:"female", cat:"sweet", price20:20, notes:"Vanil • Şirin • Gourmand", desc:"", img:"assets/f_xerjoff_lira.jpg" },

  // ==========================================
  // DARK (Ağır, Oud, Baharatlı, Şərq qoxuları)
  // ==========================================
  { id:"m_bvlgari_gyan", brand:"Bvlgari", name:"Gyan", gender:"male", cat:"dark", price20:20, notes:"Ədviyyat • Tünd • Dərin", desc:"", img:"assets/m_bvlgari_gyan.jpg" },
  { id:"m_bvlgari_le_gemme_empyr", brand:"Bvlgari", name:"Le Gemme Empyr", gender:"male", cat:"dark", price20:20, notes:"Odunsu • Tünd • Premium", desc:"", img:"assets/m_bvlgari_le_gemme_empyr.jpg" },
  { id:"m_bvlgari_the_noir", brand:"Bvlgari", name:"The Noir", gender:"male", cat:"dark", price20:20, notes:"Çay • Tünd • Zərif", desc:"", img:"assets/m_bvlgari_the_noir.jpg" },
  { id:"m_montale_black_aoud", brand:"Montale", name:"Black Aoud", gender:"male", cat:"dark", price20:25, notes:"Oud • Tünd • Qalıcı", desc:"", img:"assets/m_montale_black_aoud.jpg" },
  { id:"u_amber_wood", brand:"Ajmal", name:"Amber Wood", gender:"unisex", cat:"dark", price20:22, notes:"Amber • Tünd • Dərin", desc:"", img:"assets/u_ajmal_amber_wood.jpg" },
  { id:"u_memo_paris_african_leather", brand:"Memo Paris", name:"African Leather", gender:"unisex", cat:"dark", price20:25, notes:"Dəri • Ədviyyat • Tünd", desc:"", img:"assets/u_memo_paris_african_leather.jpg" },
  { id:"u_nasomatto_black_afgano", brand:"Nasomatto", name:"Black Afgano", gender:"unisex", cat:"dark", price20:25, notes:"Tünd • Dərin • Qalıcı", desc:"", img:"assets/u_nasomatto_black_afgano.jpg" },
  { id:"f_hypnotic_poison", brand:"Dior", name:"Hypnotic Poison", gender:"female", cat:"dark", price20:15, notes:"Ağır Vanil • Şərqi • Dərin", desc:"", img:"assets/f_dior_hypnotic_poison.jpg" },
  { id:"f_mugler_alien", brand:"Mugler", name:"Alien", gender:"female", cat:"dark", price20:15, notes:"Yasəmən • Güclü • Qalıcı", desc:"", img:"assets/f_mugler_alien.jpg" },
  { id:"f_tom_ford_black_orchid", brand:"Tom Ford", name:"Black Orchid", gender:"female", cat:"dark", price20:18, notes:"Tünd • Çiçək • Dərin", desc:"", img:"assets/f_tom_ford_black_orchid.jpg" },

  // ==========================================
  // FRESH (Dəniz, Sitrus, Sabunsu, Sərin)
  // ==========================================
  { id:"m_bleu_de_chanel", brand:"Chanel", name:"Bleu de Chanel", gender:"male", cat:"fresh", price20:17, notes:"Sitrus • Fresh • Təmiz", desc:"", img:"assets/m_chanel_bleu_de_chanel.jpg" },
  { id:"m_antonio_blue", brand:"Antonio Banderas", name:"Blue", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Təmiz • Gündəlik", desc:"", img:"assets/m_antonio_banderas_blue.jpg" },
  { id:"m_azzaro_chrome", brand:"Azzaro", name:"Chrome", gender:"male", cat:"fresh", price20:15, notes:"Sərin • Təmiz • Fresh", desc:"", img:"assets/m_azzaro_chrome.jpg" },
  { id:"m_bvlgari_tygar", brand:"Bvlgari", name:"Tygar", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Parlaq", desc:"", img:"assets/m_bvlgari_tygar.jpg" },
  { id:"m_dior_sauvage", brand:"Dior", name:"Sauvage", gender:"male", cat:"fresh", price20:20, notes:"Fresh • Ədviyyat • Güclü", desc:"", img:"assets/m_dior_sauvage.jpg" },
  { id:"m_ch_212_men", brand:"Carolina Herrera", name:"212 Men", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Yaşıl • Təmiz", desc:"", img:"assets/m_ch_212_men.jpg" },
  { id:"m_chanel_allure_homme_sport", brand:"Chanel", name:"Allure Homme Sport", gender:"male", cat:"fresh", price20:18, notes:"Sitrus • Fresh • Sport", desc:"", img:"assets/m_chanel_allure_homme_sport.jpg" },
  { id:"m_clinique_happy_men", brand:"Clinique", name:"Happy for Men", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Şən", desc:"", img:"assets/m_clinique_happy_men.jpg" },
  { id:"m_creed_aventus", brand:"Creed", name:"Aventus", gender:"male", cat:"fresh", price20:20, notes:"Ananas • Fresh • Qalıcı", desc:"", img:"assets/m_creed_aventus.jpg" },
  { id:"m_dunhill_desire_blue", brand:"Dunhill", name:"Desire Blue", gender:"male", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/m_dunhill_desire_blue.jpg" },
  { id:"m_armani_acqua_di_gio", brand:"Giorgio Armani", name:"Acqua di Giò", gender:"male", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Klassik", desc:"", img:"assets/m_armani_acqua_di_gio.jpg" },
  { id:"m_hugo_boss_hugo", brand:"Hugo Boss", name:"Hugo", gender:"male", cat:"fresh", price20:15, notes:"Yaşıl • Fresh • Gündəlik", desc:"", img:"assets/m_hugo_boss_hugo.jpg" },
  { id:"m_lacoste_essential", brand:"Lacoste", name:"Essential", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Təmiz • Rahat", desc:"", img:"assets/m_lacoste_essential.jpg" },
  { id:"m_louis_vuitton_limmensite", brand:"Louis Vuitton", name:"L’Immensité", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Premium", desc:"", img:"assets/m_louis_vuitton_limmensite.jpg" },
  { id:"m_paco_rabanne_invictus", brand:"Paco Rabanne", name:"Invictus", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Dəniz • Enerji", desc:"", img:"assets/m_paco_rabanne_invictus.jpg" },
  { id:"u_tribute_blue", brand:"Afnan", name:"Tribute Blue", gender:"unisex", cat:"fresh", price20:25, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/u_afnan_tribute_blue.jpg" },
  { id:"u_davidoff_cool_water", brand:"Davidoff", name:"Cool Water", gender:"unisex", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/u_davidoff_cool_water.jpg" },
  { id:"u_escentric_molecules_02", brand:"Escentric Molecules", name:"Molecule 02", gender:"unisex", cat:"fresh", price20:25, notes:"Fresh • Ambroxan • Təmiz", desc:"", img:"assets/u_escentric_molecules_02.jpg" },
  { id:"u_escentric_molecules_05", brand:"Escentric Molecules", name:"Molecule 05", gender:"unisex", cat:"fresh", price20:25, notes:"Fresh • Kaşmiran • Təmiz", desc:"", img:"assets/u_escentric_molecules_05.jpg" },
  { id:"u_yves_rocher_evidence", brand:"Yves Rocher", name:"Evidence", gender:"unisex", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Təmiz", desc:"", img:"assets/u_yves_rocher_evidence.jpg" },
  { id:"f_chanel_chance", brand:"Chanel", name:"Chance", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_chanel_chance.jpg" },
  { id:"f_chanel_fresh", brand:"Chanel", name:"Fresh", gender:"female", cat:"fresh", price20:15, notes:"Təmiz • Fresh • Gündəlik", desc:"", img:"assets/f_chanel_fresh.jpg" },
  { id:"f_dg_limperatrice", brand:"Dolce & Gabbana", name:"L’Imperatrice", gender:"female", cat:"fresh", price20:15, notes:"Meyvəli • Fresh • Yüngül", desc:"", img:"assets/f_dg_limperatrice.jpg" },
  { id:"f_dg_light_blue", brand:"Dolce & Gabbana", name:"Light Blue", gender:"female", cat:"fresh", price20:15, notes:"Sitrus • Fresh • Yay", desc:"", img:"assets/f_dg_light_blue.jpg" },
  { id:"f_elizabeth_arden_white_tea", brand:"Elizabeth Arden", name:"White Tea", gender:"female", cat:"fresh", price20:15, notes:"Çay • Fresh • Təmiz", desc:"", img:"assets/f_elizabeth_arden_white_tea.jpg" },
  { id:"f_elizabeth_arden_green_tea", brand:"Elizabeth Arden", name:"Green Tea", gender:"female", cat:"fresh", price20:18, notes:"Çay • Fresh • Sitrus", desc:"", img:"assets/f_elizabeth_arden_green_tea.jpg" },
  { id:"f_armani_acqua_di_gioia", brand:"Giorgio Armani", name:"Acqua di Gioia", gender:"female", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/f_armani_acqua_di_gioia.jpg" },
  { id:"f_miss_dior_blooming_bouquet", brand:"Dior", name:"Miss Dior Blooming Bouquet", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_miss_dior_blooming_bouquet.jpg" },
  { id:"f_versace_bright_crystal", brand:"Versace", name:"Bright Crystal", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_versace_bright_crystal.jpg" },
  { id:"f_victorias_secret_bombshell", brand:"Victoria’s Secret", name:"Bombshell", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Meyvəli • Parlaq", desc:"", img:"assets/f_vs_bombshell.jpg" },

  // ==========================================
  // WOODY (Odunsu, Vetiver, Sandal, Meşə)
  // ==========================================
  { id:"m_burberry_men", brand:"Burberry", name:"Burberry Men", gender:"male", cat:"woody", price20:15, notes:"Odunsu • Ədviyyat • Klassik", desc:"", img:"assets/m_burberry_men.jpg" },
  { id:"m_ch_men", brand:"Carolina Herrera", name:"CH Men", gender:"male", cat:"woody", price20:15, notes:"Dəri • Odunsu • Dərin", desc:"", img:"assets/m_ch_ch_men.jpg" },
  { id:"u_escentric_molecules_01", brand:"Escentric Molecules", name:"Molecule 01", gender:"unisex", cat:"woody", price20:25, notes:"Odunsu • Minimal • Iso E", desc:"", img:"assets/u_escentric_molecules_01.jpg" },
  { id:"u_escentric_molecules_03", brand:"Escentric Molecules", name:"Molecule 03", gender:"unisex", cat:"woody", price20:25, notes:"Vetiver • Odunsu • Təmiz", desc:"", img:"assets/u_escentric_molecules_03.jpg" },
  { id:"u_escentric_molecules_04", brand:"Escentric Molecules", name:"Molecule 04", gender:"unisex", cat:"woody", price20:25, notes:"Sandal • Odunsu • Yumşaq", desc:"", img:"assets/u_escentric_molecules_04.jpg" },
  { id:"f_chloe_nomade", brand:"Chloé", name:"Nomade", gender:"female", cat:"woody", price20:15, notes:"Odunsu • Çiçək • Dərin", desc:"", img:"assets/f_chloe_nomade.jpg" },

  // ==========================================
  // MEDIUM (Balanslı, Klassik)
  // ==========================================
  { id:"m_egoiste", brand:"Chanel", name:"Égoïste", gender:"male", cat:"medium", price20:15, notes:"Odunsu • Ədviyyat • Qalıcı", desc:"", img:"assets/m_chanel_egoiste.jpg" },
  { id:"m_terre_dhermes", brand:"Hermès", name:"Terre d’Hermès", gender:"male", cat:"medium", price20:15, notes:"Sitrus • Odunsu • Mineral", desc:"", img:"assets/m_hermes_terre_dhermes.jpg" },
  { id:"m_bvlgari_man", brand:"Bvlgari", name:"Man", gender:"male", cat:"medium", price20:20, notes:"Odunsu • Ədviyyat • Klassik", desc:"", img:"assets/m_bvlgari_man.jpg" },
  { id:"m_dior_homme", brand:"Dior", name:"Dior Homme", gender:"male", cat:"medium", price20:18, notes:"Odunsu • Zərif • Təmiz", desc:"", img:"assets/m_dior_dior_homme.jpg" },
  { id:"m_givenchy_gentleman", brand:"Givenchy", name:"Gentleman", gender:"male", cat:"medium", price20:18, notes:"Odunsu • Zərif • Qalıcı", desc:"", img:"assets/m_givenchy_gentleman.jpg" },
  { id:"m_orto_parisi_megamare", brand:"Orto Parisi", name:"Megamare", gender:"male", cat:"medium", price20:35, notes:"Dəniz • Güclü • Qalıcı", desc:"", img:"assets/m_orto_parisi_megamare.jpg" },
  { id:"u_ex_nihilo_fleur_narcotique", brand:"Ex Nihilo", name:"Fleur Narcotique", gender:"unisex", cat:"medium", price20:18, notes:"Çiçək • Fresh • Meyvəli", desc:"", img:"assets/u_ex_nihilo_fleur_narcotique.jpg" },
  { id:"u_nejma_7", brand:"Nejma", name:"Nejma 7", gender:"unisex", cat:"medium", price20:20, notes:"Şərqi • Tünd • Premium", desc:"", img:"assets/u_nejma_7.jpg" },
  { id:"f_chanel_gabrielle", brand:"Chanel", name:"Gabrielle", gender:"female", cat:"medium", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_chanel_gabrielle.jpg" },
  { id:"f_armani_my_way", brand:"Giorgio Armani", name:"My Way", gender:"female", cat:"medium", price20:22, notes:"Çiçək • Fresh • Modern", desc:"", img:"assets/f_armani_my_way.jpg" },
  { id:"f_narciso_poudree", brand:"Narciso Rodriguez", name:"Poudrée", gender:"female", cat:"medium", price20:20, notes:"Pudra • Musk • Yumşaq", desc:"", img:"assets/f_narciso_poudree.jpg" },
  { id:"f_narciso_for_her_pink", brand:"Narciso Rodriguez", name:"For Her (Pink)", gender:"female", cat:"medium", price20:15, notes:"Musk • Şirin • Zərif", desc:"", img:"assets/f_narciso_for_her_pink.jpg" },
  { id:"f_valentino_donna", brand:"Valentino", name:"Valentino Donna", gender:"female", cat:"medium", price20:18, notes:"Şirin • Zərif • Qalıcı", desc:"", img:"assets/f_valentino_donna.jpg" }
];

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ✅ HESABLAMA MƏNTİQİ (Promo & Bundle)
function calculateFinalTotal(cart) {
  let subtotal = cart.reduce((s, i) => s + (Number(i.price) || 0) * (i.qty || 0), 0);
  let totalQty = cart.reduce((s, i) => s + (i.qty || 0), 0);
  let msg = "";
  
  // Metro pulunu hesabla
  let metroTotal = cart.reduce((s, i) => s + (METRO_PRICES[i.metro] || 0) * i.qty, 0);
  subtotal += metroTotal;

  if (totalQty >= 2) { subtotal *= 0.9; msg = "🎁 2+ ətir: 10% Bundle endirimi tətbiq edildi!"; }
  if (appliedPromo === "GARNET10") subtotal *= 0.9;
  else if (appliedPromo === "YAY20") subtotal *= 0.8;

  return { total: Math.round(subtotal), msg: msg, deliveryCost: metroTotal };
}

// ✅ SİFARİŞ TARİXÇƏSİ
const HISTORY_KEY = "garnet_history_v1";
function saveToHistory(cart, total) {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const order = { date: new Date().toLocaleString('az-AZ'), total: total, items: cart.map(i => `${i.brand} ${i.name}`).join(", ") };
  history.unshift(order);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  const wrap = $("#historyItems");
  if (!wrap) return;
  if (history.length === 0) { wrap.innerHTML = "<p style='font-size:12px; color:#999; padding:10px;'>Sifarişiniz yoxdur.</p>"; return; }
  wrap.innerHTML = history.map(h => `<div style="padding:10px; border-bottom:1px solid #eee; font-size:12px;"><b>${h.date}</b> — <span style="color:#a0123d;">${h.total} AZN</span><br><span style="color:#666;">${h.items}</span></div>`).join("");
}

function getProducts() {
  const seen = new Set();
  return PRODUCTS.filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); return true; });
}

let state = { gender: "all", cat: "all", q: "" };
let current = null;
let pick = { size: null, delivery: null, metro: null };

function money(v) { return `${Math.round(Number(v) || 0)} AZN`; }
function oldPrice(price) { return Math.round(price * 1.7); }
function genderLabel(g) { return g === "male" ? "Kişi" : (g === "female" ? "Qadın" : "Unisex"); }
function catLabel(cat) { return { sweet: "Şirin", medium: "Orta", dark: "Tünd", fresh: "Sərin", woody: "Odunsu" }[cat] || "Ətir"; }

/* =========================
   RANDOM LIVE VIEWERS
========================= */
function getLiveViewMap(products) {
  const map = {};
  if (!products.length) return map;
  const showCount = Math.max(2, Math.floor(products.length * 0.18));
  const selected = [...products].sort(() => Math.random() - 0.5).slice(0, showCount);
  selected.forEach((p) => { map[p.id] = Math.floor(Math.random() * 3) + 1; });
  return map;
}

/* CART LOGIC */
const CART_KEY = "garnet_cart_v2";
function loadCart() { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCountUI(); }
function updateCartCountUI() { $("#cartCount").textContent = `(${loadCart().reduce((s,i)=>s+i.qty, 0)})`; }

function renderCart() {
  const cart = loadCart();
  const wrap = $("#cartItems");
  if (!wrap) return;
  if (cart.length === 0) { wrap.innerHTML = "Səbət boşdur."; $("#cartTotal").textContent = "0 AZN"; $("#bundleInfo").textContent = ""; return; }
  wrap.innerHTML = cart.map(i => `
    <div style="display:flex; gap:10px; align-items:center; padding:10px; border-bottom:1px solid #eee;">
      <img src="${i.img}" style="width:45px; height:45px; border-radius:8px; object-fit:cover;">
      <div style="flex:1; font-size:12px;"><b>${i.brand}</b><br>${i.size}ml • ${money(i.price)}${i.metro ? `<br><small style="color:var(--wine2)">Metro: ${i.metro} (+${METRO_PRICES[i.metro]} AZN)</small>` : ''}</div>
      <div style="display:flex; gap:5px;"><button class="btn ghost" style="padding:2px 8px;" onclick="updateQty('${i.key}', -1)">-</button><span>${i.qty}</span><button class="btn ghost" style="padding:2px 8px;" onclick="updateQty('${i.key}', 1)">+</button></div>
    </div>`).join("");
  const res = calculateFinalTotal(cart);
  $("#cartTotal").textContent = money(res.total);
  $("#bundleInfo").textContent = res.msg;
}

window.updateQty = (key, delta) => {
  let cart = loadCart();
  const it = cart.find(i => i.key === key);
  if (it) { it.qty += delta; if (it.qty <= 0) cart = cart.filter(i => i.key !== key); saveCart(cart); renderCart(); }
};

/* CATALOG */
function render() {
  const q = state.q.toLowerCase();
  const list = getProducts().filter(p => (state.gender === "all" || p.gender === state.gender) && (state.cat === "all" || p.cat === state.cat) && (!q || `${p.brand} ${p.name}`.toLowerCase().includes(q)));
  const liveViewMap = getLiveViewMap(list);
  $("#grid").innerHTML = list.map(p => `
    <div class="card">
      <div class="cTop">
        <img src="${p.img}" onerror="this.src='assets/placeholder.jpg';">
        <div class="priceBadge"><span class="oldPrice">${money(oldPrice(p.price20))}</span><span class="newPrice">${money(p.price20)}</span></div>
        <div class="catBadge">${catLabel(p.cat)}</div>
      </div>
      <div class="cBody">
        <div class="cName">${p.brand} — ${p.name}</div>
        <div class="cNotes">${p.notes}</div>
        ${liveViewMap[p.id] ? `<div class="liveView">👀 Hazırda ${liveViewMap[p.id]} nəfər baxır</div>` : ""}
        <button class="sbtn primary" onclick="openModal('${p.id}')">Sifariş et</button>
      </div>
    </div>`).join("");
}

window.openModal = (id) => {
  current = getProducts().find(x => x.id === id);
  $("#mImg").src = current.img; $("#mName").textContent = current.brand + " — " + current.name; $("#mNotes").textContent = current.notes;
  $("#mPrice").textContent = money(current.price20);
  pick = { size: null, delivery: null, metro: null };
  $$(".optBtn").forEach(b => b.classList.remove("active"));
  $("#mDeliveryWrap").classList.add("hidden"); $("#metroSelectWrap").classList.add("hidden");
  $("#modalBack").classList.add("show"); document.body.style.overflow="hidden";
};

function closeModal() { $("#modalBack").classList.remove("show"); document.body.style.overflow="auto"; }

const fakeOrders = ["Na*** Afnan 9PM sifariş etdi", "El*** Bleu de Chanel sifariş etdi", "Ka*** Dior Sauvage sifariş etdi", "Ra*** Baccarat Rouge sifariş etdi"];
function showOrderPopup() {
  const popup = $("#orderPopup"); if (!popup) return;
  popup.innerHTML = `💬 ${fakeOrders[Math.floor(Math.random() * fakeOrders.length)]}<br><small>bir neçə saniyə əvvəl</small>`;
  popup.style.display = "block"; setTimeout(() => { popup.style.display = "none"; }, 4000);
}

/* DOM READY */
document.addEventListener("DOMContentLoaded", () => {
  render(); updateCartCountUI();

  // ✅ PRELOADER
  const hidePreloader = () => {
    const loader = document.getElementById("preloader");
    if (loader && !loader.classList.contains("fade-out")) loader.classList.add("fade-out");
  };
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 3000); 

  $("#search").oninput = e => { state.q = e.target.value; render(); };
  $$(".gbtn").forEach(b => b.onclick = () => { $$(".gbtn").forEach(x=>x.classList.remove("active")); b.classList.add("active"); state.gender=b.dataset.gender; render(); });
  $$(".chip").forEach(b => b.onclick = () => { $$(".chip").forEach(x=>x.classList.remove("active")); b.classList.add("active"); state.cat=b.dataset.cat; render(); });

  $("#mSizes").onclick = e => {
    const b = e.target.closest(".optBtn"); if (!b) return;
    $$("#mSizes .optBtn").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    pick.size = b.dataset.size; $("#mPrice").textContent = money(priceBySize(current.price20, pick.size)); $("#mDeliveryWrap").classList.remove("hidden");
  };

  $("#mDelivery").onclick = e => {
    const b = e.target.closest(".optBtn"); if (!b) return;
    $$("#mDelivery .optBtn").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    pick.delivery = b.dataset.delivery;
    if(pick.delivery === "Metro") $("#metroSelectWrap").classList.remove("hidden");
    else { $("#metroSelectWrap").classList.add("hidden"); pick.metro = null; }
  };

  $("#mCopy").onclick = () => {
    if(!pick.size || !pick.delivery) return alert("Həcm və Çatdırılma seçin.");
    if(pick.delivery === "Metro" && !$("#metroStation").value) return alert("Zəhmət olmasa metronu seçin.");
    let cart = loadCart();
    const metro = pick.delivery === "Metro" ? $("#metroStation").value : null;
    const key = `${current.id}_${pick.size}_${pick.delivery}_${metro}`;
    const found = cart.find(i => i.key === key);
    if (found) found.qty++;
    else cart.push({ key, id: current.id, brand: current.brand, name: current.name, img: current.img, size: pick.size, delivery: pick.delivery, metro: metro, price: priceBySize(current.price20, pick.size), qty: 1 });
    saveCart(cart); alert("Səbətə əlavə edildi!"); closeModal();
  };

  $("#btnCart").onclick = () => { $("#cartBack").classList.add("show"); renderCart(); };
  $("#cartX").onclick = () => $("#cartBack").classList.remove("show");
  $("#x").onclick = closeModal;

  $("#tabCart").onclick = () => { $("#cartSection").classList.remove("hidden"); $("#historySection").classList.add("hidden"); $("#tabCart").style.color="#a0123d"; $("#tabCart").style.borderBottom="2px solid #a0123d"; $("#tabHistory").style.color="#666"; $("#tabHistory").style.borderBottom="none"; };
  $("#tabHistory").onclick = () => { $("#cartContent").classList.add("hidden"); $("#historyContent").classList.remove("hidden"); $("#tabHistory").style.color="#a0123d"; $("#tabHistory").style.borderBottom="2px solid #a0123d"; $("#tabCart").style.color="#666"; $("#tabCart").style.borderBottom="none"; renderHistory(); };

  $("#promoBtn").onclick = () => {
    const v = $("#promoInput").value.toUpperCase().trim();
    if(["GARNET10", "YAY20"].includes(v)){ appliedPromo = v; alert("Promokod tətbiq edildi!"); renderCart(); } else alert("Yanlış kod.");
  };

  $("#cartCheckout").onclick = () => {
    const cart = loadCart(); if(cart.length===0) return;
    const res = calculateFinalTotal(cart);
    saveToHistory(cart, res.total);
    let txt = `Salam Garnet Parfum! Sifariş:\n` + cart.map(i=>`- ${i.brand} ${i.name} (${i.size}ml) ${i.metro ? `[Metro: ${i.metro} +${METRO_PRICES[i.metro]}AZN]` : ''}`).join("\n") + `\nCəmi (Çatdırılma daxil): ${res.total} AZN`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(txt)}`);
    saveCart([]); $("#cartBack").classList.remove("show");
  };
  
  $("#cartClear").onclick = () => { saveCart([]); renderCart(); alert("Səbət təmizləndi."); };
  showOrderPopup(); setInterval(showOrderPopup, 10000);
});