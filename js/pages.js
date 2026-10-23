// Qo'shimcha sahifalar: aksiyalar, buyurtmalarim, haqida, aloqa
const promoPct = () => Math.min(100, Math.max(0, Number(promo().percent) || 0));

function renderPromoPage() {
  const p = promo(), n = promoPct();
  $("#promoBig").textContent = `−${n}%`;
  $("#promoTitle").textContent = p.title;
  $("#promoDesc").textContent = p.desc;
  $("#promoStatus").textContent = p.active ? "🟢 Aksiya faol" : "⚪ Aksiya hozircha faol emas";
  const ex = 100000, exPay = ex - Math.round(ex * n / 100);
  $("#promoExample").innerHTML = p.active
    ? `Savat jami <b>${money(ex)}</b> bo'lsa, chegirmadan keyin <b>${money(exPay)}</b> to'laysiz.`
    : "Aksiya faol bo'lganda bu yerda misol ko'rsatiladi.";
  const sub = cartSum(), d = discountFor(sub);
  $("#promoMine").innerHTML = !isCustomer()
    ? "Chegirmadan foydalanish uchun Google orqali kiring."
    : sub ? `Savatingiz: <b>${money(sub)}</b> → <b>${money(d.pay)}</b>` : "Savatingiz hozircha bo'sh.";
}

function renderOrdersPage() {
  const box = $("#ordersList"), gate = $("#ordersGate");
  if (!isCustomer()) { gate.hidden = false; box.innerHTML = ""; return; }
  gate.hidden = true;
  const mine = load("fm_orders", []).filter(o => o.user === user.email);
  box.innerHTML = mine.map(o => `<article class="order-card">
    <div class="order-card__head"><span>${esc(o.date)}</span><span>#${String(o.id).slice(-5)}</span></div>
    <ul>${o.items.map(i => `<li><span>${esc(i.name)} ×${i.n}</span><span>${money(i.price * i.n)}</span></li>`).join("")}</ul>
    <div class="order-card__sum">
      ${o.discount ? `<div><span>Jami</span><span>${money(o.subtotal ?? o.total)}</span></div><div class="disc"><span>Chegirma −${o.discountPct}%</span><span>−${money(o.discount)}</span></div>` : ""}
      <div class="total"><span>To'landi</span><span>${money(o.total)}</span></div>
    </div></article>`).join("") || "<p class='muted'>Hali buyurtmalaringiz yo'q. <a class='link' href='index.html'>Katalogga o'ting →</a></p>";
}

function renderAbout() {
  const all = products();
  $("#statProducts").textContent = all.length;
  $("#statCats").textContent = new Set(all.map(p => p.cat)).size;
  $("#statDiscount").textContent = promo().active ? `${promoPct()}%` : "—";
}

function initContact() {
  const f = $("#contactForm");
  if (isCustomer()) $("#c_name").value = user.name;
  f.onsubmit = e => {
    e.preventDefault();
    const name = $("#c_name").value.trim(), phone = $("#c_phone").value.trim(), text = $("#c_text").value.trim();
    if (!name || !text) return toast("Ism va xabarni kiriting");
    const msgs = load("fm_messages", []);
    msgs.unshift({ id: Date.now(), date: new Date().toLocaleString("uz-UZ"), name, phone, text });
    save("fm_messages", msgs);
    f.reset(); if (isCustomer()) $("#c_name").value = user.name;
    toast("Xabaringiz yuborildi ✅");
  };
}

if ($("#promoPage")) renderPromoPage();
if ($("#ordersList")) { renderOrdersPage(); $("#ordersLogin").onclick = () => openModal(false); }
if ($("#statProducts")) renderAbout();
if ($("#contactForm")) initContact();
observe();
