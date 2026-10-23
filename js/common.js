// Umumiy qism: sayt qobig'i (header/footer/savat/login), foydalanuvchi, savat va aksiya chegirmasi
const HERE = location.pathname.split("/").pop() || "index.html";
const NAV = [["index.html", "Katalog"], ["aksiyalar.html", "🎉 Aksiyalar"], ["buyurtmalar.html", "Buyurtmalarim"], ["haqida.html", "Haqida"], ["aloqa.html", "Aloqa"]];
let user = load("fm_user", null), cart = load("fm_cart", {}), pending = null;

function mountShell() {
  document.body.insertAdjacentHTML("afterbegin", `<div class="bg" id="bg" aria-hidden="true"></div>
<header class="header"><div class="container header__in"><a class="logo" href="index.html">🥬 Fresh Market</a>
<nav class="nav">${NAV.map(([h, t]) => `<a href="${h}"${h === HERE ? ' class="active"' : ""}>${t}</a>`).join("")}</nav>
<div class="header__actions"><span class="user-chip" id="userChip"></span><button class="btn btn--ghost btn--sm" id="logout" hidden>Chiqish</button>
<button class="cart-btn" id="cartBtn" aria-label="Savat">🛒<b id="count">0</b></button></div></div></header>`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="footer">© 2026 Fresh Market · <a href="aksiyalar.html">Aksiyalar</a> · <a href="aloqa.html">Aloqa</a> · <a href="admin.html">Admin panel</a></footer>
<div class="overlay" id="modal"><div class="modal"><button class="close">×</button><div class="emoji">🥑</div><h2>Xush kelibsiz!</h2>
<p class="muted">Davom etish uchun kirish usulini tanlang</p><div class="warn" id="warn" hidden>⚠️ Savatga qo'shish va buyurtma berish uchun avval Google accountni ulang.</div>
<div class="stack"><button class="g-btn" id="gBtn"><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.1 5.5c4.3-4 6.8-9.9 6.8-16.9z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.9 2.3-8.8 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>Google orqali kirish</button>
<button class="btn btn--ghost" id="guestBtn">Mehmon sifatida davom etish</button></div></div></div>
<aside class="drawer" id="drawer"><div class="drawer__head"><h3>🛒 Savat</h3><button id="closeCart" class="close" style="position:static">×</button></div>
<div class="drawer__list" id="lines"></div>
<div class="drawer__foot">
  <div class="sum-row"><span>Jami:</span><strong id="sub"></strong></div>
  <div class="sum-row sum-row--disc" id="discRow" hidden><span>🎉 Aksiya chegirmasi <b id="discPct"></b>:</span><strong id="disc"></strong></div>
  <div class="sum-row total"><span>To'lanadi:</span><strong id="sum"></strong></div>
  <p class="hint" id="hint" hidden></p>
  <button class="btn btn--primary" id="order" style="justify-content:center">Buyurtma berish</button></div></aside>
<div class="toast" id="toast"></div>`);
  const E = ["🥬", "🍎", "🥕", "🍓", "🧀", "🍞", "🥑", "🍇", "🥛", "🍅", "🍌", "🥚"];
  $("#bg").innerHTML = Array.from({ length: 16 }, (_, i) => `<span style="left:${(i * 37) % 100}%;font-size:${(1.1 + (i % 4) * .45).toFixed(2)}rem;animation-duration:${18 + (i * 7) % 14}s;animation-delay:-${(i * 5) % 18}s">${E[i % E.length]}</span>`).join("");
}
mountShell();

const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const isCustomer = () => !!user && !user.guest;
function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 2600); }
function openModal(warn) { $("#warn").hidden = !warn; $("#modal").classList.add("open"); }
function closeModal() { $("#modal").classList.remove("open"); }
function cartSum() { const all = products(); return Object.entries(cart).reduce((s, [id, n]) => { const p = all.find(x => x.id == id); return p ? s + p.price * n : s; }, 0); }
// Aksiya: tizimga kirgan har bir mijozning savat jami summasiga chegirma
function discountFor(sum) {
  const p = promo(), pct = p.active && isCustomer() ? Math.min(100, Math.max(0, Number(p.percent) || 0)) : 0, off = Math.round(sum * pct / 100);
  return { pct, off, pay: sum - off };
}
function setUser(u) {
  user = u; save("fm_user", u); closeModal(); renderUser(); renderCart();
  const p = promo();
  toast(u.guest ? "Mehmon sifatida kirdingiz" : `Xush kelibsiz, ${u.name}!` + (p.active ? ` Sizga ${p.percent}% chegirma 🎉` : ""));
  if (pending && isCustomer()) { add(pending); pending = null; }
}
function renderUser() {
  $("#userChip").textContent = user ? (user.guest ? "👤 Mehmon" : "👤 " + user.name) : "";
  $("#logout").hidden = !user;
}
function decodeJwt(t) { return JSON.parse(decodeURIComponent(escape(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))))); }
function googleLogin() {
  if (window.GOOGLE_CLIENT_ID && window.google) {
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: r => { const d = decodeJwt(r.credential); setUser({ name: d.name, email: d.email, pic: d.picture }); } });
    google.accounts.id.prompt();
  } else { // demo rejim
    const email = prompt("DEMO: Google email manzilingiz", "talaba@gmail.com");
    if (email) setUser({ name: email.split("@")[0], email });
  }
}
function logout() { user = null; localStorage.removeItem("fm_user"); renderUser(); renderCart(); openModal(false); }
function add(id) {
  if (!isCustomer()) { pending = id; openModal(true); return; }
  cart[id] = (cart[id] || 0) + 1; save("fm_cart", cart); renderCart();
  const b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  toast("Savatga qo'shildi 🛒");
}
function renderCart() {
  const all = products(), sub = cartSum(), d = discountFor(sub), p = promo();
  $("#lines").innerHTML = Object.entries(cart).map(([id, n]) => { const p = all.find(x => x.id == id); if (!p) return "";
    return `<div class="line"><span>${esc(p.emoji)} ${esc(p.name)}<br><small class="muted">${money(p.price)}</small></span>
    <span class="qty"><button data-m="${id}">−</button>${n}<button data-p="${id}">+</button></span></div>`; }).join("") || "<p class='muted'>Savat bo'sh</p>";
  $("#sub").textContent = money(sub);
  $("#discRow").hidden = !d.pct; $("#discPct").textContent = `−${d.pct}%`; $("#disc").textContent = "−" + money(d.off);
  $("#sum").textContent = money(d.pay);
  $("#hint").hidden = isCustomer() || !p.active || !cartCount();
  $("#hint").textContent = `🎉 Google orqali kirganingizda savat jami summasiga ${p.percent}% chegirma qo'llanadi`;
  $("#count").textContent = cartCount();
}
function checkout() {
  if (!cartCount()) return toast("Savat bo'sh");
  if (!isCustomer()) { openModal(true); return; }
  const all = products(), orders = load("fm_orders", []), sub = cartSum(), d = discountFor(sub);
  const items = Object.entries(cart).map(([id, n]) => { const p = all.find(x => x.id == id); return p ? { name: p.name, n, price: p.price } : null; }).filter(Boolean);
  if (!items.length) return toast("Savat bo'sh");
  orders.unshift({ id: Date.now(), user: user.email, name: user.name, items, subtotal: sub, discountPct: d.pct, discount: d.off, total: d.pay, date: new Date().toLocaleString("uz-UZ") });
  save("fm_orders", orders); cart = {}; save("fm_cart", cart); renderCart(); $("#drawer").classList.remove("open");
  toast(d.pct ? `Buyurtma qabul qilindi ✅ (−${d.pct}% chegirma)` : "Buyurtma qabul qilindi ✅");
}
let io; function observe() { io ||= new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .1 }); document.querySelectorAll(".reveal:not(.in)").forEach(e => io.observe(e)); }

document.addEventListener("click", e => {
  const t = e.target;
  if (t.dataset.add) add(+t.dataset.add);
  if (t.dataset.p) { cart[t.dataset.p]++; save("fm_cart", cart); renderCart(); }
  if (t.dataset.m) { if (--cart[t.dataset.m] <= 0) delete cart[t.dataset.m]; save("fm_cart", cart); renderCart(); }
  if (t.id === "modal" || t.matches(".close")) closeModal();
});
$("#gBtn").onclick = googleLogin; $("#guestBtn").onclick = () => setUser({ guest: true });
$("#cartBtn").onclick = () => $("#drawer").classList.add("open"); $("#closeCart").onclick = () => $("#drawer").classList.remove("open");
$("#order").onclick = checkout; $("#logout").onclick = logout;
renderUser(); renderCart();
if (!user && HERE === "index.html") setTimeout(() => openModal(false), 600);
