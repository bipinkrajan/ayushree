/* =============================================================
 * Supabase connection (patient app).
 * The anon key is PUBLIC by design — safe to ship in the app.
 * Data is protected by the database security rules, and the
 * patient login only ever returns that patient's own record.
 * ============================================================= */
export const SUPABASE = {
  url: "https://foypmgpoupqxesqeamwv.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZveXBtZ3BvdXBxeGVzcWVhbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDY2MDcsImV4cCI6MjA5OTQyMjYwN30.cpcfQfXHNtLolt8XTJKKaaH6zCIWQJqcuXNmmsPukf4",
};
