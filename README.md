# Ayushree Ayurvedic Hospital — Patient Care PWA

A mobile-first, installable Progressive Web App for Ayurveda clinics. It is a
**patient treatment-record and reminder app** (not a generic appointment app):
OP number as the patient ID, current issue history, doctor-only diagnosis,
treatment plan, medicines + kashayam/external reminders, pathya/apathya, doctor
advice, follow-ups that become appointments, refill reminders, a Google review
button, and an English / Malayalam switcher.

Built with **plain HTML + CSS + ES modules** — no build step, no framework.
Data is stored in the browser (`localStorage`) for this prototype.

---

## 1. Folder structure

```
ayushree-pwa/
├── index.html              App shell: header, role/lang switches, nav, menu
├── manifest.json           PWA manifest (name, icons, theme, standalone)
├── service-worker.js       Offline caching of the app shell
├── README.md
│
├── config/                 ← EDIT THESE TO RE-BRAND (SaaS)
│   ├── clinic.config.js     Clinic name, logo, doctors, OP format, theme,
│   │                        Google review link, feature flags
│   └── libraries.js         Reusable lists: health issues, treatments,
│                            medicines, pathya/apathya, doctor advice
│
├── js/
│   ├── app.js               Controller: routing, events, PWA + install wiring
│   ├── store.js             Data layer (localStorage) + sample seed + role
│   ├── screens.js           One render() per screen (dashboard, visit, …)
│   ├── components.js        Reusable UI builders (card, field, chips, toast…)
│   ├── i18n.js              Tiny translation engine (t / L / setLang)
│   └── i18n.strings.js      All UI strings in English + Malayalam
│
├── css/
│   └── styles.css           Theme via CSS variables; phone-first + desktop frame
│
└── assets/
    ├── logo.svg
    └── icons/               icon-192, icon-512, icon-maskable-512 (PNG)
```

**Design principles used**
- *Config-driven*: nothing clinic-specific is hard-coded in app logic.
- *Reusable components*: screens are assembled from `components.js` builders.
- *Single data gateway*: every screen reads/writes through `store.js` only, so
  swapping localStorage for a real backend later is a one-file change.
- *Bilingual by default*: all labels come from `i18n`; library data carries both
  `en` and `ml`.

---

## 2. How to run it

A PWA needs to be **served over HTTP** (service workers and ES modules don't work
from a `file://` double-click). Pick any one:

**Python (already on most machines)**
```bash
cd ayushree-pwa
python3 -m http.server 8080
# open http://localhost:8080
```

**Node**
```bash
cd ayushree-pwa
npx serve .            # or: npx http-server -p 8080
```

**VS Code:** right-click `index.html` → *Open with Live Server*.

Then open the URL on your phone (same Wi-Fi, use your computer's IP) or in Chrome
on desktop. In Chrome you'll see an **Install** icon in the address bar, or use the
in-app ⬇ Install button, to add it to your home screen.

**Try it:**
- Toggle **English / മലയാളം** in the header.
- Toggle **View as: Patient / Doctor** — the Diagnosis screen is hidden for the
  patient (unless the doctor ticks "Share diagnosis with patient") and fully
  editable for the doctor.
- Use the bottom nav or the ☰ menu to move between all 9 screens.
- Edits are saved to `localStorage` and survive refresh.

---

## 3. Which files to edit for branding (white-label / SaaS)

Almost everything lives in **`config/`** — you rarely touch app code.

| To change… | Edit | Field |
|---|---|---|
| Clinic name (EN/ML) | `config/clinic.config.js` | `name` |
| Logo | replace `assets/logo.svg` (+ regenerate icons) | `logo` |
| Doctor name(s) | `config/clinic.config.js` | `doctors`, `defaultDoctorId` |
| OP number format | `config/clinic.config.js` | `opNumber.prefix`, `seqPadding` |
| Theme colours | `config/clinic.config.js` | `theme.*` (auto-applied as CSS vars) |
| Google review link | `config/clinic.config.js` | `googleReviewUrl` |
| Contact / map | `config/clinic.config.js` | `contact` |
| Turn modules on/off | `config/clinic.config.js` | `features.*` |
| Treatment library | `config/libraries.js` | `TREATMENTS` |
| Medicine library | `config/libraries.js` | `MEDICINES` |
| Health-issue dropdown | `config/libraries.js` | `HEALTH_ISSUES` |
| Pathya / Apathya lists | `config/libraries.js` | `PATHYA`, `APATHYA` |
| Doctor advice do/don't | `config/libraries.js` | `ADVICE` |
| UI wording / new language | `js/i18n.strings.js` | add a language block |

> **Set the real Google review URL** in `googleReviewUrl` — get it from the
> clinic's Google Business Profile → "Get more reviews".

To onboard a new clinic later, copy the folder, edit `config/clinic.config.js` +
`config/libraries.js`, drop in their logo, done.

---

## 4. What should be Phase 2

This prototype is intentionally frontend-only. Recommended next phases:

**Backend & data**
- Replace `localStorage` in `store.js` with a real backend (Supabase / Firebase /
  Node + Postgres). Because all data access goes through `store.js`, this is
  isolated.
- Multi-patient support: patient list/search by OP number, and auto-generated OP
  numbers using the `opNumber` config format.

**Auth & roles**
- Real authentication so **doctor/admin** vs **patient** is enforced server-side
  (the current role toggle is a demo). Doctor-only diagnosis then becomes a true
  access rule, not a UI switch.

**Real reminders & notifications**
- Push notifications (Web Push / FCM) and scheduled reminders for kashayam,
  external application, appointments and medicine refills — instead of the demo
  in-app notification.
- Calendar integration (.ics / Google Calendar) when a follow-up becomes an
  appointment.
- WhatsApp / SMS reminders (common and effective for Kerala clinics).

**Clinic admin**
- Admin dashboard (desktop) to manage patients, edit libraries via UI, view
  today's appointments, and print/export patient records as PDF.
- Refill workflow connected to the clinic's dispensary/stock.

**SaaS platform**
- Tenant management: one deployment serving many clinics, each loading its own
  `clinic.config.js` (e.g. by subdomain).
- Billing, onboarding wizard, and a template/library marketplace.

**Polish**
- Form validation, image upload (prescriptions/reports), treatment-day tracking
  with history, and analytics.
```
