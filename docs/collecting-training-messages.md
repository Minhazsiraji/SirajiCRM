# Collecting ~200 real messages (the AI's training data)

**Why this matters:** the AI has to read real customer messages — Bangla script,
romanised Banglish, English, and messy mixes — and pull out the address, phone,
quantity, and intent. If we build that on guesses, it will confidently book
undeliverable parcels. Real messages from your actual seller are the difference
between a bot that works and one that quietly loses money.

**We do NOT need perfection.** ~150–200 real customer messages is plenty to
start. Variety matters more than volume.

---

## ⚠️ Privacy first

These messages contain real customer names, phone numbers, and addresses.
- Keep the file **private** (a private Google Sheet or your own computer).
- **Do not** post it publicly, in a GitHub issue, or paste it into a public chat.
- It's completely fine to use it to build your own tool — that's its purpose.
- You can share it with me here privately when the time comes; if you'd rather,
  you can **blank out the last 3 digits** of phone numbers — we still learn the
  format without the full number.

---

## Method A — Manual copy (start today, no app needed)

The most reliable way, and you can do it right now.

1. Open **business.facebook.com** → your Page → **Inbox** (or the Meta Business
   Suite Inbox).
2. Make a **Google Sheet** with these columns:

   | # | customer_message | seller_reply | correct_phone | correct_address | notes |
   |---|------------------|--------------|---------------|-----------------|-------|

3. Go through recent conversations and, for each, copy:
   - **customer_message** — the customer's words, exactly as written (keep the
     Bangla/Banglish, don't translate or clean it — the mess is the point).
   - **seller_reply** — how the seller answered (optional but very useful).
   - **correct_phone / correct_address** — fill these only where the customer
     actually gave them; this becomes the "answer key" the AI is graded against.
   - **notes** — anything odd (a complaint, a joke, an unclear address).

4. Aim for **~150–200 rows**, then **File → Download → CSV**.

### Prioritise VARIETY — try to include some of each:
- [ ] Price questions ("dam koto", "koto?", "price kt")
- [ ] Delivery questions ("dhaka er baire koto", "kobe pabo")
- [ ] Cash-on-delivery questions ("cash on delivery ache?")
- [ ] **Addresses written in Banglish** ← the hardest and most important
- [ ] Addresses in Bangla script
- [ ] Order confirmations ("ami nibo", "order korlam")
- [ ] Complaints / returns ("vhalo na", "ferot")
- [ ] Short/unclear messages ("ei ta", "hmm")

The weird and messy ones are the **most** valuable — they're exactly where a
naive bot fails.

---

## Method B — Pull them with the Graph API (cleaner; I help you)

Once your Meta app exists (Phase 1 of the App Review checklist), you can export
conversations **without** full App Review — in Development mode the app can read
the Page's own conversations for admins.

- You (as Page admin) generate a Page Access Token.
- We use Meta's **Graph API Explorer** (or a tiny script) to pull the last ~200
  conversations and their messages into a clean file.

This is faster and structured, but it needs the app created first. When you've
done Phase 1, tell me and I'll give you the exact steps and a script.

---

## What to send me when you're done

Just the CSV (privacy-trimmed if you prefer). I'll use it to:
1. Build the extraction "answer key" so we can measure how often the AI reads an
   address correctly, **before** trusting it with real orders.
2. Tune the prompts for Banglish specifically.

Start with Method A whenever you have an hour — it needs nothing but the inbox
and a spreadsheet.
