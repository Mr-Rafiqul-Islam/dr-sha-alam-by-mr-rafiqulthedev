## Context

See `proposal.md` — the Recent Appointments filter bar mixes server-side category filters (`?category=`) with client-side search/date/today filters. Category chips were always visible, causing clutter. Injection and operation (surgery) data already exist on appointments; attendance was only expressible via `ATTEND` vs other statuses.

## Goals / Non-Goals

**Goals:**
- Reduce visible filter controls to Search, Date, Today, Filter, Clear, Refresh.
- Collapse category + extended filters into a Filter dropdown panel with existing toggle styling.
- Add `NOT_ATTENDED` as a first-class status for no-shows.
- Keep category filtering server-side; apply Injection/Surgery/Attended/Not Attended client-side on the fetched list.

**Non-Goals:**
- Server-side query params for injection/surgery/status filters.
- Public/client booking status changes.
- New dashboard stat cards for not-attended counts.
- Bulk migration of existing appointments to NOT_ATTENDED.

## Decisions

### Filter panel UI (portal dropdown)
Use a fixed-position portal panel (same pattern as admin row action menus) anchored below the Filter button. **Alternative:** inline expandable section — rejected because it pushes the table down on mobile.

### Extended filter semantics
Multi-select OR within extended filters; AND between category (server) and extended (client) groups. Matches existing category OR behavior combined with search/date AND.

### NOT_ATTENDED revenue treatment
Count as **booked** but not **attended** in `aggregateAppointmentRevenue`. Keeps attendance rate meaningful (scheduled but didn't show). **Alternative:** separate counter — deferred; not required for filter MVP.

### NOT_ATTENDED seat consumption
Exclude from `SEAT_CONSUMING_STATUSES` — a no-show should not block the slot after being marked. Appointments reach NOT_ATTENDED from PENDING/CONFIRMED via staff action.

### Surgery label vs operationName field
UI label "Surgery"; persisted field remains `operationName`. No schema rename.

## Risks / Trade-offs

- **[Client-side extended filters]** Large appointment lists filter in memory — acceptable for current admin list size; server params can be added later if needed.
- **[Enum migration]** PostgreSQL `ALTER TYPE ADD VALUE` is non-transactional in some setups — run migration during deploy window.
- **[NOT_ATTENDED adoption]** Existing no-shows stay in old statuses until staff update them — no automatic backfill.

## Migration Plan

1. Deploy server with Prisma migration adding `NOT_ATTENDED` to enum.
2. Deploy admin with Filter UI and status option.
3. Staff manually mark historical no-shows as needed.

Rollback: revert admin UI; enum value cannot be removed easily in Postgres — treat rollback as forward-only for status value.
