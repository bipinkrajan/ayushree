/* =============================================================
 * CLINIC CONFIG  —  EDIT THIS FILE TO RE-BRAND FOR A NEW CLINIC
 * -------------------------------------------------------------
 * This is the ONLY file you must change to turn the Ayushree app
 * into a white-label app for any other Ayurveda clinic (SaaS).
 * Nothing here is hard-coded elsewhere in the app.
 * ============================================================= */

export const CLINIC = {
  /* ---- Identity ---- */
  id: "ayushree",
  name: {
    en: "Ayushree Ayurvedic Hospital",
    ml: "ആയുഷ്രീ ആയുര്‍വേദ ആശുപത്രി",
  },
  tagline: {
    en: "Ayurvedic Clinic",
    ml: "ആയുര്‍വേദിക് ക്ലിനിക്",
  },

  /* ---- Logo (path relative to app root) ---- */
  logo: "assets/logo.svg",

  /* ---- Doctors ---- */
  doctors: [
    { id: "dr-krishna", name: "Dr Krishna Chandran G", specialty: "Ayurveda Physician" },
  ],
  defaultDoctorId: "dr-krishna",

  /* ---- OP Number format ----
   * {PREFIX}-{YEAR}-{SEQ}. Change prefix / padding per clinic. */
  opNumber: {
    prefix: "AY-OP",
    seqPadding: 5,      // 00125
    example: "AY-OP-2026-00125",
  },

  /* ---- Contact ---- */
  contact: {
    phone: "+91 90000 00000",
    whatsapp: "+91 90000 00000",
    address: {
      en: "Karunagappally, Kerala",
      ml: "കരുനാഗപ്പള്ളി, കേരളം",
    },
    mapUrl: "https://maps.google.com/?q=Ayushree+Ayurvedic+Hospital",
  },

  /* ---- Google Review link ----
   * Replace with the clinic's real Google review URL.
   * Get it from Google Business Profile → "Get more reviews". */
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=REPLACE_WITH_PLACE_ID",

  /* ---- Theme colours (also mirrored as CSS variables) ---- */
  theme: {
    green: "#245b35",
    green2: "#3f7a45",
    light: "#f4f8ef",
    cream: "#fff9ed",
    orange: "#d9822b",
    text: "#1d2b1f",
    muted: "#697566",
    border: "#dce8d5",
  },

  /* ---- Feature flags (turn modules on/off per clinic) ---- */
  features: {
    kashayamReminders: true,
    externalApplication: true,
    medicineRefill: true,
    googleReview: true,
    languages: ["en", "ml"],
  },
};

/* Apply theme colours to CSS variables at runtime */
export function applyTheme(theme = CLINIC.theme) {
  const root = document.documentElement.style;
  root.setProperty("--green", theme.green);
  root.setProperty("--green2", theme.green2);
  root.setProperty("--light", theme.light);
  root.setProperty("--cream", theme.cream);
  root.setProperty("--orange", theme.orange);
  root.setProperty("--text", theme.text);
  root.setProperty("--muted", theme.muted);
  root.setProperty("--border", theme.border);
}
