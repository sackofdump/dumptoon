# Supabase Setup

**Status: configured.** `config.js` ships the project URL + publishable (anon) key. To swap projects, edit `config.js` or override locally with `config.local.js` (gitignored).

The remaining manual step is **running `schema.sql`** once in your Supabase project's SQL Editor — that creates the `profiles`, `inventory`, `decks`, and `matches` tables with Row Level Security so each user can only read/write their own rows.

---

The site works without Supabase (state falls back to localStorage), but auth, cross-device wallets, and decks need a real backend. This is a one-time setup.

## 1. Create a project
1. Go to https://supabase.com → **New project**.
2. Pick a region close to you. Set a strong DB password (save it in a password manager).
3. Wait ~2 min for provisioning.

## 2. Get the URL + anon key
In the project: **Settings → API**.
- `Project URL` → goes into `url`.
- `anon public` key → goes into `anonKey`. (NEVER commit the `service_role` key.)

## 3. Configure the site
Copy `config.js` → `config.local.js` and fill in:

```js
window.SUPABASE_CONFIG = {
  url:     'https://YOURPROJECT.supabase.co',
  anonKey: 'eyJhbGciOi...',
};
```

`config.local.js` is gitignored, so your real keys never ship to the public repo.

## 4. Run the schema
**SQL Editor → New query** → paste `schema.sql` → Run. This creates:
- `profiles` — username + coin balance
- `inventory` — owned cards
- `decks` — saved deck lists
- `matches` — match history (for ranking later)

All tables have Row Level Security so a logged-in user can only read/write their own rows.

## 5. Auth settings
**Authentication → Providers → Email**:
- Disable "Confirm email" if you want signup to work without an inbox. Re-enable for production.

**Authentication → URL Configuration → Site URL**:
- Set to wherever you host the site (e.g. `http://localhost:8000` for local dev). Required for magic-link redirects.

## 6. Try it
Open `login.html` and create an account. The header pill should switch from `guest` to your username.
