/* =============================================================
 * APP — controller: routing, rendering, events, PWA wiring
 * ============================================================= */
import { CLINIC, applyTheme } from "../config/clinic.config.js";
import { HEALTH_ISSUES } from "../config/libraries.js";
import {
  t, L, getLang, setLang, onLangChange,
} from "./i18n.js";
import {
  getData, update, getRole, setRole, onRoleChange, isDoctor,
} from "./store.js";
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

/* ---------- Header / static chrome (branding + switches) ---------- */
function paintChrome() {
  document.getElementById("clinicName").textContent = L(CLINIC.name);
  document.getElementById("doctorLine").textContent =
    `${t("doctorView") === "Doctor" ? "Doctor" : "ഡോക്ടര്‍"}: ${CLINIC.doctors[0].name}`;
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);

  // language buttons
  document.getElementById("btn-en").classList.toggle("active", getLang() === "en");
  document.getElementById("btn-ml").classList.toggle("active", getLang() === "ml");

  // role toggle
  const role = getRole();
  document.getElementById("role-patient").classList.toggle("active", role === "patient");
  document.getElementById("role-doctor").classList.toggle("active", role === "doctor");
  document.getElementById("roleLabel").textContent = t("roleLabel");

  // bottom nav labels
  setText("nav-home", "home");
  setText("nav-treatment", "treatment");
  setText("nav-reminders", "reminders");
  setText("nav-more", "menu");

  // menu labels + doctor-only visibility
  document.querySelectorAll("[data-screen]").forEach((el) => {
    const id = el.getAttribute("data-screen");
    el.querySelector(".menu-label").textContent = t(SCREENS[id].titleKey);
  });
  document.querySelector('[data-screen="diagnosis"] .lock')
    ?.classList.toggle("hidden", isDoctor());
}
const setText = (id, key) => { const e = document.getElementById(id); if (e) e.textContent = t(key); };

/* ---------- Render current screen ---------- */
function render() {
  const host = document.getElementById("view");
  host.innerHTML = SCREENS[currentScreen].render();
  document.getElementById("screenTitle").textContent = t(SCREENS[currentScreen].titleKey);
  // highlight active nav / menu
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

/* ---------- Event delegation ---------- */
function wireEvents() {
  // language
  document.getElementById("btn-en").onclick = () => setLang("en");
  document.getElementById("btn-ml").onclick = () => setLang("ml");
  // role
  document.getElementById("role-patient").onclick = () => setRole("patient");
  document.getElementById("role-doctor").onclick = () => setRole("doctor");
  // menu toggle
  document.getElementById("menu-btn").onclick = toggleMenu;
  document.getElementById("menu-overlay").onclick = closeMenu;

  // nav + menu items
  document.querySelectorAll("[data-nav]").forEach((n) =>
    n.onclick = () => goto(n.dataset.nav));
  document.querySelectorAll("[data-screen]").forEach((m) =>
    m.onclick = () => goto(m.dataset.screen));

  // delegated clicks inside the view
  document.getElementById("view").addEventListener("click", onViewClick);
}

function onViewClick(e) {
  // chip multi-select
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
    "save-pathya": savePathya,
    "create-appointment": createAppointment,
    "google-review": googleReview,
    "enable-notif": enableNotifications,
  };
  if (actions[action]) { e.preventDefault(); actions[action](); }
}

/* ---------- Helpers to read a form ---------- */
const formVals = (name) => {
  const f = document.querySelector(`[data-form="${name}"]`);
  const o = {};
  if (!f) return o;
  f.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.type === "checkbox") o[el.name] = el.checked;
    else o[el.name] = el.value;
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

function savePathya() {
  const v = formVals("pathya");
  update("pathya", {
    allowed: v.allowed || [], avoid: v.avoid || [],
    adviceDo: v.adviceDo || [], adviceDont: v.adviceDont || [],
  });
  toast(t("saved"));
}

function createAppointment() {
  const v = formVals("followup");
  update("followup", { date: v.date, time: v.time, reminderMode: v.reminderMode });
  const d = getData();
  const appt = { id: "a" + Date.now(), date: v.date, time: v.time, type: "followup", status: "upcoming" };
  update("appointments", [...d.appointments.filter((a) => a.type !== "followup"), appt]);
  // also add an appointment reminder entry
  toast(t("appointmentCreated"));
  goto("reminders");
}

function googleReview() {
  window.open(CLINIC.googleReviewUrl, "_blank", "noopener");
}

/* ---------- Notifications (demo) ---------- */
async function enableNotifications() {
  if (!("Notification" in window)) { toast(t("notifBlocked")); return; }
  const perm = await Notification.requestPermission();
  refreshNotifStatus();
  if (perm === "granted") {
    new Notification(L(CLINIC.name), { body: t("notifOn"), icon: CLINIC.logo });
    toast(t("notifOn"));
  } else {
    toast(t("notifBlocked"));
  }
}
function refreshNotifStatus() {
  const el = document.getElementById("notif-status");
  if (!el) return;
  const state = ("Notification" in window) ? Notification.permission : "unsupported";
  el.textContent = state === "granted" ? "✅ " + t("notifOn")
    : state === "denied" ? "⚠️ " + t("notifBlocked") : "";
}

/* ---------- Menu drawer ---------- */
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
