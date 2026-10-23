// Katalog sahifasi (index.html)
let cat = "Hammasi", q = "";

function renderPromoStrip() {
  const p = promo(), el = $("#promoStrip");
  if (!el) return;
  el.hidden = !p.active;
  $("#promoTxt").textContent = p.title;
}

function renderCatalog() {
  const all = products(), cats = ["Hammasi", ...new Set(all.map(p => p.cat))];
  $("#chips").innerHTML = cats.map(c => `<button class="chip ${c === cat ? "active" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  const items = all.filter(p => (cat === "Hammasi" || p.cat === cat) && p.name.toLowerCase().includes(q));
  $("#grid").innerHTML = items.map((p, i) => { const h = HUES[p.cat] || ["#dcfce7", "#86efac"];
    return `<article class="card reveal" style="animation-delay:${(i % 8) * 60}ms;--bg:${h[0]};--h:${h[1]}">
      <div class="card__frame">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}">` : `<span>${esc(p.emoji)}</span>`}<em>${esc(p.cat)}</em></div>
      <div class="card__body"><h3>${esc(p.name)}</h3><div class="card__foot"><strong>${money(p.price)}</strong>
      <button class="btn btn--primary btn--sm" data-add="${p.id}">+ Savat</button></div></div></article>`; }).join("") || "<p class='muted'>Hech narsa topilmadi 😕</p>";
  observe();
}

document.addEventListener("click", e => {
  if (e.target.dataset.c) { cat = e.target.dataset.c; renderCatalog(); }
});
$("#search").oninput = e => { q = e.target.value.toLowerCase(); renderCatalog(); };

renderPromoStrip();
renderCatalog();
