## What changed

## Checks
- [ ] No query touches a tenant-scoped table without an open `app.tenant_id`
- [ ] Any new outbound message path checks `windowExpiresAt` before sending
- [ ] Any new AI output path runs through the numeric guardrail
- [ ] No secrets added to committed files
