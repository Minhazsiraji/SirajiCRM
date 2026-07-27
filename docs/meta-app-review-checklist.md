# Meta App Review — a plain-English checklist

This is the one thing that gates every customer-facing feature, and it takes
**days to weeks**. Start it now, in parallel with everything else. Nothing here
requires you to touch code.

> Meta changes button names and screens often. If a step below doesn't match
> exactly what you see, the *goal* of the step still holds — find the closest
> equivalent, and check Meta's current docs at
> https://developers.facebook.com/docs/messenger-platform and
> https://developers.facebook.com/docs/whatsapp

---

## Phase 0 — Gather these BEFORE you start (biggest time-savers)

These four are the usual reasons an application stalls. Have them ready.

- [ ] **A Facebook Page** for the business (your shoe-spray seller's page).
- [ ] **A Meta Business Portfolio** (Business Manager) at business.facebook.com —
      create one if the seller doesn't have it.
- [ ] **A public Privacy Policy URL.** App Review *requires* a working link to a
      privacy policy web page. No page = automatic rejection. A simple hosted
      page is fine (even a Google Site or Notion public page).
- [ ] **Business verification documents** — business registration / trade
      licence, utility bill or bank statement with the business name and address.
      If the seller is unregistered, verification is harder; consider registering
      a trade licence, which is inexpensive in Bangladesh.

---

## Phase 1 — Create the app (30 minutes)

- [ ] Go to **developers.facebook.com** → log in → **My Apps** → **Create App**.
- [ ] Choose the **Business** app type.
- [ ] Name it (e.g. "OrderPilot") and link it to your Business Portfolio.
- [ ] On the app dashboard, **Add products** → add **Messenger** and
      **WhatsApp**.

At this point the app is in **Development mode** — it can only message people who
are admins/testers of the app. That's expected for now.

---

## Do you need Business Verification YET? — No.

You can build, test, demo, and collect training messages entirely in the app's
**Development mode**, with **no** Business Verification:

- In Development mode the app can message, and read conversations for, anyone who
  has a **role on the app** (Admin / Developer / Tester) — set at
  developers.facebook.com → your App → **App Roles**. Your own account is already
  an Admin, so you can test immediately with your own Page.
- Note: a **Page manager / Meta Business Suite role is NOT the same** as an app
  role. To let someone test the bot, add them under **App Roles**, not just as a
  Page manager.

Business Verification + full App Review is only required to message the
**general public** (Advanced Access to `pages_messaging`). Defer it until the
product works and you're ready for real customers. Do everything below when you
reach that point — not before.

## Phase 2 — Business Verification (only when going live; runs in the background)

- [ ] In **Business Settings** → **Security Center** (or "Business
      verification") → **Start verification**.
- [ ] Enter the legal business name, address, and phone exactly as they appear on
      your documents.
- [ ] Upload the documents from Phase 0.
- [ ] Complete the confirmation step (Meta sends a code by SMS, call, or email).

This can take several days. **Don't wait on it to do Phases 3–5** — do those in
parallel.

---

## Phase 3 — Connect Messenger to the app (technical, but I do this with you)

You don't do this alone — ping me when you reach it and I'll walk each field.

- [ ] In **Messenger → Settings**, connect the **Facebook Page**.
- [ ] Generate a **Page Access Token** (you'll paste it into the app's config).
- [ ] Set the **Webhook**:
      - Callback URL: the public HTTPS address (we create it with `pnpm tunnel`).
      - Verify token: any long random string (must match `META_VERIFY_TOKEN`).
- [ ] Subscribe to these webhook fields: **messages**, **messaging_postbacks**,
      **message_deliveries**, and **feed** (feed = the comment-to-DM feature).

---

## Phase 4 — Request permissions (the actual "App Review")

You must request these permissions and get each approved:

- [ ] `pages_messaging` — send/receive Page messages **(the critical one)**
- [ ] `pages_manage_metadata` — subscribe to webhooks
- [ ] `pages_read_engagement` — read comments on posts/ads
- [ ] `pages_show_list` — list the Page
- [ ] `human_agent` *(optional)* — the 7-day handover window, only if you use it

For **each** permission, Meta asks for two things:

1. **A clear use-case description.** Vague text is the #1 rejection reason. Say
   exactly what the app does and why it needs the permission. (Sample wording
   below.)
2. **A screencast (screen recording)** showing the feature working end to end
   with a **test user** — customer sends a message on the Page → your app
   receives it and replies. Show the actual flow, not slides.

- [ ] Write the use-case text (use the sample below).
- [ ] Record the screencast (2–3 minutes, clear, no editing tricks).
- [ ] Submit for review.

### Sample use-case text you can adapt for `pages_messaging`

> Our app is a messaging assistant for a small online retailer in Bangladesh. When
> a customer messages the business Facebook Page — usually from a "Send Message"
> ad — the app receives the message, helps the customer with product and delivery
> questions using the seller's own approved information, collects the delivery
> address and phone number for a cash-on-delivery order, and lets the seller's
> staff take over the conversation at any time. `pages_messaging` is required to
> receive these customer messages and send replies within Messenger's standard
> 24-hour messaging window. We do not send promotional or unsolicited messages.

---

## Phase 5 — WhatsApp (do the template step in week one)

- [ ] In **WhatsApp → Getting started**, create or connect a **WhatsApp Business
      Account (WABA)**.
- [ ] Add and **verify a phone number** (one not already on the WhatsApp app).
- [ ] Set the **display name** — this needs Meta approval and can be rejected for
      generic names.
- [ ] **Draft and submit message templates early** — approval is not instant:
      - a **utility** template (e.g. "your order is confirmed / shipped"),
      - a **marketing** template for reorder nudges (keep wording specific, not
        salesy — vague/promotional marketing templates get rejected).

---

## Phase 6 — Go Live

- [ ] Once permissions are approved and business is verified, switch the app from
      **Development** to **Live** mode.
- [ ] Confirm you have **Advanced Access** (not just Standard) for
      `pages_messaging` — Standard only reaches testers.

---

## Top reasons applications get rejected (avoid these)

- No working **privacy policy URL**.
- **Business not verified** before requesting advanced permissions.
- **Screencast** doesn't clearly show the permission in use, or uses a personal
  (non-test) account.
- **Use-case text** is vague or over-promises ("AI marketing automation").
  Describe the concrete customer-service flow instead.
- **Marketing templates** worded like advertisements.

---

## What to hand off vs. what to send me

**Only you can do:** Phases 0, 1, 2, 5 (accounts, documents, business identity,
phone number), and recording the screencast.

**Send me for help:** Phase 3 (webhook wiring) and Phase 4 (I'll draft the
use-case text and tell you exactly what the screencast needs to show, based on
the real flow in this codebase).
