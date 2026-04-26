/* Supabase config — committed defaults.
   To run locally with real auth, copy this file to config.local.js and fill in
   your Supabase project URL + anon (public) key. config.local.js is gitignored.
   The anon key is safe to expose client-side; Row Level Security in schema.sql
   is what actually protects user data. NEVER commit the service_role key. */
window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url:     '',  // e.g. 'https://xyzcompany.supabase.co'
  anonKey: '',  // e.g. 'eyJhbGciOi...'
};
