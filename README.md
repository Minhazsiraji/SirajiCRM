# OrderPilot

Turns Facebook and WhatsApp messages into delivered, paid orders — and tells the
seller which ad creative actually made money.

Built for single-product COD sellers in Bangladesh. Not a CRM.

---

## The one metric

**Cost per delivered order, by ad creative.** Meta reports cost per message,
which misleads COD sellers: the cheapest creative often pulls impulse orders
that get refused at the door. Everything in this repo exists to produce that
number honestly, and to reduce it.

---

## Prerequisites

- Node 20.11+
- pnpm 9 (`npm i -g pnpm`)
- Docker Desktop
- `cloudflared` or `ngrok` (Meta only delivers webhooks to public HTTPS)
- GitHub CLI (`gh`) if you want the repo created from the terminal

---

## First run

```bash
pnpm install
cp .env.example .env            # macOS / Linux / Cloud Shell
# copy .env.example .env        # Windows CMD

pnpm setup                       # build libs, start postgres+redis, migrate, seed
pnpm dev                         # api on :3001, web on :3000
```

`pnpm setup` is the one-shot equivalent of the four steps below, in order:

```bash
pnpm build:libs                  # compile @orderpilot/shared and @orderpilot/db
pnpm db:up                       # starts postgres + redis (needs Docker)
pnpm db:migrate                  # tables, then RLS, then attribution views
pnpm db:seed                     # one demo tenant + knowledge base
```

Note: it is `pnpm db:up`, not `pnpm up` — the bare word `up` is a reserved
pnpm command (it means "update dependencies"), so the service script is namespaced.

In a second terminal, expose the API so Meta can reach it:

```bash
pnpm tunnel
```

Copy the printed HTTPS URL. In the Meta App dashboard set the callback URL to
`<that-url>/webhooks/messenger` and the verify token to whatever you put in
`META_VERIFY_TOKEN`.

---

## Daily commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | build libs, then api + web with hot reload |
| `pnpm db:up` / `pnpm db:down` | start / stop local postgres and redis |
| `pnpm db:generate` | generate a migration from schema changes |
| `pnpm db:migrate` | apply migrations |
| `pnpm typecheck` | full workspace typecheck |
| `pnpm test` | unit + integration tests |
| `pnpm --filter @orderpilot/db test:rls` | cross-tenant isolation suite |

---

## Layout

```
apps/
  api/     NestJS — webhooks, queues, AI, courier
  web/     Next.js — inbox, orders, ad performance
packages/
  db/      Drizzle schema, migrations, RLS, seeds
  shared/  Zod contracts, phone/address validation, guardrails
infra/     docker-compose for local postgres + redis
docs/      platform constraints, runbook
```

---

## Three rules that are not negotiable

**1. Every query runs inside a tenant context.** Open a transaction, call
`set_config('app.tenant_id', ...)`, then query. Row level security is forced on
every tenant-scoped table — a query without the context returns zero rows rather
than someone else's customers. The CI job `tenant-isolation` fails the build if
this ever breaks.

**2. Every outbound message checks the 24-hour window.** Meta permits free
replies for 24 hours after the customer's last message. Outside that, only a
narrow set of tags applies, and none of them cover "still interested?" or
reorder nudges. `OutboundService` throws rather than silently dropping. Read
`docs/meta-constraints.md` before adding any follow-up feature.

**3. Every AI reply passes the numeric guardrail.** The bot may only state
numbers that appear in the seller's knowledge base. A draft containing any other
number is not sent — it escalates to the human inbox. This is what stops the bot
inventing a discount.

---

## Rollout

Ship in this order. Do not skip step 2.

1. **Weeks 1–2** — Meta app, business verification, App Review submission, WABA
   setup, WhatsApp template drafts. Everything else is blocked on this.
2. **Weeks 3–5** — Webhook intake, unified inbox, manual reply. **No AI.**
   The seller already gets value, and you get real message logs.
3. **Weeks 6–8** — Extraction and drafting, human approval on every send.
   Measure the edit rate per intent.
4. **Weeks 9–10** — Courier booking, COD confirmation, fraud check before
   booking, ad spend sync.
5. **Weeks 11–12** — Auto-send for intents where edit rate is under 10%.
   Reorder nudges over WhatsApp templates.

Baseline `first_reply_seconds` and `return_rate` in week 3, before the AI is on.
Without a before number you cannot prove the product worked.
