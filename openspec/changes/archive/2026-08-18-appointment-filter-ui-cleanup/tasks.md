## 1. Data model

- [x] 1.1 Add `NOT_ATTENDED` to Prisma `AppointmentStatus` enum and create migration
- [x] 1.2 Run `prisma generate` and apply migration

## 2. Server

- [x] 2.1 Handle `NOT_ATTENDED` in appointment status parsing (existing enum set)
- [x] 2.2 Count `NOT_ATTENDED` as booked-not-attended in revenue aggregation
- [x] 2.3 Add serial-modification test coverage for `NOT_ATTENDED`
- [x] 2.4 Confirm `NOT_ATTENDED` excluded from seat-consuming statuses (no code change if already excluded)

## 3. Admin filter UI

- [x] 3.1 Refactor `AppointmentFilters`: keep Search, Date, Today, Clear, Refresh visible
- [x] 3.2 Add Filter button with portal dropdown panel for category + extended toggles
- [x] 3.3 Wire `extraFilters` state and handlers in `AppointmentsPage`
- [x] 3.4 Extend `filterAppointments` for Injection, Surgery, Attended, Not Attended (OR within group)

## 4. Admin status UI

- [x] 4.1 Add `NOT_ATTENDED` to admin `AppointmentStatus` type, labels, badge variant, and status dropdown
- [x] 4.2 Add `AppointmentExtraFilter` type and filter option constants

## 5. Verification

- [x] 5.1 Run server tests
- [x] 5.2 Run admin build
