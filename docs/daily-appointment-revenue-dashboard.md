# Daily Appointment & Revenue Dashboard

## Purpose

The Daily Appointment & Revenue Dashboard gives Dr. Shah Alam admin staff a same-day view of:

- Appointment volume by status
- Attendance rate
- Category-wise booked and attended counts
- Attendance-based expected collection (calculated revenue)

This module is designed for `SiteRef.DOCTOR_SHA_ALAM`.

## Important limitation

Calculated revenue is **attendance-based expected collection**, not audited payment settlement. Revenue is computed as:

`attended appointments × configured category fee`

The current appointment records do not provide a complete cash ledger for every attended patient. Payment reconciliation is intentionally out of scope.

## Category mapping

| Slot code | Category key | Label |
|-----------|--------------|-------|
| `P-9` | `NEW_PLID` | New PLID Patient |
| `OP-4` | `OLD_PLID` | Old PLID Patient |
| `G-5` | `GENERAL` | General Patient |
| unknown / legacy label | `OTHER` | Other |

Resolution rules:

1. Use `appointment.slot.code` when the slot relation exists
2. Otherwise fall back to `preferredTime` when it matches a known slot code
3. Unknown values are counted under `OTHER` with fee/revenue `0`

## Status rules

### Booked

`PENDING + CONFIRMED + ATTEND`

### Attended

`ATTEND` only

### Excluded from booked/revenue

- `CANCEL`
- `RESCHEDULED`

These statuses are still counted separately and included in `totalAppointments`.

### Attendance rate

`booked > 0 ? round((attended / booked) × 100, 2) : 0`

## Revenue formula

Per category:

`categoryRevenue = attendedCount × configuredCategoryFee`

Total:

`totalRevenue = sum(categoryRevenue for NEW_PLID, OLD_PLID, GENERAL)`

`OTHER` always contributes `0` revenue.

## API endpoints

All routes require admin auth and the `appointments` permission.

### Summary

```http
GET /api/v1/admin/appointment-revenue/summary?date=YYYY-MM-DD&siteRef=DOCTOR_SHA_ALAM
```

- `date` optional; defaults to today in `Asia/Dhaka`
- `siteRef` optional; defaults to `DOCTOR_SHA_ALAM`

### Get fees

```http
GET /api/v1/admin/appointment-revenue/fees?siteRef=DOCTOR_SHA_ALAM
```

### Update fees

```http
PATCH /api/v1/admin/appointment-revenue/fees
Content-Type: application/json

{
  "siteRef": "DOCTOR_SHA_ALAM",
  "fees": {
    "NEW_PLID": 0,
    "OLD_PLID": 0,
    "GENERAL": 0
  }
}
```

Fee validation:

- required
- numeric
- minimum `0`
- maximum `1,000,000`
- maximum two decimal places

## Fee configuration

Fees are stored in `AppointmentRevenueFee` using Prisma `Decimal(10, 2)`.

Seed defaults come from environment variables:

- `NEW_PLID_APPOINTMENT_FEE`
- `OLD_PLID_APPOINTMENT_FEE`
- `GENERAL_APPOINTMENT_FEE`

When unset or invalid, seed uses `0`.

Admins can also update fees from the dashboard **Configure Fees** action.

## Bangladesh timezone behavior

Business timezone: `Asia/Dhaka`

For a selected calendar date, the API queries:

```text
appointmentDate >= startOfDayUtc
appointmentDate < nextDayStartUtc
```

The response returns the selected business date unchanged as `YYYY-MM-DD`.

Note: existing appointment day list APIs still use server-local day boundaries. The revenue dashboard is the authoritative Dhaka-day view for this feature.

## Pending delete alignment

Revenue summary excludes appointments hidden from admin appointment lists when the current admin role uses pending-delete hiding. This keeps dashboard counts aligned with what staff see elsewhere.

## Migration steps

From `server/`:

```bash
npm run prisma:migrate:deploy
npm run prisma:seed
npm run prisma:generate
```

For local development:

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

## Testing steps

From `server/`:

```bash
npm test
npm run build
npx prisma format
npx prisma validate
npm run prisma:generate
npm run prisma:migrate:status
```

From `admin/`:

```bash
npm run build
npm run lint
```

## Environment variables

Add to `server/.env` as needed:

```env
NEW_PLID_APPOINTMENT_FEE=0
OLD_PLID_APPOINTMENT_FEE=0
GENERAL_APPOINTMENT_FEE=0
```

See also [`server/.env.example`](../server/.env.example).
