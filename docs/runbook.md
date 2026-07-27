# Runbook

## Webhook subscription disabled
Meta disables a subscription after repeated non-200 responses or timeouts.
Symptom: inbound messages stop entirely.
1. Check `webhook_events` for a gap.
2. Meta App dashboard, Webhooks, re-subscribe the page.
3. Confirm the endpoint returns 200 within 2s. Never do work in the request
   handler — dedupe and enqueue only.

## Bot replying after a human did
Handover Protocol is out of sync. Set `conversations.control = 'human'` for the
affected thread and check the thread control pass in the messenger module.

## Guardrail firing constantly
`kb_entries.numeric_facts` is probably missing a legitimate number (a new price
or delivery fee). Add it to the knowledge base rather than loosening the check.

## Kill switch
`UPDATE tenants SET auto_send_enabled = false WHERE id = '...';`
Every draft reverts to human approval immediately. Use this the moment a wrong
answer reaches a customer; investigate afterwards.

## Suspected cross-tenant leak
1. Stop the API.
2. `pnpm --filter @orderpilot/db test:rls` — confirm the isolation suite fails.
3. Query `audit_events` for the actor and time range.
4. Do not resume until the suite passes.
