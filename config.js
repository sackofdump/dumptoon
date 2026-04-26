/* Supabase config — committed.
   The "publishable" key (anon key) is designed by Supabase to be exposed in
   client-side code. Row Level Security policies in schema.sql are what actually
   protect user data. NEVER commit the service_role key.
   For per-developer overrides, create config.local.js (gitignored). */
window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
  url:     'https://ogvvgbfgjfofacpuovce.supabase.co',
  anonKey: 'sb_publishable_jcqvS0RUu2uRB1KWaPe2sQ_rOtmXcr8',
};
