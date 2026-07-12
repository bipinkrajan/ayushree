/* =============================================================
 * APP (patient) — login gate, routing, rendering, PWA wiring.
 * Data is the logged-in patient's live record from Supabase.
 * ============================================================= */
import { CLINIC, applyTheme } from "../config/clinic.config.js";
import { t, L, getLang, setLang, onLangChange } from "./i18n.js";
import { getData, update, isDoctor, isLoggedIn, loginWithBundle, logout } from "./store.js";
import { patientLogin } from "./api.js";
import { SCREENS } from "./screens.js";
import { toast } from "./components.js";

let currentScreen = "dashboard";

/* ---------- Boot ---------- */
function boot() {
  applyTheme();
  document.documentElement.lang = getLang();
  wireGlobal();
  registerSW();
  onLangChange(() => { paintLogin(); if (isLoggedIn()) { paintChrome(); render(); } });
  if (isLoggedIn()) showApp(); else showLogin();
}

/* ---------- Login ---------- */
function showLogin() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.querySelector(".device").classList.add("hidden");
  paintLogin();
}
function showApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.querySelector(".device").classList.remove("hidden");
  paintChrome();
  render();
}
function paintLogin() {
  document.getElementById("login-title").textContent = t("patientLogin");
  document.getElementById("lbl-op").textContent = t("opNumber");
  document.getElementById("lbl-pin").textContent = t("pin");
  document.getElementById("login-btn").textContent = t("login");
  document.getElementById("login-hint").textContent = t("loginHint");
  document.getElementById("lgn-en").classList.toggle("active", getLang() === "en");
  document.getElementById("lgn-ml").classList.toggle("active", getLang() === "ml");
}
async function doLogin() {
  const op = document.getElementById("in-op").value;
  const pin = document.getElementById("in-pin").value;
  const err = document.getElementById("login-error");
  const btn = document.getElementById("login-btn");
  err.classList.add("hidden");
  if (!op.trim() || !pin.trim()) { err.textContent = t("loginInvalid"); err.classList.remove("hidden"); return; }
  btn.disabled = true; btn.textContent = t("loggingIn");
  try {
    const bundle = await patientLogin(op, pin);
    loginWithBundle(bundle);
    document.getElementById("in-pin").value = "";
    currentScreen = "dashboard";
    showApp();
  } catch (e) {
    err.textContent = e.code === "network" ? t("loginNetwork") : t("loginInvalid");
    err.classList.remove("hidden");
  } finally {
    btn.disabled = false; btn.textContent = t("login");
  }
}

/* ---------- Header / chrome ---------- */
function paintChrome() {
  document.getElementById("doctorLine").textContent = `${t("doctorLabel")}: ${CLINIC.doctors[0].name}`;
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);
  document.getElementById("btn-en").classList.toggle("active", getLang() === "en");
  document.getElementById("btn-ml").classList.toggle("active", getLang() === "ml");

  setText("nav-home", "home"); setText("nav-ads", "ads"); setText("nav-treatment", "treatment");
  setText("nav-reminders", "reminders"); setText("nav-contacts", "contacts");
  const lg = document.getElementById("logout-btn"); if (lg) lg.querySelector(".menu-label").textContent = t("logout");

  document.querySelectorAll("[data-screen]").forEach((el) => {
    el.querySelector(".menu-label").textContent = t(SCREENS[el.getAttribute("data-screen")].titleKey);
  });
  document.querySelector('[data-screen="diagnosis"] .lock')?.classList.toggle("hidden", isDoctor());
}
const setText = (id, key) => { const e = document.getElementById(id); if (e) e.textContent = t(key); };

/* ---------- Render ---------- */
function render() {
  const host = document.getElementById("view");
  const d = getData();
  if (!d) { showLogin(); return; }
  host.innerHTML = SCREENS[currentScreen].render();
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.nav === currentScreen));
  document.querySelectorAll("[data-screen]").forEach((m) => m.classList.toggle("active", m.dataset.screen === currentScreen));
  host.scrollTop = 0;
  if (currentScreen === "reminders") refreshNotifStatus();
}
function goto(screen) { if (!SCREENS[screen]) return; currentScreen = screen; closeMenu(); render(); }

