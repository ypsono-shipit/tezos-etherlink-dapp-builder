# Tezos X Builders’ Club and dApp Builder skill

The marketing site for the Tezos X Builders’ Club, plus the Tezos / Etherlink / Tezos X agent skill. Vite, React, TypeScript, and Tailwind. Deployed on Vercel.

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/nac` | Native atomic composability, quickstart, FAQ |
| `/usecases` | Twelve ideas, filterable |
| `/claude` | Claude perk application |
| `/partners` | Partnership application |
| `/resources` | Curated library |
| `/builder` | Existing dApp Builder (install command, skill index) |

`vercel.json` rewrites every non API path to `index.html` so deep links work. `/api/*` stays on the serverless functions.

## Scripts

```bash
npm install
npm run dev          # site + local /api
npm run build        # tsc, vite build, palette check, copy check
npm run test:forms   # validation, honeypot, rate limit
npm run preview
```

`npm run check` fails if built or source files use a color outside black, grey, white, and blue, or if rendered copy contains a hyphen, en dash, em dash, or an in app route such as `/claude`. Technical values inside `code`, `pre`, or `.mono` may contain hyphens (URLs, addresses, package names). Button and link labels never show a route path.

## Forms

`/claude` and `/partners` validate in the browser and again in `api/claude-apply.ts` and `api/partner-apply.ts`.

- Wallet: `0x` plus 40 hex characters, or `tz1`/`tz2`/`tz3` plus 33 base58 characters
- Email, X handle, required text, consent
- Partners: company or individual (org required only for a company), partnership type multi select, optional website
- Hidden honeypot field `company_fax`. A filled honeypot returns success and stores nothing
- Rate limit: 5 posts per 10 minutes per IP hash per form. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to share the window across instances. Otherwise each instance keeps its own memory
- IP addresses are stored only as a SHA 256 hash. Set `IP_HASH_SALT`

### Storage is not chosen yet

`FORM_STORAGE` picks the adapter in `api/_lib/storage.ts`. The default is `log`: the function prints the submission and does not persist it. `noop` accepts it and discards the payload. Do not put secrets in the repo. Copy `.env.example`.

**Google Sheets** (`FORM_STORAGE=sheets`)

1. Create a spreadsheet with tabs `claude_applications` and `partner_applications` (or set `GOOGLE_SHEETS_CLAUDE_TAB` / `GOOGLE_SHEETS_PARTNER_TAB`).
2. Share it with a Google service account that can edit.
3. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (PEM, newlines as `\n`), and `GOOGLE_SHEETS_ID`.
4. The function appends one row. Header row, in order:
   - Claude: id, wallet, wallet_type, email, x_handle, build_idea, prior_work, created_at, ip_hash, status
   - Partner: id, applicant_type, name, org, role, email, x_handle, website, partnership_types, message, created_at, ip_hash, status

**Notion** (`FORM_STORAGE=notion`)

1. Create two databases and share them with an internal integration.
2. Set `NOTION_TOKEN`, `NOTION_CLAUDE_DATABASE_ID`, and `NOTION_PARTNER_DATABASE_ID`.
3. Properties the adapter writes: `Name` (title), `Email` (email), and rich text fields `Wallet`, `WalletType`, `XHandle`, `BuildIdea`, `PriorWork`, `Status` on the Claude database. Partner database: `Name`, `Email`, `ApplicantType`, `Org`, `Role`, `XHandle`, `Website`, `PartnershipTypes`, `Message`, `Status`.
4. Rename those properties in `api/_lib/storage.ts` if your database uses different names.

**Postgres** (`FORM_STORAGE=postgres`)

1. Set `DATABASE_URL` (Neon or any Postgres the `postgres` driver can reach). Localhost skips SSL. Other hosts use `ssl: require`.
2. On the first successful write the function creates `claude_applications` and `partner_applications`.
3. Claude rows are unique on `email` and on `wallet`. Partner rows are unique on `email`. A duplicate returns "This email or wallet is already in the queue." or "This email is already in the queue."
4. Columns match the Sheets list above. `partnership_types` is `text[]`. `status` starts as `received`.

Sheets and Notion do not enforce those unique keys. Add them in the sheet or database if you need the same rule there.

## Skill (`skill/`, v3.0, November 2026)

```
skill/SKILL.md                 decision tree, including Tezos X via NAC
skill/tezos/                   L1. octez.js first, Taquito as an alternative. Shadownet, not Ghostnet
skill/etherlink/               EVM interface, plus a pointer at the Michelson interface
skill/tezos-x/                 Previewnet, NAC, octez.js helpers, counter walkthrough
skill/shared/                  L1 vs Etherlink vs Tezos X, and the L1 bridge
```

The old duplicate files in `skill/references/` were removed. Each file ends with source URLs and the date it was checked.

Install:

```bash
npx skills add https://github.com/ypsono-shipit/tezos-etherlink-dapp-builder
```

## Open items

- Form storage destination is undecided. The default adapter only logs.
- Club dates, tracks, prizes, and the Claude perk terms are still TBC on the site. Nothing was invented for them.
- There are no partners, so the site has no partner names or logos.
- Etherlink Shadownet EVM chain id 127823 and its RPC were not re-read from a live network table (`/network-information` returned 404). Fee constants in `skill/etherlink/references/gas-and-fees.md` were not reconfirmed because the fees page returned an empty body.
- The L1 bridge deposit contract in the bridging guide is the April 2026 address and was not reconfirmed.
- No package named `tx-codec` was found. The skill points at `@tezos-x/octez.js-michel-codec`.
- Ticket issuance is not a club idea on the site. The Michelson compatibility page still lists tickets as not implemented on the Etherlink Michelson interface.
- Ganesha's activation date is from Tezos Spotlight and The Baking Sheet, not from a date line on docs.etherlink.com.
- Turnstile or hCaptcha is not wired. Spam protection is the honeypot plus the rate limit.
