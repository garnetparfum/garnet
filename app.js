// =========================
// Garnet Parfum - app.js (CART FINAL - CLEAN)
// =========================

const WHATSAPP_PHONE = "994517238896"; // 0517238896

// ✅ 20ml baza qiymət → 30/50 avtomatik yuvarlaqlanır
function roundAzN(x){
  return Math.round(x * 2) / 2; // 0.5 AZN addımı
}
function priceBySize(base20, sizeMl){
  const s = Number(sizeMl);
  if (s === 20) return base20;
  if (s === 30) return roundAzN(base20 * 1.25);
  if (s === 50) return roundAzN(base20 * 1.90);
  return base20;
}

// =========================
// PRODUCTS (sənin listin)
// =========================
const PRODUCTS = [
  // =========================
  // KİŞİ (ƏVVƏLKİLƏR - SAXLANILDI)
  // =========================
  { id:"m_9pm", brand:"Afnan", name:"9PM", gender:"male", cat:"sweet", price20:18, notes:"Vanil • Tonka • Şirin", desc:"", img:"assets/m_afnan_9pm.jpg" },
  { id:"m_dalal", brand:"Al-Rehab", name:"Dalal", gender:"male", cat:"sweet", price20:15, notes:"Karamel • Vanil • Şirin", desc:"", img:"assets/m_alrehab_dalal.jpg" },
  { id:"m_bleu_de_chanel", brand:"Chanel", name:"Bleu de Chanel", gender:"male", cat:"fresh", price20:17, notes:"Sitrus • Fresh • Təmiz", desc:"", img:"assets/m_chanel_bleu_de_chanel.jpg" },
  { id:"m_burberry_men", brand:"Burberry", name:"Burberry Men", gender:"male", cat:"woody", price20:15, notes:"Odunsu • Ədviyyat • Klassik", desc:"", img:"assets/m_burberry_men.jpg" },
  { id:"m_egoiste", brand:"Chanel", name:"Égoïste", gender:"male", cat:"woody", price20:15, notes:"Odunsu • Ədviyyat • Qalıcı", desc:"", img:"assets/m_chanel_egoiste.jpg" },
  { id:"m_terre_dhermes", brand:"Hermès", name:"Terre d’Hermès", gender:"male", cat:"woody", price20:15, notes:"Sitrus • Odunsu • Mineral", desc:"", img:"assets/m_hermes_terre_dhermes.jpg" },
  { id:"m_antonio_blue", brand:"Antonio Banderas", name:"Blue", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Təmiz • Gündəlik", desc:"", img:"assets/m_antonio_banderas_blue.jpg" },
  { id:"m_azzaro_chrome", brand:"Azzaro", name:"Chrome", gender:"male", cat:"fresh", price20:15, notes:"Sərin • Təmiz • Fresh", desc:"", img:"assets/m_azzaro_chrome.jpg" },

  // =========================
  // UNISEX (ƏVVƏLKİLƏR - SAXLANILDI)
  // =========================
  { id:"u_tribute_blue", brand:"Afnan", name:"Tribute Blue", gender:"unisex", cat:"fresh", price20:25, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/u_afnan_tribute_blue.jpg" },
  { id:"u_amber_wood", brand:"Ajmal", name:"Amber Wood", gender:"unisex", cat:"dark", price20:22, notes:"Amber • Tünd • Dərin", desc:"", img:"assets/u_ajmal_amber_wood.jpg" },
  { id:"u_baccarat_rouge_540", brand:"Baccarat", name:"Rouge 540", gender:"unisex", cat:"sweet", price20:25, notes:"Amber • Şirin • Zərif", desc:"", img:"assets/u_baccarat_rouge_540.jpg" },

  // =========================
  // QADIN (ƏVVƏLKİLƏR - SAXLANILDI)
  // =========================
  { id:"f_chanel_chance", brand:"Chanel", name:"Chance", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_chanel_chance.jpg" },
  { id:"f_chanel_fresh", brand:"Chanel", name:"Fresh", gender:"female", cat:"fresh", price20:15, notes:"Təmiz • Fresh • Gündəlik", desc:"", img:"assets/f_chanel_fresh.jpg" },
  { id:"f_coco_mademoiselle", brand:"Chanel", name:"Coco Mademoiselle", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Çiçək • Zərif", desc:"", img:"assets/f_chanel_coco_mademoiselle.jpg" },
  { id:"f_armani_si", brand:"Giorgio Armani", name:"Sì", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Qalıcı • Zərif", desc:"", img:"assets/f_armani_si.jpg" },
  { id:"f_hypnotic_poison", brand:"Dior", name:"Hypnotic Poison", gender:"female", cat:"sweet", price20:15, notes:"Vanil • Şirin • Dərin", desc:"", img:"assets/f_dior_hypnotic_poison.jpg" },
  { id:"f_ysl_libre", brand:"YSL", name:"Libre", gender:"female", cat:"sweet", price20:20, notes:"Lavanda • Şirin • Qalıcı", desc:"", img:"assets/f_ysl_libre.jpg" },
  { id:"f_black_opium", brand:"YSL", name:"Black Opium", gender:"female", cat:"sweet", price20:15, notes:"Qəhvə • Şirin • Gecə", desc:"", img:"assets/f_ysl_black_opium.jpg" },
  { id:"f_good_girl", brand:"Carolina Herrera", name:"Good Girl", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Dərin • Populyar", desc:"", img:"assets/f_ch_good_girl.jpg" },
  { id:"f_her_golden_secret", brand:"Antonio Banderas", name:"Her Golden Secret", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Yumşaq • Zərif", desc:"", img:"assets/f_antonio_banderas_her_golden_secret.jpg" },
  { id:"f_burberry_her", brand:"Burberry", name:"Her", gender:"female", cat:"sweet", price20:25, notes:"Meyvəli • Şirin • Gourmand", desc:"", img:"assets/f_burberry_her.jpg" },
  { id:"f_my_burberry", brand:"Burberry", name:"My Burberry", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Klassik", desc:"", img:"assets/f_burberry_my_burberry.jpg" },

  // ============================================================
  // ============================================================
  // =========================
  // KİŞİ (YENİ KATALOQ)
  // =========================
  { id:"m_bvlgari_tygar", brand:"Bvlgari", name:"Tygar", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Parlaq", desc:"", img:"assets/m_bvlgari_tygar.jpg" },
  { id:"m_bvlgari_gyan", brand:"Bvlgari", name:"Gyan", gender:"male", cat:"dark", price20:20, notes:"Ədviyyat • Tünd • Dərin", desc:"", img:"assets/m_bvlgari_gyan.jpg" },
  { id:"m_bvlgari_le_gemme_empyr", brand:"Bvlgari", name:"Le Gemme Empyr", gender:"male", cat:"dark", price20:20, notes:"Odunsu • Tünd • Premium", desc:"", img:"assets/m_bvlgari_le_gemme_empyr.jpg" },
  { id:"m_bvlgari_the_noir", brand:"Bvlgari", name:"The Noir", gender:"male", cat:"dark", price20:20, notes:"Çay • Tünd • Zərif", desc:"", img:"assets/m_bvlgari_the_noir.jpg" },
  { id:"m_bvlgari_man", brand:"Bvlgari", name:"Man", gender:"male", cat:"woody", price20:20, notes:"Odunsu • Ədviyyat • Klassik", desc:"", img:"assets/m_bvlgari_man.jpg" },

  { id:"m_dior_homme", brand:"Dior", name:"Dior Homme", gender:"male", cat:"woody", price20:18, notes:"Odunsu • Zərif • Təmiz", desc:"", img:"assets/m_dior_dior_homme.jpg" },
  { id:"m_dior_sauvage", brand:"Dior", name:"Sauvage", gender:"male", cat:"fresh", price20:20, notes:"Fresh • Ədviyyat • Güclü", desc:"", img:"assets/m_dior_sauvage.jpg" },

  { id:"m_ch_212_men", brand:"Carolina Herrera", name:"212 Men", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Yaşıl • Təmiz", desc:"", img:"assets/m_ch_212_men.jpg" },
  { id:"m_ch_men", brand:"Carolina Herrera", name:"CH Men", gender:"male", cat:"woody", price20:15, notes:"Dəri • Odunsu • Dərin", desc:"", img:"assets/m_ch_ch_men.jpg" },
  { id:"m_ch_chic_for_men", brand:"Carolina Herrera", name:"CH Chic For Men", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Ədviyyat • Gündəlik", desc:"", img:"assets/m_ch_chic_for_men.jpg" },

  { id:"m_chanel_allure_homme_sport", brand:"Chanel", name:"Allure Homme Sport", gender:"male", cat:"fresh", price20:18, notes:"Sitrus • Fresh • Sport", desc:"", img:"assets/m_chanel_allure_homme_sport.jpg" },

  { id:"m_clinique_happy_men", brand:"Clinique", name:"Happy for Men", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Şən", desc:"", img:"assets/m_clinique_happy_men.jpg" },

  { id:"m_creed_aventus", brand:"Creed", name:"Aventus", gender:"male", cat:"fresh", price20:20, notes:"Ananas • Fresh • Qalıcı", desc:"", img:"assets/m_creed_aventus.jpg" },

  { id:"m_dunhill_desire_blue", brand:"Dunhill", name:"Desire Blue", gender:"male", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/m_dunhill_desire_blue.jpg" },

  { id:"m_armani_acqua_di_gio", brand:"Giorgio Armani", name:"Acqua di Giò", gender:"male", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Klassik", desc:"", img:"assets/m_armani_acqua_di_gio.jpg" },
  { id:"m_armani_stronger_with_you", brand:"Giorgio Armani", name:"Stronger With You", gender:"male", cat:"sweet", price20:20, notes:"Şirin • Tonka • Qalıcı", desc:"", img:"assets/m_armani_stronger_with_you.jpg" },

  { id:"m_givenchy_gentleman", brand:"Givenchy", name:"Gentleman", gender:"male", cat:"woody", price20:18, notes:"Odunsu • Zərif • Qalıcı", desc:"", img:"assets/m_givenchy_gentleman.jpg" },
  { id:"m_givenchy_gentleman_only", brand:"Givenchy", name:"Gentleman Only", gender:"male", cat:"woody", price20:20, notes:"Ədviyyat • Odunsu • Klassik", desc:"", img:"assets/m_givenchy_gentleman_only.jpg" },

  { id:"m_hugo_boss_hugo", brand:"Hugo Boss", name:"Hugo", gender:"male", cat:"fresh", price20:15, notes:"Yaşıl • Fresh • Gündəlik", desc:"", img:"assets/m_hugo_boss_hugo.jpg" },

  { id:"m_lacoste_essential", brand:"Lacoste", name:"Essential", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Təmiz • Rahat", desc:"", img:"assets/m_lacoste_essential.jpg" },
  { id:"m_lacoste_red", brand:"Lacoste", name:"Red", gender:"male", cat:"sweet", price20:15, notes:"Meyvəli • Şirin • Gündəlik", desc:"", img:"assets/m_lacoste_red.jpg" },

  // Qiyməti yazılmamışdı — 20 AZN qoydum, istəsən dəyiş
  { id:"m_louis_vuitton_limmensite", brand:"Louis Vuitton", name:"L’Immensité", gender:"male", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Premium", desc:"", img:"assets/m_louis_vuitton_limmensite.jpg" },

  { id:"m_montale_black_aoud", brand:"Montale", name:"Black Aoud", gender:"male", cat:"dark", price20:25, notes:"Oud • Tünd • Qalıcı", desc:"", img:"assets/m_montale_black_aoud.jpg" },

  { id:"m_eclat_sport", brand:"Éclat", name:"Sport", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Sport • Təmiz", desc:"", img:"assets/m_eclat_sport.jpg" },

  // Səndə “Megamore” yazılmışdı — düzgün adı Megamare (Orto Parisi)
  { id:"m_orto_parisi_megamare", brand:"Orto Parisi", name:"Megamare", gender:"male", cat:"fresh", price20:35, notes:"Dəniz • Güclü • Qalıcı", desc:"", img:"assets/m_orto_parisi_megamare.jpg" },

  { id:"m_paco_rabanne_invictus", brand:"Paco Rabanne", name:"Invictus", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Dəniz • Enerji", desc:"", img:"assets/m_paco_rabanne_invictus.jpg" },
  { id:"m_paco_rabanne_invictus_platinum", brand:"Paco Rabanne", name:"Invictus Platinum", gender:"male", cat:"fresh", price20:25, notes:"Fresh • Güclü • Premium", desc:"", img:"assets/m_paco_rabanne_invictus_platinum.jpg" },

  { id:"m_ralph_lauren_polo_blue", brand:"Ralph Lauren", name:"Polo Blue", gender:"male", cat:"fresh", price20:15, notes:"Fresh • Dəniz • Təmiz", desc:"", img:"assets/m_ralph_lauren_polo_blue.jpg" },

  { id:"m_sospiro_accento", brand:"Sospiro", name:"Accento", gender:"male", cat:"sweet", price20:25, notes:"Şirin • Premium • Qalıcı", desc:"", img:"assets/m_sospiro_accento.jpg" },

  { id:"m_trussardi_my_land", brand:"Trussardi", name:"My Land", gender:"male", cat:"woody", price20:18, notes:"Odunsu • Klassik • Təmiz", desc:"", img:"assets/m_trussardi_my_land.jpg" },

  { id:"m_versace_eros", brand:"Versace", name:"Eros", gender:"male", cat:"sweet", price20:15, notes:"Vanil • Şirin • Cazibə", desc:"", img:"assets/m_versace_eros.jpg" },

  // =========================
  // UNISEX (YENİ KATALOQ)
  // =========================
  { id:"u_bond_no_9_signature", brand:"Bond No. 9", name:"Signature", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Zərif • Premium", desc:"", img:"assets/u_bond_no_9_signature.jpg" },
  { id:"u_bond_no_9_lafayette_street", brand:"Bond No. 9", name:"Lafayette Street", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Fresh • Qalıcı", desc:"", img:"assets/u_bond_no_9_lafayette_street.jpg" },

  { id:"u_davidoff_cool_water", brand:"Davidoff", name:"Cool Water", gender:"unisex", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/u_davidoff_cool_water.jpg" },

  { id:"u_escentric_molecules_01", brand:"Escentric Molecules", name:"Molecule 01", gender:"unisex", cat:"woody", price20:25, notes:"Odunsu • Minimal • Iso E", desc:"", img:"assets/u_escentric_molecules_01.jpg" },
  { id:"u_escentric_molecules_02", brand:"Escentric Molecules", name:"Molecule 02", gender:"unisex", cat:"fresh", price20:25, notes:"Fresh • Ambroxan • Təmiz", desc:"", img:"assets/u_escentric_molecules_02.jpg" },
  { id:"u_escentric_molecules_03", brand:"Escentric Molecules", name:"Molecule 03", gender:"unisex", cat:"woody", price20:25, notes:"Vetiver • Odunsu • Təmiz", desc:"", img:"assets/u_escentric_molecules_03.jpg" },
  { id:"u_escentric_molecules_04", brand:"Escentric Molecules", name:"Molecule 04", gender:"unisex", cat:"woody", price20:25, notes:"Sandal • Odunsu • Yumşaq", desc:"", img:"assets/u_escentric_molecules_04.jpg" },
  { id:"u_escentric_molecules_05", brand:"Escentric Molecules", name:"Molecule 05", gender:"unisex", cat:"fresh", price20:25, notes:"Fresh • Kaşmiran • Təmiz", desc:"", img:"assets/u_escentric_molecules_05.jpg" },

  { id:"u_ex_nihilo_fleur_narcotique", brand:"Ex Nihilo", name:"Fleur Narcotique", gender:"unisex", cat:"fresh", price20:18, notes:"Çiçək • Fresh • Meyvəli", desc:"", img:"assets/u_ex_nihilo_fleur_narcotique.jpg" },

  { id:"u_marc_antoine_barrois_ganymede", brand:"Marc-Antoine Barrois", name:"Ganymede", gender:"unisex", cat:"woody", price20:25, notes:"Mineral • Odunsu • Dərin", desc:"", img:"assets/u_ganymede.jpg" },

  { id:"u_memo_paris_african_leather", brand:"Memo Paris", name:"African Leather", gender:"unisex", cat:"dark", price20:25, notes:"Dəri • Ədviyyat • Tünd", desc:"", img:"assets/u_memo_paris_african_leather.jpg" },

  { id:"u_nasomatto_black_afgano", brand:"Nasomatto", name:"Black Afgano", gender:"unisex", cat:"dark", price20:25, notes:"Tünd • Dərin • Qalıcı", desc:"", img:"assets/u_nasomatto_black_afgano.jpg" },

  { id:"u_nejma_7", brand:"Nejma", name:"Nejma 7", gender:"unisex", cat:"dark", price20:20, notes:"Şərqi • Tünd • Premium", desc:"", img:"assets/u_nejma_7.jpg" },

  { id:"u_sospiro_erba_pura", brand:"Sospiro", name:"Erba Pura", gender:"unisex", cat:"sweet", price20:15, notes:"Meyvəli • Şirin • Populyar", desc:"", img:"assets/u_sospiro_erba_pura.jpg" },

  { id:"u_tom_ford_bitter_peach", brand:"Tom Ford", name:"Bitter Peach", gender:"unisex", cat:"sweet", price20:25, notes:"Şaftalı • Şirin • Qalıcı", desc:"", img:"assets/u_tom_ford_bitter_peach.jpg" },
  { id:"u_tom_ford_vanille_sex", brand:"Tom Ford", name:"Vanille Sex", gender:"unisex", cat:"sweet", price20:25, notes:"Vanil • Şirin • Premium", desc:"", img:"assets/u_tom_ford_vanille_sex.jpg" },

  { id:"u_xerjoff_gran_ballo", brand:"Xerjoff", name:"Gran Ballo", gender:"unisex", cat:"sweet", price20:25, notes:"Şirin • Zərif • Çiçək", desc:"", img:"assets/u_xerjoff_gran_ballo.jpg" },
  { id:"u_xerjoff_naxos", brand:"Xerjoff", name:"Naxos", gender:"unisex", cat:"sweet", price20:25, notes:"Bal • Tütün • Qalıcı", desc:"", img:"assets/u_xerjoff_naxos.jpg" },
  { id:"u_xerjoff_more_than_words", brand:"Xerjoff", name:"More Than Words", gender:"unisex", cat:"dark", price20:25, notes:"Oud • Tünd • Premium", desc:"", img:"assets/u_xerjoff_more_than_words.jpg" },

  // sən “Ysl Libre İnstense” yazmışdın — düzgün: Libre Intense
  { id:"u_ysl_libre_intense", brand:"YSL", name:"Libre Intense", gender:"unisex", cat:"sweet", price20:18, notes:"Lavanda • Şirin • Qalıcı", desc:"", img:"assets/u_ysl_libre_intense.jpg" },

  { id:"u_yves_rocher_evidence", brand:"Yves Rocher", name:"Evidence", gender:"unisex", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Təmiz", desc:"", img:"assets/u_yves_rocher_evidence.jpg" },

  // =========================
  // QADIN (YENİ KATALOQ)
  // =========================
  { id:"f_anna_sui_lucky_wish", brand:"Anna Sui", name:"Lucky Wish", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Çiçək • Yumşaq", desc:"", img:"assets/f_anna_sui_lucky_wish.jpg" },

  { id:"f_burberry_goddess", brand:"Burberry", name:"Goddess", gender:"female", cat:"sweet", price20:25, notes:"Vanil • Şirin • Qalıcı", desc:"", img:"assets/f_burberry_goddess.jpg" },

  // “Burberry weekend (shahrızad)” — adın özü: Weekend for Women
  { id:"f_burberry_weekend", brand:"Burberry", name:"Weekend for Women", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Yumşaq • Rahat", desc:"", img:"assets/f_burberry_weekend.jpg" },

  { id:"f_dior_addict", brand:"Dior", name:"Dior Addict", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Dərin • Qalıcı", desc:"", img:"assets/f_dior_addict.jpg" },
  { id:"f_dior_addict_2", brand:"Dior", name:"Dior Addict 2", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Meyvəli • Yüngül", desc:"", img:"assets/f_dior_addict_2.jpg" },
  { id:"f_dior_forever_and_ever", brand:"Dior", name:"Forever and Ever Dior", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_dior_forever_and_ever.jpg" },

  { id:"f_dior_jadore", brand:"Dior", name:"J’adore", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Zərif • Klassik", desc:"", img:"assets/f_dior_jadore.jpg" },
  { id:"f_dior_joy", brand:"Dior", name:"Joy", gender:"female", cat:"fresh", price20:18, notes:"Fresh • Çiçək • Parlaq", desc:"", img:"assets/f_dior_joy.jpg" },
  { id:"f_miss_dior_blooming_bouquet", brand:"Dior", name:"Miss Dior Blooming Bouquet", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_miss_dior_blooming_bouquet.jpg" },
  { id:"f_dior_pure_poison", brand:"Dior", name:"Pure Poison", gender:"female", cat:"fresh", price20:18, notes:"Ağ çiçək • Fresh • Zərif", desc:"", img:"assets/f_dior_pure_poison.jpg" },

  { id:"f_calvin_klein_euphoria", brand:"Calvin Klein", name:"Euphoria", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Dərin", desc:"", img:"assets/f_ck_euphoria.jpg" },

  { id:"f_cacharel_amor_amor", brand:"Cacharel", name:"Amor Amor", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Romantik", desc:"", img:"assets/f_cacharel_amor_amor.jpg" },
  { id:"f_cacharel_anais_anais", brand:"Cacharel", name:"Anaïs Anaïs", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yumşaq", desc:"", img:"assets/f_cacharel_anais_anais.jpg" },

  // “La Panther” -> düzgün: La Panthère
  { id:"f_cartier_la_panthere", brand:"Cartier", name:"La Panthère", gender:"female", cat:"sweet", price20:25, notes:"Çiçək • Şirin • Premium", desc:"", img:"assets/f_cartier_la_panthere.jpg" },

  // “Chanel Tendre” -> Chance Eau Tendre
  { id:"f_chanel_chance_eau_tendre", brand:"Chanel", name:"Chance Eau Tendre", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Meyvəli • Yüngül", desc:"", img:"assets/f_chanel_chance_eau_tendre.jpg" },
  { id:"f_chanel_no5", brand:"Chanel", name:"N°5", gender:"female", cat:"fresh", price20:15, notes:"Klassik • Çiçək • Aldehid", desc:"", img:"assets/f_chanel_no5.jpg" },
  { id:"f_chanel_no5_leau", brand:"Chanel", name:"N°5 L’Eau", gender:"female", cat:"fresh", price20:18, notes:"Fresh • Yüngül • Təmiz", desc:"", img:"assets/f_chanel_no5_leau.jpg" },
  { id:"f_chanel_coco", brand:"Chanel", name:"Coco", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Klassik • Dərin", desc:"", img:"assets/f_chanel_coco.jpg" },
  { id:"f_chanel_gabrielle", brand:"Chanel", name:"Gabrielle", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_chanel_gabrielle.jpg" },

  { id:"f_chloe_edp", brand:"Chloé", name:"Chloé Eau de Parfum", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_chloe_edp.jpg" },
  { id:"f_chloe_nomade", brand:"Chloé", name:"Nomade", gender:"female", cat:"woody", price20:15, notes:"Odunsu • Çiçək • Dərin", desc:"", img:"assets/f_chloe_nomade.jpg" },

  { id:"f_clinique_happy", brand:"Clinique", name:"Happy", gender:"female", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Şən", desc:"", img:"assets/f_clinique_happy.jpg" },

  { id:"f_dg_limperatrice", brand:"Dolce & Gabbana", name:"L’Imperatrice", gender:"female", cat:"fresh", price20:15, notes:"Meyvəli • Fresh • Yüngül", desc:"", img:"assets/f_dg_limperatrice.jpg" },
  { id:"f_dg_light_blue", brand:"Dolce & Gabbana", name:"Light Blue", gender:"female", cat:"fresh", price20:15, notes:"Sitrus • Fresh • Yay", desc:"", img:"assets/f_dg_light_blue.jpg" },

  { id:"f_elizabeth_arden_white_tea", brand:"Elizabeth Arden", name:"White Tea", gender:"female", cat:"fresh", price20:15, notes:"Çay • Fresh • Təmiz", desc:"", img:"assets/f_elizabeth_arden_white_tea.jpg" },
  { id:"f_elizabeth_arden_green_tea", brand:"Elizabeth Arden", name:"Green Tea", gender:"female", cat:"fresh", price20:18, notes:"Çay • Fresh • Sitrus", desc:"", img:"assets/f_elizabeth_arden_green_tea.jpg" },

  { id:"f_armani_acqua_di_gioia", brand:"Giorgio Armani", name:"Acqua di Gioia", gender:"female", cat:"fresh", price20:15, notes:"Dəniz • Fresh • Təmiz", desc:"", img:"assets/f_armani_acqua_di_gioia.jpg" },
  { id:"f_armani_my_way", brand:"Giorgio Armani", name:"My Way", gender:"female", cat:"fresh", price20:22, notes:"Çiçək • Fresh • Modern", desc:"", img:"assets/f_armani_my_way.jpg" },
  { id:"f_armani_si_passione", brand:"Giorgio Armani", name:"Sì Passione", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Meyvəli • Qalıcı", desc:"", img:"assets/f_armani_si_passione.jpg" },
  { id:"f_armani_si_intense", brand:"Giorgio Armani", name:"Sì Intense", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Dərin • Qalıcı", desc:"", img:"assets/f_armani_si_intense.jpg" },

  { id:"f_givenchy_dahlia_divin", brand:"Givenchy", name:"Dahlia Divin", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Zərif • Premium", desc:"", img:"assets/f_givenchy_dahlia_divin.jpg" },
  { id:"f_givenchy_irresistible", brand:"Givenchy", name:"Irresistible", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Meyvəli • Zərif", desc:"", img:"assets/f_givenchy_irresistible.jpg" },
  { id:"f_givenchy_linterdit", brand:"Givenchy", name:"L’Interdit", gender:"female", cat:"sweet", price20:20, notes:"Ağ çiçək • Şirin • Qalıcı", desc:"", img:"assets/f_givenchy_linterdit.jpg" },

  { id:"f_gucci_bloom", brand:"Gucci", name:"Bloom", gender:"female", cat:"fresh", price20:22, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_gucci_bloom.jpg" },
  { id:"f_gucci_envy_me", brand:"Gucci", name:"Envy Me", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Gənc", desc:"", img:"assets/f_genvy_me.jpg" },
  { id:"f_gucci_flora_by_gucci", brand:"Gucci", name:"Flora by Gucci", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_gucci_flora_by_gucci.jpg" },
  { id:"f_gucci_guilty", brand:"Gucci", name:"Guilty", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Zərif • Qalıcı", desc:"", img:"assets/f_gucci_guilty.jpg" },
  { id:"f_gucci_rush", brand:"Gucci", name:"Rush", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Dərin • Klassik", desc:"", img:"assets/f_gucci_rush.jpg" },
  { id:"f_gucci_rush_2", brand:"Gucci", name:"Rush 2", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Çiçək • Yüngül", desc:"", img:"assets/f_gucci_rush_2.jpg" },

  { id:"f_hugo_boss_hugo_woman", brand:"Hugo Boss", name:"Hugo Woman", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Meyvəli • Təmiz", desc:"", img:"assets/f_hugo_boss_hugo_woman.jpg" },

  { id:"f_jennifer_lopez_still", brand:"Jennifer Lopez", name:"Still", gender:"female", cat:"fresh", price20:15, notes:"Çay • Fresh • Yumşaq", desc:"", img:"assets/f_jennifer_lopez_still.jpg" },

  { id:"f_kenzo_amour", brand:"Kenzo", name:"Amour", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Yumşaq • Rahat", desc:"", img:"assets/f_kenzo_amour.jpg" },

  { id:"f_lacoste_pour_femme", brand:"Lacoste", name:"Pour Femme", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Çiçək • Zərif", desc:"", img:"assets/f_lacoste_pour_femme.jpg" },

  { id:"f_lanvin_marry_me", brand:"Lanvin", name:"Marry Me!", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Çiçək • Romantik", desc:"", img:"assets/f_lanvin_marry_me.jpg" },

  { id:"f_mancera_roses_vanille", brand:"Mancera", name:"Roses Vanille", gender:"female", cat:"sweet", price20:20, notes:"Gül • Vanil • Şirin", desc:"", img:"assets/f_mancera_roses_vanille.jpg" },
  { id:"f_montale_vanilla_cake", brand:"Montale", name:"Vanilla Cake", gender:"female", cat:"sweet", price20:20, notes:"Vanil • Şirin • Gourmand", desc:"", img:"assets/f_montale_vanilla_cake.jpg" },
  { id:"f_montale_chocolate_greedy", brand:"Montale", name:"Chocolate Greedy", gender:"female", cat:"sweet", price20:15, notes:"Şokolad • Şirin • Gourmand", desc:"", img:"assets/f_montale_chocolate_greedy.jpg" },
  { id:"f_montale_intense_cafe", brand:"Montale", name:"Intense Café", gender:"female", cat:"sweet", price20:18, notes:"Qəhvə • Vanil • Şirin", desc:"", img:"assets/f_montale_intense_cafe.jpg" },
  { id:"f_montale_roses_musk", brand:"Montale", name:"Roses Musk", gender:"female", cat:"sweet", price20:20, notes:"Gül • Musk • Zərif", desc:"", img:"assets/f_montale_roses_musk.jpg" },

  { id:"f_moschino_toy2_bubble_gum", brand:"Moschino", name:"Toy 2 Bubble Gum", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Gənc", desc:"", img:"assets/f_moschino_toy2_bubble_gum.jpg" },

  // “Alein” -> Alien
  { id:"f_mugler_alien", brand:"Mugler", name:"Alien", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Güclü • Qalıcı", desc:"", img:"assets/f_mugler_alien.jpg" },

  { id:"f_narciso_poudree", brand:"Narciso Rodriguez", name:"Poudrée", gender:"female", cat:"sweet", price20:20, notes:"Pudra • Musk • Yumşaq", desc:"", img:"assets/f_narciso_poudree.jpg" },
  { id:"f_narciso_for_her_pink", brand:"Narciso Rodriguez", name:"For Her (Pink)", gender:"female", cat:"sweet", price20:15, notes:"Musk • Şirin • Zərif", desc:"", img:"assets/f_narciso_for_her_pink.jpg" },
  { id:"f_narciso_rose_musk", brand:"Narciso Rodriguez", name:"Rose Musk", gender:"female", cat:"sweet", price20:25, notes:"Gül • Musk • Premium", desc:"", img:"assets/f_narciso_rose_musk.jpg" },

  { id:"f_nina_ricci_nina", brand:"Nina Ricci", name:"Nina", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Yüngül", desc:"", img:"assets/f_nina_ricci_nina.jpg" },

  { id:"f_jordani_gold", brand:"Jordani", name:"Gold", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Zərif • Klassik", desc:"", img:"assets/f_jordani_gold.jpg" },

  { id:"f_lucia", brand:"Lucia", name:"Lucia", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Yumşaq • Təmiz", desc:"", img:"assets/f_lucia.jpg" },

  { id:"f_parfums_de_marly_delina", brand:"Parfums de Marly", name:"Delina", gender:"female", cat:"sweet", price20:25, notes:"Gül • Şirin • Premium", desc:"", img:"assets/f_pdm_delina.jpg" },

  { id:"f_prada_candy", brand:"Prada", name:"Candy", gender:"female", cat:"sweet", price20:15, notes:"Karamel • Şirin • Gourmand", desc:"", img:"assets/f_prada_candy.jpg" },

  { id:"f_ferragamo_amo", brand:"Salvatore Ferragamo", name:"Amo Ferragamo", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Meyvəli • Zərif", desc:"", img:"assets/f_ferragamo_amo.jpg" },

  { id:"f_shiseido_zen", brand:"Shiseido", name:"Zen", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Çiçək • Zərif", desc:"", img:"assets/f_shiseido_zen.jpg" },
  { id:"f_shiseido_ginza", brand:"Shiseido", name:"Ginza", gender:"female", cat:"sweet", price20:20, notes:"Çiçək • Şirin • Qalıcı", desc:"", img:"assets/f_shiseido_ginza.jpg" },

  { id:"f_tiziana_terenzi_kirke", brand:"Tiziana Terenzi", name:"Kirke", gender:"female", cat:"sweet", price20:25, notes:"Meyvəli • Şirin • Qalıcı", desc:"", img:"assets/f_tiziana_kirke.jpg" },
  { id:"f_tiziana_terenzi_andromeda", brand:"Tiziana Terenzi", name:"Andromeda", gender:"female", cat:"sweet", price20:25, notes:"Şirin • Zərif • Premium", desc:"", img:"assets/f_tiziana_andromeda.jpg" },
  { id:"f_tiziana_terenzi_gumin", brand:"Tiziana Terenzi", name:"Gumin", gender:"female", cat:"sweet", price20:25, notes:"Şirin • Premium • Qalıcı", desc:"", img:"assets/f_tiziana_gumin.jpg" },

  { id:"f_tom_ford_black_orchid", brand:"Tom Ford", name:"Black Orchid", gender:"female", cat:"dark", price20:18, notes:"Tünd • Çiçək • Dərin", desc:"", img:"assets/f_tom_ford_black_orchid.jpg" },

  { id:"f_zam_zam", brand:"Zam Zam", name:"Zam Zam", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Şərqi • Yumşaq", desc:"", img:"assets/f_zam_zam.jpg" },

  { id:"f_tom_ford_lost_cherry", brand:"Tom Ford", name:"Lost Cherry", gender:"female", cat:"sweet", price20:25, notes:"Albalı • Şirin • Premium", desc:"", img:"assets/f_tom_ford_lost_cherry.jpg" },

  { id:"f_trussardi_donna", brand:"Trussardi", name:"Donna", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Zərif", desc:"", img:"assets/f_trussardi_donna.jpg" },

  { id:"f_valentino_valentino", brand:"Valentino", name:"Valentino", gender:"female", cat:"fresh", price20:15, notes:"Zərif • Fresh • Klassik", desc:"", img:"assets/f_valentino_valentino.jpg" },
  { id:"f_valentino_pink", brand:"Valentino", name:"Valentino Pink", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Çiçək • Zərif", desc:"", img:"assets/f_valentino_pink.jpg" },
  { id:"f_valentino_donna", brand:"Valentino", name:"Valentino Donna", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Zərif • Qalıcı", desc:"", img:"assets/f_valentino_donna.jpg" },

  { id:"f_versace_bright_crystal", brand:"Versace", name:"Bright Crystal", gender:"female", cat:"fresh", price20:15, notes:"Çiçək • Fresh • Yüngül", desc:"", img:"assets/f_versace_bright_crystal.jpg" },
  { id:"f_versace_versus", brand:"Versace", name:"Versus", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Gündəlik • Təmiz", desc:"", img:"assets/f_versace_versus.jpg" },

  { id:"f_victorias_secret_bombshell", brand:"Victoria’s Secret", name:"Bombshell", gender:"female", cat:"fresh", price20:15, notes:"Fresh • Meyvəli • Parlaq", desc:"", img:"assets/f_vs_bombshell.jpg" },
  { id:"f_victorias_secret_bombshell_intense", brand:"Victoria’s Secret", name:"Bombshell Intense", gender:"female", cat:"sweet", price20:18, notes:"Şirin • Meyvəli • Qalıcı", desc:"", img:"assets/f_vs_bombshell_intense.jpg" },
  { id:"f_victorias_secret_eau_so_sexy", brand:"Victoria’s Secret", name:"Eau So Sexy", gender:"female", cat:"sweet", price20:15, notes:"Şirin • Meyvəli • Yüngül", desc:"", img:"assets/f_vs_eau_so_sexy.jpg" },
  { id:"f_victorias_secret_rose_bergamot", brand:"Victoria’s Secret", name:"Rose Bergamot", gender:"female", cat:"fresh", price20:25, notes:"Gül • Fresh • Premium", desc:"", img:"assets/f_vs_rose_bergamot.jpg" },

  // Sən bunu yazmışdın (bayaq da səndə var idi) — saxladım:
  { id:"f_xerjoff_lira", brand:"Xerjoff", name:"Casamorati Lira", gender:"female", cat:"sweet", price20:20, notes:"Vanil • Şirin • Gourmand", desc:"", img:"assets/f_xerjoff_lira.jpg" },
  { id:"f_xerjoff_mefisto", brand:"Xerjoff", name:"Casamorati Mefisto", gender:"female", cat:"fresh", price20:20, notes:"Sitrus • Fresh • Təmiz", desc:"", img:"assets/f_xerjoff_mefisto.jpg" },
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
  return `${Number.isInteger(n) ? n : n}AZN`; // 15AZN formatı
}
function openWAHello(){
  window.open(
    `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Salam Garnet Parfum! Mən ətir sifarişi etmək istəyirəm.")}`,
    "_blank"
  );
}

// =========================
// Modal selection helpers
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
  if(current) $("#mPrice") && ($("#mPrice").textContent = money(current.price20));
}
function updateModalPrice(){
  if(!current) return;
  const size = pick.size ? Number(pick.size) : 20;
  const finalPrice = priceBySize(current.price20, size);
  $("#mPrice") && ($("#mPrice").textContent = money(finalPrice));
}

// ✅ Event delegation: modal düymələri 1 dəfə bağlanır
function bindModalOptionHandlersOnce(){
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
    found.qty += 1; // ✅ istədiyin qədər artır
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

  it.qty = Math.max(1, (it.qty || 1) + delta);

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
  document.body.classList.add("noScroll");
  renderCart();
}
function closeCart(){
  $("#cartBack") && $("#cartBack").classList.remove("show");
  document.body.classList.remove("noScroll");
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

  // bind actions
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

  // düymə adları
  $("#mOrder") && ($("#mOrder").textContent = "İndi sifariş et");
  $("#mCopy") && ($("#mCopy").textContent = "Səbətə əlavə et");

  $("#modalBack") && $("#modalBack").classList.add("show");
  document.body.classList.add("noScroll");

  bindModalOptionHandlersOnce();
}
function closeModal(){
  $("#modalBack") && $("#modalBack").classList.remove("show");
  document.body.classList.remove("noScroll");
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

  // Modal order → WhatsApp
  $("#mOrder") && ($("#mOrder").onclick = () => {
    if(!current) return;
    if(!requireSelectionsOrWarn()) return;
    const finalPrice = priceBySize(current.price20, pick.size);
    openWA(current, pick.size, pick.delivery, finalPrice);
  });

  // Modal add to cart
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

  // Cart open/close
  $("#btnCart") && ($("#btnCart").onclick = openCart);
  $("#cartX") && ($("#cartX").onclick = closeCart);
  $("#cartBack")?.addEventListener("click", (e) => {
    if(e.target.id === "cartBack") closeCart();
  });

  // Cart actions
  $("#cartClear") && ($("#cartClear").onclick = () => {
    clearCart();
    alert("Səbət təmizləndi ✅");
  });
  $("#cartCheckout") && ($("#cartCheckout").onclick = checkoutCartToWhatsApp);

  // init
  setCartCountUI();
  render();
});