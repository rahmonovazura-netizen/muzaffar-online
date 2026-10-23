const gate = $("#gate"), app = $("#app");
function enter() { gate.hidden = true; app.hidden = false; sessionStorage.adm = 1; fillPromo(); draw(); }
$("#pwBtn").onclick = () => $("#pw").value === ADMIN_PASSWORD ? enter() : alert("Parol noto'g'ri");
if (sessionStorage.adm) enter();

function draw() {
  const p = products(), o = load("fm_orders", []), m = load("fm_messages", []);
  const tushum = o.reduce((a, b) => a + b.total, 0), chegirma = o.reduce((a, b) => a + (b.discount || 0), 0);
  $("#st").innerHTML = `<div><b>${p.length}</b>Mahsulotlar</div><div><b>${o.length}</b>Buyurtmalar</div><div><b>${money(tushum)}</b>Tushum</div><div><b>${money(chegirma)}</b>Berilgan chegirma</div><div><b>${m.length}</b>Xabarlar</div>`;
  $("#rows").innerHTML = p.map(x => `<tr><td>${esc(x.emoji)}</td><td>${esc(x.name)}</td><td>${esc(x.cat)}</td><td>${money(x.price)}</td>
   <td><button class="btn btn--sm btn--ghost" data-e="${x.id}">✏️</button> <button class="btn btn--sm btn--danger" data-d="${x.id}">🗑</button></td></tr>`).join("");
  $("#ord").innerHTML = o.map(x => `<tr><td>${esc(x.date)}</td><td>${esc(x.name)}<br><small>${esc(x.user)}</small></td><td>${x.items.map(i => esc(i.name) + " ×" + i.n).join(", ")}</td>
   <td>${x.discount ? `<small>−${x.discountPct}%</small><br>` : ""}${money(x.total)}</td></tr>`).join("") || "<tr><td colspan=4>Hali buyurtma yo'q</td></tr>";
  $("#msgs").innerHTML = m.map(x => `<tr><td>${esc(x.date)}</td><td>${esc(x.name)}<br><small>${esc(x.phone) || "—"}</small></td><td>${esc(x.text)}</td></tr>`).join("") || "<tr><td colspan=3>Hali xabar yo'q</td></tr>";
}

let editId = null;
$("#save").onclick = () => {
  const v = k => $("#f_" + k).value.trim(), p = products();
  if (!v("name") || !v("price")) return alert("Nomi va narxini kiriting");
  const o = { name: v("name"), emoji: v("emoji") || "🛒", cat: v("cat") || "Boshqa", price: +v("price"), img: v("img") };
  if (editId) Object.assign(p.find(x => x.id == editId), o); else p.push({ id: Date.now(), ...o });
  save("fm_products", p); editId = null; document.querySelectorAll(".form-row .input").forEach(i => i.value = ""); draw();
};
document.addEventListener("click", e => {
  const t = e.target, p = products();
  if (t.dataset.d && confirm("O'chirilsinmi?")) { save("fm_products", p.filter(x => x.id != t.dataset.d)); draw(); }
  if (t.dataset.e) { const x = p.find(i => i.id == t.dataset.e); editId = x.id; ["name", "emoji", "cat", "price", "img"].forEach(k => $("#f_" + k).value = x[k]); scrollTo({ top: 0, behavior: "smooth" }); }
});
$("#reset").onclick = () => { if (confirm("Hamma mahsulotlar asl holiga qaytsinmi?")) { localStorage.removeItem("fm_products"); draw(); } };

function fillPromo() {
  const p = promo();
  $("#p_active").checked = !!p.active; $("#p_percent").value = p.percent; $("#p_title").value = p.title; $("#p_desc").value = p.desc;
}
$("#savePromo").onclick = () => {
  const pct = Math.min(100, Math.max(0, +$("#p_percent").value || 0));
  savePromo({ active: $("#p_active").checked, percent: pct, title: $("#p_title").value.trim() || PROMO_DEFAULT.title, desc: $("#p_desc").value.trim() });
  fillPromo(); alert("Aksiya saqlandi ✅");
};
