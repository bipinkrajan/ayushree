/* =============================================================
 * APP — controller: routing, rendering, events, PWA wiring
 * ============================================================= */
import { CLINIC, applyTheme } from "../config/clinic.config.js";
import { t, L, getLang, setLang, onLangChange } from "./i18n.js";
import { getData, update, getRole, setRole, onRoleChange, isDoctor } from "./store.js";
import { SCREENS } from "./screens.js";
import { toast } from "./components.js";

let currentScreen = "dashboard";

/* ---------- Boot ---------- */
function boot() {
  applyTheme();
  document.documentElement.lang = getLang();
  paintChrome();
  render();
  wireEvents();
  registerSW();
  onLangChange(() => { paintChrome(); render(); });
  onRoleChange(() => { paintChrome(); render(); });
}

/* ---------- Header / static chrome ---------- */
function paintChrome() {
  const cn = document.getElementById("clinicName");
  if (cn) cn.textContent = L(CLINIC.name);
  document.getElementById("doctorLine").textContent = `${t("doctorLabel")}: ${CLINIC.doctors[0].name}`;
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);

  document.getElementById("btn-en").classList.toggle("active", getLang() === "en");
  document.getElementById("btn-ml").classList.toggle("active", getLang() === "ml");

  const role = getRole();
  document.getElementById("role-patient").classList.toggle("active", role === "patient");
  document.getElementById("role-doctor").classList.toggle("active", role === "doctor");
  document.getElementById("roleLabel").textContent = t("roleLabel");

  setText("nav-home", "home");
  setText("nav-ads", "ads");
  setText("nav-treatment", "treatment");
  setText("nav-reminders", "reminders");
  setText("nav-contacts", "contacts");

  document.querySelectorAll("[data-screen]").forEach((el) => {
    const id = el.getAttribute("data-screen");
    el.querySelector(".menu-label").textContent = t(SCREENS[id].titleKey);
  });
  document.querySelector('[data-screen="diagnosis"] .lock')?.classList.toggle("hidden", isDoctor());
}
const setText = (id, key) => { const e = document.getElementById(id); if (e) e.textContent = t(key); };

/* ---------- Render ---------- */
function render() {
  const host = document.getElementById("view");
  host.innerHTML = SCREENS[currentScreen].render();
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);
  document.querySelectorAll(".nav-item").forEach((n) =>
    n.classList.toggle("active", n.dataset.nav === currentScreen));
  document.querySelectorAll("[data-screen]").forEach((m) =>
    m.classList.toggle("active", m.dataset.screen === currentScreen));
  host.scrollTop = 0;
  if (currentScreen === "reminders") refreshNotifStatus();
}

function goto(screen) {
  if (!SCREENS[screen]) return;
  currentScreen = screen;
  closeMenu();
  render();
}

/* ---------- Events ---------- */
function wireEvents() {
  document.getElementById("btn-en").onclick = () => setLang("en");
  document.getElementById("btn-ml").onclick = () => setLang("ml");
  document.getElementById("role-patient").onclick = () => setRole("patient");
  document.getElementById("role-doctor").onclick = () => setRole("doctor");
  document.getElementById("menu-btn").onclick = toggleMenu;
  document.getElementById("menu-overlay").onclick = closeMenu;

  document.querySelectorAll("[data-nav]").forEach((n) => n.onclick = () => goto(n.dataset.nav));
  document.querySelectorAll("[data-screen]").forEach((m) => m.onclick = () => goto(m.dataset.screen));

  document.getElementById("view").addEventListener("click", onViewClick);
}

function onViewClick(e) {
  const chip = e.target.closest(".chip");
  if (chip) { chip.classList.toggle("on"); return; }

  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const actions = {
    "mark-complete": markComplete,
    "goto-followup": () => goto("followup"),
    "goto-dashboard": () => goto("dashboard"),
    "save-visit": saveVisit,
    "save-diagnosis": saveDiagnosis,
    "save-treatment": saveTreatment,
    "add-medicine": addMedicine,
    "refill": () => refill(btn.dataset.id),
    "create-appointment": createAppointment,
    "google-review": googleReview,
    "enable-notif": enableNotifications,
    "share-ad": () => shareAd(btn.dataset.id),
  };
  if (actions[action]) { e.preventDefault(); actions[action](); }
}

/* ---------- Form helper ---------- */
const formVals = (name) => {
  const f = document.querySelector(`[data-form="${name}"]`);
  const o = {};
  if (!f) return o;
  f.querySelectorAll("input, textarea, select").forEach((el) => {
    o[el.name] = el.type === "checkbox" ? el.checked : el.value;
  });
  f.querySelectorAll("[data-chipselect]").forEach((cs) => {
    o[cs.dataset.chipselect] = [...cs.querySelectorAll(".chip.on")].map((c) => c.dataset.id);
  });
  return o;
};

