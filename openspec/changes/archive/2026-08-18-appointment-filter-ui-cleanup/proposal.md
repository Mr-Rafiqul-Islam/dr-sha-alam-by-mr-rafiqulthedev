## Why

The admin Recent Appointments filter bar is crowded: search, date, four category chips, Today's Appointments, Clear, and Refresh all compete for space. Staff also need quick filters for injection, surgery, attended, and not-attended appointments without adding more horizontal clutter. A dedicated **Not Attended** appointment status is needed so staff can record no-shows explicitly instead of leaving appointments in Pending or Confirmed.

## What Changes

- Simplify the visible filter bar: keep **Search**, **Date picker**, **Today's Appointments**, **Filter**, **Clear Filters**, and **Refresh** only.
- Move category chips (General, Old General, PLID New, PLID Old) into a **Filter** dropdown panel with the same multi-select toggle style.
- Add client-side filters in the same panel: **Injection** (`injectionName` set), **Surgery** (`operationName` set), **Attended** (`status === ATTEND`), **Not Attended** (`status === NOT_ATTENDED`).
- Add **`NOT_ATTENDED`** to the `AppointmentStatus` enum (Prisma + API + admin UI) so staff can mark and filter no-shows.
- **BREAKING:** API and admin accept `NOT_ATTENDED` as a valid appointment status value.

## Capabilities

### New Capabilities

- `appointment-list-filters`: Admin appointment list filter bar layout, Filter panel, and client/server filter behavior.
- `appointment-status`: `NOT_ATTENDED` appointment status across persistence, APIs, revenue aggregation, and admin UI.

### Modified Capabilities

- (none)

## Impact

- **Server:** Prisma `AppointmentStatus` enum + migration; `appointmentRevenue` aggregation for NOT_ATTENDED; status parsing on appointment update API.
- **Admin:** `AppointmentFilters` component refactor; `AppointmentsPage` extra filter state; status labels/badges/options; `filterAppointments` extended.
- **Client (public):** No change — status is admin-managed only.
