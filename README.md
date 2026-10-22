# Fresh Market (SCSS 7-1)

## Ishga tushirish
1. `npm install`
2. `npm run build` (css/main.css ni scss/main.scss dan qayta yaratadi)
3. `index.html` ni oching. Admin: `admin.html`, parol: `admin123`

Google kirish: `js/config.js` ichiga Google Cloud'dan olingan CLIENT_ID ni yozing. Bo'sh bo'lsa demo rejim ishlaydi.

## Sahifalar
- `index.html` — Katalog (qidiruv, kategoriya filtri, animatsiyali kartalar)
- `aksiyalar.html` — Aksiyalar: chegirma shartlari va misol
- `buyurtmalar.html` — Mening buyurtmalarim (faqat Google orqali kirgan mijozlar uchun)
- `haqida.html` — Biz haqimizda
- `aloqa.html` — Aloqa formasi (xabarlar admin panelda ko'rinadi)
- `admin.html` — Admin panel: mahsulotlar, aksiya sozlamalari, buyurtmalar, xabarlar

## Aksiya (chegirma)
- Tizimga kirgan (Google yoki demo) har bir mijozning savat jami summasiga chegirma qo'llanadi.
- Standart foiz va matnlar `js/config.js` dagi `PROMO_DEFAULT` da.
- Admin panelning "Aksiyalar" bo'limidan foiz, sarlavha va tavsifni o'zgartirish, aksiyani yoqish/o'chirish mumkin (localStorage'da saqlanadi).

## Orqa fon animatsiyasi
- `scss/layout/_background.scss` — kontent orqasida suzuvchi emojilar va harakatlanuvchi rangli dog'lar.
- `prefers-reduced-motion` yoqilgan bo'lsa, fon animatsiyasi o'chadi.

## Ma'lumotlar
Mahsulotlar, savat, buyurtmalar, aloqa xabarlari va aksiya sozlamalari brauzerning localStorage'ida saqlanadi (demo rejim).
