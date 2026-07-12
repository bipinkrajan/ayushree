# Chat Brief — Ayushree Ayurvedic Hospital Patient Care App

**Date:** 7 July 2026
**Goal:** Turn the uploaded HTML mockup into a working PWA prototype.

## Decisions taken (confirmed with you)
- **Tech stack:** Vanilla HTML/CSS/JS (ES modules), no build step — easiest to run and re-brand.
- **Doctor-only diagnosis:** handled via a **Patient / Doctor role toggle** in the app (demo). Diagnosis is hidden from patients unless the doctor ticks "Share with patient".
- **Google review link:** configurable placeholder in `config/clinic.config.js` (replace with the real URL).

## What was built (Phase 1 — frontend prototype)
All 17 requested capabilities are represented across 9 screens:
1. Patient dashboard ✔
2. OP number as primary ID ✔
3. Registration / visit details ✔
4. Current health issue + history ✔
5. Other health issues dropdown (multi-select) ✔
6. Doctor-only diagnosis (role-gated + shareable) ✔
7. Treatment plan (from library) ✔
8. Medicines & intake ✔
9. Kashayam reminders ✔
10. External application reminders ✔
11. Pathya / Apathya ✔
12. Doctor advice — do / don't ✔
13. Follow-up date/time → creates appointment ✔
14. Medicine refill / reorder reminder ✔
15. Appointment reminder ✔
16. Google review button ✔
17. English / Malayalam switcher ✔

**PWA:** manifest.json, service worker (offline shell caching), icons, install button.
**Data:** sample seed data in localStorage; edits persist across refresh.
**SaaS-ready:** all clinic-specific content isolated in `config/clinic.config.js` + `config/libraries.js`.

## Verified
- All JS modules pass syntax check.
- All 9 screens render in EN + ML × Patient + Doctor (36 combinations) with no errors.
- Diagnosis correctly hidden for patient / shown for doctor.
- localStorage read/write works.

## Open items / to provide later
- Real **Google review URL** (currently a placeholder).
- Real clinic **phone / WhatsApp / map** (placeholders in config).
- Optional: replace demo **logo.svg** with the official Ayushree logo, then regenerate icons.

## Phase 2 (not built yet)
Backend + multi-patient DB, real auth-enforced roles, push/WhatsApp/SMS reminders,
calendar (.ics) integration, admin dashboard, PDF export, multi-tenant SaaS setup.
See README.md §4 for the full list.