/* ---------- Actions ---------- */
function markComplete() {
  const d = getData();
  const total = d.treatment.durationDays;
  const done = Math.min(d.progress.completedDays + 1, total);
  update("progress", { completedDays: done });
  toast(`${t("day")} ${done} ${t("of")} ${total} ✓`);
  render();
}

function saveVisit() {
  const v = formVals("visit");
  update("patient", {
    opNumber: v.opNumber, name: v.name, age: v.age,
    mobile: v.mobile, address: v.address, referredBy: v.referredBy,
  });
  update("currentIssue", {
    issue: v.issue, history: v.history,
    previousTreatment: v.previousTreatment, otherIssues: v.otherIssues || [],
  });
  toast(t("saved"));
  goto("dashboard");
}

function saveDiagnosis() {
  const v = formVals("diagnosis");
  update("diagnosis", { text: v.text, notes: v.notes, sharedWithPatient: !!v.sharedWithPatient });
  toast(t("saved"));
}

function saveTreatment() {
  const v = formVals("treatment");
  update("treatment", {
    by: v.by, name: v.name,
    durationDays: Number(v.durationDays) || 30, instructions: v.instructions,
  });
  // advice do/don't now live on the treatment screen; keep storing under pathya
  update("pathya", { adviceDo: v.adviceDo || [], adviceDont: v.adviceDont || [] });
  toast(t("saved"));
}

function addMedicine() {
  const v = formVals("medicine");
  const d = getData();
  const refillDate = new Date(); refillDate.setDate(refillDate.getDate() + 12);
  const meds = [...d.medicines, {
    id: "m" + Date.now(), name: v.name, type: "kashayam",
    timing: v.timing, dosage: v.dosage, food: v.food,
    instructions: v.instructions, refillDate: refillDate.toISOString().slice(0, 10),
  }];
  update("medicines", meds);
  toast(t("saved"));
  render();
}

function refill(id) {
  const d = getData();
  const m = d.medicines.find((x) => x.id === id);
  toast(`${t("refillReorder")}: ${m ? m.name : ""} ✓`);
}

function createAppointment() {
  const v = formVals("followup");
  update("followup", { date: v.date, time: v.time, reminderMode: v.reminderMode });
  const d = getData();
  const appt = { id: "a" + Date.now(), date: v.date, time: v.time, type: "followup", status: "upcoming" };
  update("appointments", [...d.appointments.filter((a) => a.type !== "followup"), appt]);
  toast(t("appointmentCreated"));
  goto("reminders");
}

function googleReview() { window.open(CLINIC.googleReviewUrl, "_blank", "noopener"); }

/* ---------- Share a flyer (Web Share API + clipboard fallback) ---------- */
async function shareAd(id) {
  const ad = getData().ads.find((a) => a.id === id);
  if (!ad) return;
  const title = L(ad.title);
  const text = `${title}\n${L(ad.body)}\n\n${L(CLINIC.name)}`;
  const url = CLINIC.siteUrl;
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
  } catch (_) { return; /* user cancelled */ }
  // fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast(t("linkCopied"));
  } catch (_) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank", "noopener");
  }
}

/* ---------- Notifications ---------- */
async function enableNotifications() {
  if (!("Notification" in window)) { toast(t("notifBlocked")); return; }
  const perm = await Notification.requestPermission();
  refreshNotifStatus();
  if (perm === "granted") {
    new Notification(L(CLINIC.name), { body: t("notifOn"), icon: CLINIC.logo });
    toast(t("notifOn"));
  } else { toast(t("notifBlocked")); }
}
function refreshNotifStatus() {
  const el = document.getElementById("notif-status");
  if (!el) return;
  const state = ("Notification" in window) ? Notification.permission : "unsupported";
  el.textContent = state === "granted" ? "✅ " + t("notifOn")
    : state === "denied" ? "⚠️ " + t("notifBlocked") : "";
}

/* ---------- Menu ---------- */
function toggleMenu() {
  document.getElementById("menu").classList.toggle("open");
  document.getElementById("menu-overlay").classList.toggle("show");
}
function closeMenu() {
  document.getElementById("menu").classList.remove("open");
  document.getElementById("menu-overlay").classList.remove("show");
}

/* ---------- Service worker + install ---------- */
function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
  let deferred;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferred = e;
    const b = document.getElementById("install-btn");
    b.classList.remove("hidden");
    b.onclick = async () => { b.classList.add("hidden"); deferred.prompt(); deferred = null; };
  });
}

boot();
