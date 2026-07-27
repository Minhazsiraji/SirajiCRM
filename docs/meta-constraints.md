# Meta platform constraints

Read this before building any messaging feature. These rules are not
suggestions — violating them gets the app restricted or the page banned, and
recovery is slow and manual.

## Messenger

**Permissions needed:** `pages_messaging`, `pages_manage_metadata`,
`pages_read_engagement`, `pages_show_list`. `human_agent` if you want the
7-day handover window.

**Blockers to start on day one:**
- Business Verification (documents, can take days)
- App Review for `pages_messaging` (you cannot message non-admins until it passes)

**The 24-hour window.** Free-form replies for 24 hours after the customer's
last inbound message. Outside it, only message tags:

| Tag | Legitimate use here |
| --- | --- |
| `POST_PURCHASE_UPDATE` | order confirmed, dispatched, out for delivery |
| `CONFIRMED_EVENT_UPDATE` | scheduled delivery reminder |
| `ACCOUNT_UPDATE` | rarely applicable |

**Not permitted by any tag:** "still interested?", "we have stock",
"limited stock remaining", reorder reminders, any promotion. If a plan requires
these on Messenger, the plan is wrong. Capture WhatsApp opt-in during the live
conversation and send them there as an approved marketing template.

**Comment to private reply.** Subscribe to the `feed` webhook field. On a new
comment you may send exactly **one** private reply, and it opens the 24-hour
window. This is the highest-leverage feature in the product for a seller running
boosted posts. Also like and publicly reply to the comment — the public reply is
social proof for everyone else scrolling the ad.

**Handover Protocol.** If the seller also opens Page Inbox on their phone, both
they and the bot will reply. Implement thread control: pass control to Page
Inbox when a human takes over, take it back on resolve.

## WhatsApp Cloud API

**Setup:** Business Manager → WhatsApp Business Account → phone number →
display name approval.

**Same 24-hour service window.** Outside it, only pre-approved templates,
categorised marketing / utility / authentication. Draft and submit templates in
week one; approval is not instant and marketing categories get rejected for
vague or promotional wording.

**Opt-in is required for marketing templates.** Capture it explicitly during the
Messenger conversation and store `consent_wa_marketing` and `consent_at` on the
contact. Keep the message that granted it.

## Verify before you commit to unit economics

WhatsApp pricing and template category rules have changed repeatedly. Check
current rates against Meta's developer docs before modelling margins — do not
rely on any figure written down here or anywhere else.
