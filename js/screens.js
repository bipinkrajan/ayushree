/* =============================================================
 * SCREENS — one render() function per screen.
 * Each returns an HTML string. Interactivity is wired in app.js
 * via event delegation + data-action attributes.
 * ============================================================= */
import { t, L, getLang } from "./i18n.js";
import { getData, isDoctor } from "./store.js";
import { CLINIC } from "../config/clinic.config.js";
import {
  HEALTH_ISSUES, TREATMENTS, MEDICINES, PATHYA, APATHYA, ADVICE,
} from "../config/libraries.js";
import {
  card, row, pill, field, input, textarea, select, button,
  chipSelect, doctorOnly, esc,
} from "./components.js";

const fmtDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString(getLang() === "ml" ? "ml-IN" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" });
};
const labelFor = (list, id) => { const x = list.find((i) => i.id === id); return x ? L(x) : id; };

/* ---------------- 1. DASHBOARD ---------------- */
export function dashboard() {
  const d = getData();
  const p = d.patient;
  const total = d.treatment.durationDays;
  const done = d.progress.completedDays;
  const issues = d.currentIssue.otherIssues.map((id) => labelFor(HEALTH_ISSUES, id));

  return `
    ${card("opNumber", `<div class="op-number">${esc(p.opNumber)}</div>`, { cls: "op-card" })}
    ${card("patientOverview", `
      ${row("name", p.name)}
      ${row("age", p.age)}
      ${row("mobile", p.mobile)}
      ${row("address", p.address)}
      ${row("joined", fmtDate(p.joined))}
      ${row("lastVisit", fmtDate(p.lastVisit))}
    `)}
    ${card("latestHealth", `
      ${pill(d.currentIssue.issue, "red")}
      ${issues.map((i) => pill(i, "orange")).join("")}
      ${row("treatmentJourney", `${t("day")} ${done} ${t("of")} ${total}`, true)}
      <div class="progress"><div class="progress-bar" style="width:${Math.round(done/total*100)}%"></div></div>
    `)}
    ${card("todaysReminders", `
      ${d.reminders.map((r) => row(r.time, r.label, true)).join("")}
      ${button("markComplete", { action: "mark-complete" })}
    `)}
    ${card("nextFollowup", `
      ${row("date", fmtDate(d.followup.date))}
      ${row("time", d.followup.time)}
      ${button("viewAppointment", { cls: "light", action: "goto-followup" })}
    `)}`;
}

/* ---------------- 2. REGISTRATION / VISIT ---------------- */
export function visit() {
  const d = getData();
  const p = d.patient;
  const ci = d.currentIssue;
  return `
    <form data-form="visit">
    ${card("patientOverview", `
      ${field("opNumber", input("opNumber", p.opNumber))}
      ${field("name", input("name", p.name))}
      ${field("age", input("age", p.age, "number"))}
      ${field("mobileNumber", input("mobile", p.mobile))}
      ${field("address", textarea("address", p.address))}
      ${field("referredBy", input("referredBy", p.referredBy))}
    `)}
    ${card("currentHealthIssue", `
      ${field("issue", input("issue", ci.issue))}
      ${field("history", textarea("history", ci.history))}
      ${field("previousTreatment", textarea("previousTreatment", ci.previousTreatment))}
      ${field("otherIssues", chipSelect("otherIssues",
        HEALTH_ISSUES.map((i) => ({ id: i.id, label: L(i) })), ci.otherIssues))}
      ${button("saveVisit", { action: "save-visit" })}
    `)}
    </form>`;
}

/* ---------------- 3. DIAGNOSIS (doctor-only) ---------------- */
export function diagnosis() {
  const d = getData();
  const dx = d.diagnosis;

  // Patient view: only show if doctor chose to share
  if (!isDoctor()) {
    if (!dx.sharedWithPatient) {
      return card("diagnosis", `<p class="muted-note">🔒 ${t("hiddenFromPatient")}</p>`);
    }
    return card("diagnosis", `
      ${row("diagnosis", dx.text)}
      <p style="font-size:13px">${esc(dx.notes)}</p>`);
  }

  // Doctor view: full editable form
  return `
    <form data-form="diagnosis">
    ${card("diagnosis", `
      ${doctorOnly()}
      ${field("diagnosis", textarea("text", dx.text))}
      ${field("clinicalNotes", textarea("notes", dx.notes))}
      <label class="switch-row">
        <input type="checkbox" name="sharedWithPatient" ${dx.sharedWithPatient ? "checked" : ""}>
        <span>${t("shareWithPatient")}</span>
      </label>
      ${button("saveDiagnosis", { action: "save-diagnosis" })}
    `)}
    </form>`;
}

/* ---------------- 4. TREATMENT PLAN ---------------- */
export function treatment() {
  const d = getData();
  const tr = d.treatment;
  const docs = CLINIC.doctors.map((x) => ({ value: x.name, label: x.name }));
  const treatOpts = TREATMENTS.map((x) => ({ value: L(x), label: L(x) }));
  return `
    <form data-form="treatment">
    ${card("treatmentPlan", `
      ${field("treatmentBy", select("by", docs, tr.by))}
      ${field("treatmentName", select("name", treatOpts, tr.name))}
      ${field("duration", input("durationDays", tr.durationDays, "number"))}
      ${field("therapyInstructions", textarea("instructions", tr.instructions))}
      ${button("saveTreatment", { action: "save-treatment" })}
    `)}
    </form>`;
}

