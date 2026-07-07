/* =============================================================
 * STORE — localStorage-backed demo data layer
 * -------------------------------------------------------------
 * In Phase 2 this file is the single place to swap localStorage
 * for a real API (Firebase / Supabase / custom backend).
 * Every screen reads/writes through get()/save() only.
 * ============================================================= */

const LS_DATA = "ayushree.data.v1";
const LS_ROLE = "ayushree.role";

/* ---------- Sample / seed patient record ---------- */
function seed() {
  return {
    patient: {
      opNumber: "AY-OP-2026-00125",
      name: "Ravi Kumar",
      age: 46,
      gender: "Male",
      mobile: "+91 98765 43210",
      address: "Karunagappally, Kerala",
      referredBy: "Existing patient",
      joined: "2026-07-06",
      lastVisit: "2026-07-06",
    },
    currentIssue: {
      issue: "Lower back pain",
      history: "Pain for 3 months, increases while sitting long hours.",
      previousTreatment: "Painkiller used occasionally. Physiotherapy for 2 weeks.",
      otherIssues: ["acidity", "sleep"], // ids from libraries.HEALTH_ISSUES
    },
    diagnosis: {
      text: "Vata-related lower back pain with digestive imbalance.",
      notes: "Recommend 30-day course with kashayam, external oil application and diet control.",
      sharedWithPatient: false, // doctor-only unless true
    },
    treatment: {
      by: "Dr Krishna Chandran G",
      name: "Back Pain Ayurveda Care Plan",
      durationDays: 30,
      startDate: "2026-07-06",
      instructions: "Abhyangam twice weekly. Avoid heavy lifting.",
    },
    medicines: [
      {
        id: "m1", name: "Kashayam", type: "kashayam",
        timing: "7:00 AM, 7:00 PM", dosage: "15 ml with warm water",
        food: "before", instructions: "Take daily without missing. Shake bottle before use.",
        refillDate: "2026-07-18",
      },
      {
        id: "m2", name: "Dhanwantharam Thailam", type: "thailam",
        timing: "8:00 PM", dosage: "Apply on lower back",
        food: "after", instructions: "Warm the oil slightly before applying.",
        refillDate: "2026-07-25",
      },
    ],
    pathya: {
      allowed: ["warm-food", "kanji", "veg", "cumin-water"],
      avoid: ["cold", "curd-night", "fried", "bakery"],
      adviceDo: ["walk", "posture", "warm-water"],
      adviceDont: ["no-lift", "no-sit", "no-late"],
    },
    followup: {
      date: "2026-07-20",
      time: "10:30",
      reminderMode: "both",
    },
    appointments: [
      { id: "a1", date: "2026-07-20", time: "10:30", type: "followup", status: "upcoming" },
    ],
    reminders: [
      { id: "r1", time: "07:00", label: "Kashayam", kind: "kashayam" },
      { id: "r2", time: "13:00", label: "Tablet after food", kind: "medicine" },
      { id: "r3", time: "20:00", label: "Apply oil", kind: "external" },
    ],
    progress: { completedDays: 8 }, // day 8 of 30

    /* ---- Ads / promotions (hospital editable) ----
     * Each flyer: bilingual title/body, an optional badge, and a
     * theme colour for the banner. Patients can share any flyer. */
    ads: [
      {
        id: "ad1", color: "#245b35",
        badge: { en: "Offer", ml: "ഓഫര്‍" },
        title: { en: "Panchakarma Detox Package", ml: "പഞ്ചകര്‍മ്മ ഡിറ്റോക്സ് പാക്കേജ്" },
        body: {
          en: "20% off the 21-day seasonal detox this month. Book your consultation today.",
          ml: "ഈ മാസം 21 ദിവസത്തെ സീസണല്‍ ഡിറ്റോക്സിന് 20% ഇളവ്. ഇന്ന് തന്നെ ബുക്ക് ചെയ്യൂ.",
        },
      },
      {
        id: "ad2", color: "#d9822b",
        badge: { en: "New", ml: "പുതിയത്" },
        title: { en: "Free Wellness Check Camp", ml: "സൗജന്യ വെല്‍നസ് ചെക്ക് ക്യാമ്പ്" },
        body: {
          en: "Free pulse diagnosis and diet advice this Sunday, 9 AM – 1 PM at the clinic.",
          ml: "ഈ ഞായറാഴ്ച രാവിലെ 9 മുതല്‍ ഉച്ചക്ക് 1 വരെ സൗജന്യ നാഡീ പരിശോധനയും ഭക്ഷണ ഉപദേശവും.",
        },
      },
      {
        id: "ad3", color: "#3f7a45",
        badge: { en: "Tip", ml: "ടിപ്പ്" },
        title: { en: "Monsoon Immunity Kashayam", ml: "മഴക്കാല പ്രതിരോധ കഷായം" },
        body: {
          en: "Boost immunity this monsoon with our herbal kashayam. Ask at the counter.",
          ml: "ഈ മഴക്കാലത്ത് ഞങ്ങളുടെ ഹെര്‍ബല്‍ കഷായത്തിലൂടെ പ്രതിരോധശേഷി വര്‍ധിപ്പിക്കൂ.",
        },
      },
    ],
  };
}

let cache = null;

export function getData() {
  if (cache) return cache;
  const raw = localStorage.getItem(LS_DATA);
  cache = raw ? JSON.parse(raw) : seed();
  return cache;
}

export function saveData(next) {
  cache = next || cache;
  localStorage.setItem(LS_DATA, JSON.stringify(cache));
  return cache;
}

/* Update one top-level section and persist */
export function update(section, patch) {
  const d = getData();
  d[section] = Array.isArray(patch) ? patch : { ...d[section], ...patch };
  return saveData(d);
}

export function resetDemo() {
  cache = seed();
  localStorage.setItem(LS_DATA, JSON.stringify(cache));
  return cache;
}

/* ---------- Role (patient / doctor) ---------- */
const roleListeners = new Set();
export function getRole() { return localStorage.getItem(LS_ROLE) || "patient"; }
export function setRole(role) {
  localStorage.setItem(LS_ROLE, role);
  roleListeners.forEach((fn) => fn(role));
}
export function onRoleChange(fn) { roleListeners.add(fn); return () => roleListeners.delete(fn); }
export function isDoctor() { return getRole() === "doctor"; }
