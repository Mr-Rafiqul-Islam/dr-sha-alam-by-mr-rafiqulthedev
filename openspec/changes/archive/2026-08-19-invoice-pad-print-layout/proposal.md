## Why

Invoices are printed onto TruCare A5 letterhead pads that already include a branded header. The generated PDF currently draws its own teal header band in the same area, so the two overlap on the printed page. Staff need a pad-print layout that leaves the pre-printed header (and footer band) clear, while still showing the generated header in the on-screen preview.

## What Changes

- Keep the generated teal header band only in the invoice modal preview.
- Omit the generated header when printing onto the pad.
- Add tunable top and bottom insets on the print layout so invoice content sits in the pad's blank middle; values will be iterated until they match the physical pad.
- Raise the PAID seal and signature on the print layout so they do not sit on the pad's pre-printed footer.
- Prevent printing the preview (headered) PDF from the viewer toolbar so pad prints always go through the modal Print action.

## Capabilities

### New Capabilities

- `appointment-invoice`: Appointment invoice preview and pad-print layout, including which branding is shown on screen versus on pre-printed A5 stationery.

### Modified Capabilities

- None

## Impact

- Admin invoice PDF: `InvoiceDocument`, `InvoiceGraphics`, `InvoicePrintModal`, and `constants/invoice`.
- Print path used from the appointment invoice modal.
- No API, database, or public website changes.
- On-screen preview still shows branding; physical pad prints do not.
