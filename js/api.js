/* =============================================================
 * API — talks to Supabase over REST (no SDK needed).
 * Patient app only needs the login RPC, which returns the whole
 * read-only bundle for that patient.
 * ============================================================= */
import { SUPABASE } from "../config/supabase.config.js";

async function rpc(fn, body) {
  const res = await fetch(`${SUPABASE.url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE.anonKey,
      "Authorization": "Bearer " + SUPABASE.anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("network");
  return res.json();
}

/* Returns the patient bundle, or throws {code:'invalid'|'network'} */
export async function patientLogin(op, pin) {
  let data;
  try {
    data = await rpc("patient_portal", { p_op: op.trim(), p_pin: pin.trim() });
  } catch (e) {
    const err = new Error("network"); err.code = "network"; throw err;
  }
  if (!data || data.error) { const err = new Error("invalid"); err.code = "invalid"; throw err; }
  return data;
}