/* ---------------- 5. MEDICINES & INTAKE + REFILL ---------------- */
export function medicine() {
  const d = getData();
  const foodOpts = [
    { value: "before", label: t("beforeFood") },
    { value: "after", label: t("afterFood") },
  ];
  const medOpts = MEDICINES.map((m) => ({ value: L(m), label: L(m) }));

  const list = d.medicines.map((m) => `
    <div class="med-item">
      <div class="med-head">
        <strong>${esc(m.name)}</strong>
        <span class="pill ${m.type === "thailam" ? "orange" : ""}">${esc(m.timing)}</span>
      </div>
      <div class="row"><span class="label">${t("dosage")}</span><span class="value">${esc(m.dosage)}</span></div>
      <div class="row"><span class="label">${t("foodTiming")}</span><span class="value">${m.food === "before" ? t("beforeFood") : t("afterFood")}</span></div>
      ${m.instructions ? `<p class="med-note">${esc(m.instructions)}</p>` : ""}
      <div class="refill-row">
        <span>💊 ${t("refillBody")} <strong>${fmtDate(m.refillDate)}</strong></span>
        <button class="btn small orange" data-action="refill" data-id="${m.id}">${t("refillReorder")}</button>
      </div>
    </div>`).join("");

  return `
    ${card("currentMedicines", list || `<p class="muted-note">${t("none")}</p>`)}
    <form data-form="medicine">
    ${card("addMedicine", `
      ${field("medicineName", select("name", medOpts, medOpts[0].value))}
      ${field("timing", input("timing", "7:00 AM, 7:00 PM"))}
      ${field("dosage", input("dosage", "15 ml with warm water"))}
      ${field("foodTiming", select("food", foodOpts, "before"))}
      ${field("specialInstructions", textarea("instructions", ""))}
      ${button("addMedicineReminder", { action: "add-medicine" })}
    `)}
    </form>`;
}

/* ---------------- 6. REMINDERS (kashayam / external / appointment) ---------------- */
export function reminders() {
  const d = getData();
  const byKind = (kind) => d.reminders.filter((r) => r.kind === kind);
  const rList = (arr) => arr.length
    ? arr.map((r) => row(r.time, r.label, true)).join("")
    : `<p class="muted-note">${t("none")}</p>`;

  return `
    ${card("enableNotifications", `
      <p class="muted-note" id="notif-status"></p>
      ${button("enableNotifications", { action: "enable-notif", cls: "light" })}
    `)}
    ${CLINIC.features.kashayamReminders ? card("kashayamReminders", rList(byKind("kashayam"))) : ""}
    ${CLINIC.features.externalApplication ? card("externalApplication", rList(byKind("external"))) : ""}
    ${card("appointmentReminder", d.appointments.map((a) =>
      row(fmtDate(a.date), a.time, true)).join(""))}`;
}

/* ---------------- 7. PATHYA / APATHYA + ADVICE ---------------- */
export function pathya() {
  const d = getData();
  const pa = d.pathya;
  return `
    <form data-form="pathya">
    ${card("foodsAllowed", chipSelect("allowed",
      PATHYA.map((x) => ({ id: x.id, label: L(x) })), pa.allowed))}
    ${card("foodsAvoid", chipSelect("avoid",
      APATHYA.map((x) => ({ id: x.id, label: L(x) })), pa.avoid))}
    ${card("adviceDo", chipSelect("adviceDo",
      ADVICE.do.map((x) => ({ id: x.id, label: L(x) })), pa.adviceDo))}
    ${card("adviceNotDo", chipSelect("adviceDont",
      ADVICE.dont.map((x) => ({ id: x.id, label: L(x) })), pa.adviceDont))}
    ${button("saveAdvice", { action: "save-pathya" })}
    </form>`;
}

/* ---------------- 8. FOLLOW-UP -> APPOINTMENT ---------------- */
export function followup() {
  const d = getData();
  const f = d.followup;
  const remOpts = [
    { value: "both", label: t("reminderBoth") },
    { value: "day", label: t("reminderDay") },
    { value: "hours", label: t("reminderHours") },
  ];
  return `
    <form data-form="followup">
    ${card("followupAppointment", `
      ${field("followupDate", input("date", f.date, "date"))}
      ${field("followupTime", input("time", f.time, "time"))}
      ${field("reminder", select("reminderMode", remOpts, f.reminderMode))}
      ${button("createAppointment", { action: "create-appointment" })}
    `)}
    </form>`;
}

/* ---------------- 9. REVIEW ---------------- */
export function review() {
  return card("patientReview", `
    <p class="muted-note">${t("reviewText")}</p>
    ${button("googleReview", { cls: "orange", action: "google-review" })}
    ${button("maybeLater", { cls: "light", action: "goto-dashboard" })}`);
}

/* Screen registry: id -> { render, titleKey } */
export const SCREENS = {
  dashboard: { render: dashboard, titleKey: "titleDashboard" },
  visit:     { render: visit,     titleKey: "newPatientVisit" },
  diagnosis: { render: diagnosis, titleKey: "diagnosis", doctorOnly: false },
  treatment: { render: treatment, titleKey: "treatmentPlan" },
  medicine:  { render: medicine,  titleKey: "medicinesIntake" },
  reminders: { render: reminders, titleKey: "remindersTitle" },
  pathya:    { render: pathya,    titleKey: "pathyaApathya" },
  followup:  { render: followup,  titleKey: "followupAppointment" },
  review:    { render: review,    titleKey: "patientReview" },
};