/* ---------- Wiring ---------- */
function wireGlobal() {
  // login
  document.getElementById("login-btn").onclick = doLogin;
  document.getElementById("in-pin").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
  document.getElementById("lgn-en").onclick = () => setLang("en");
  document.getElementById("lgn-ml").onclick = () => setLang("ml");
  // app language
  document.getElementById("btn-en").onclick = () => setLang("en");
  document.getElementById("btn-ml").onclick = () => setLang("ml");
  // menu
  document.getElementById("menu-btn").onclick = toggleMenu;
  document.getElementById("menu-overlay").onclick = closeMenu;
  document.getElementById("logout-btn").onclick = () => { logout(); closeMenu(); showLogin(); };
  document.querySelectorAll("[data-nav]").forEach((n) => n.onclick = () => goto(n.dataset.nav));
  document.querySelectorAll("[data-screen]").forEach((m) => m.onclick = () => goto(m.dataset.screen));
  const view = document.getElementById("view");
  view.addEventListener("click", onViewClick);
}

function onViewClick(e) {
  const chip = e.target.closest(".chip");
  if (chip) { chip.classList.toggle("on"); return; }
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const actions = {
    "mark-complete": markComplete,
    "goto-followup": () => goto("followup"),
    "goto-dashboard": () => goto("dashboard"),
    "refill": () => refill(btn.dataset.id),
    "google-review": googleReview,
    "enable-notif": enableNotifications,
    "share-ad": () => shareAd(btn.dataset.id),
  };
  if (actions[btn.dataset.action]) { e.preventDefault(); actions[btn.dataset.action](); }
}

/* ---------- Actions (patient) ---------- */
function markComplete() {
  const d = getData(); const total = d.treatment.durationDays;
  const done = Math.min(d.progress.completedDays + 1, total);
  update("progress", { completedDays: done });
  toast(`${t("day")} ${done} ${t("of")} ${total} ✓`);
  render();
}
function refill(id) {
  const d = getData(); const m = d.medicines.find((x) => x.id === id);
  toast(`${t("refillReorder")}: ${m ? m.name : ""} ✓`);
}
function googleReview() { window.open(CLINIC.googleReviewUrl, "_blank", "noopener"); }

async function shareAd(id) {
  const ad = getData().ads.find((a) => a.id === id); if (!ad) return;
  const title = L(ad.title);
  const text = `${title}\n${L(ad.body)}\n\n${L(CLINIC.name)}`;
  const url = CLINIC.siteUrl;
  try { if (navigator.share) { await navigator.share({ title, text, url }); return; } } catch (_) { return; }
  try { await navigator.clipboard.writeText(`${text}\n${url}`); toast(t("linkCopied")); }
  catch (_) { window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank", "noopener"); }
}

/* ---------- Notifications ---------- */
async function enableNotifications() {
  if (!("Notification" in window)) { toast(t("notifBlocked")); return; }
  const perm = await Notification.requestPermission();
  refreshNotifStatus();
  if (perm === "granted") { new Notification(L(CLINIC.name), { body: t("notifOn"), icon: CLINIC.logo }); toast(t("notifOn")); }
  else toast(t("notifBlocked"));
}
function refreshNotifStatus() {
  const el = document.getElementById("notif-status"); if (!el) return;
  const state = ("Notification" in window) ? Notification.permission : "unsupported";
  el.textContent = state === "granted" ? "✅ " + t("notifOn") : state === "denied" ? "⚠️ " + t("notifBlocked") : "";
}

/* ---------- Menu ---------- */
function toggleMenu() { document.getElementById("menu").classList.toggle("open"); document.getElementById("menu-overlay").classList.toggle("show"); }
function closeMenu() { document.getElementById("menu").classList.remove("open"); document.getElementById("menu-overlay").classList.remove("show"); }

/* ---------- SW + install ---------- */
function registerSW() {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  let deferred;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferred = e;
    const b = document.getElementById("install-btn"); b.classList.remove("hidden");
    b.onclick = async () => { b.classList.add("hidden"); deferred.prompt(); deferred = null; };
  });
}

boot();
