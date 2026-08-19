## Context

See proposal.md for why. Appointment invoices are A5 PDFs from `@react-pdf/renderer`. `InvoiceDocument` is used both in the modal `PDFViewer` and in the Print button's `pdf().toBlob()` path, so both currently share one layout with `InvoiceHeaderBand` at the top and a signature block 12pt from the bottom.

Pad-print insets will be guessed and reprinted until they match the physical A5 pad. Exact millimetre fit is not a design-time measurement.

## Goals / Non-Goals

**Goals:**
- One document component with two variants so preview and print cannot drift in body fields.
- Named pad-print offsets in `constants/invoice.ts` so matching the pad is a constant tweak, not a layout rewrite.
- Preview-only header; print-only extra top/bottom clearance and a raised signature.

**Non-Goals:**
- Changing invoice line items, totals, watermark, or page size.
- Pixel-perfect pad alignment on the first print.
- A settings UI for margins.
- Removing the PAID seal or signature.

## Decisions

### 1. `variant: "preview" | "print"` on `InvoiceDocument`

Pass `variant` into the same document used by preview and print.

- `"preview"`: render `InvoiceHeaderBand`; keep current body/signature spacing so the modal still looks like a branded invoice.
- `"print"`: omit `InvoiceHeaderBand`; apply pad insets and a higher signature offset.

`InvoicePrintModal` preview uses `"preview"`. The Print button builds the blob with `"print"`.

**Alternative considered:** Two document components. Rejected — body fields would duplicate and drift.

**Alternative considered:** CSS `@media print`. Rejected — this is react-pdf, not HTML print.

### 2. Named pad-print constants

Add to `admin/src/constants/invoice.ts`:

- `PAD_PRINT_TOP_INSET_PT` — starting **80** (slightly above the current ~74pt header band)
- `PAD_PRINT_BOTTOM_INSET_PT` — starting **90**
- `PAD_PRINT_SIGNATURE_BOTTOM_PT` — starting **72** (preview stays at 12)

Print body `paddingTop` / `paddingBottom` and signature `bottom` read these values. Staff reprint after changing the three numbers.

**Alternative considered:** Reuse the generated header height as the print top inset. Rejected — pad header height may not match the SVG band; independent constants are easier to try.

### 3. Hide the PDF viewer toolbar

Set `PDFViewer` `showToolbar={false}`. That removes the pdf.js print (and download) controls so a headered preview cannot be printed from the iframe.

The modal Print button remains the only print path.

**Trade-off:** Preview download also disappears. Acceptable — the spec requires blocking preview print, and download is not required.

**Alternative considered:** Keep the toolbar and document “use Print”. Rejected — easy to print the wrong layout.

### 4. Watermark stays on both variants

The faint bottom-right watermark is not pad letterhead. Leave it unless a later print shows a clash.

## Risks / Trade-offs

- [First-print insets miss the pad] → Starting values are guesses; changing three constants and reprinting is the matching loop.
- [Preview body sits higher than print body] → Preview keeps the header; print uses a possibly different top inset. Body position will not match 1:1. Accepted so preview still shows branding.
- [Hiding the toolbar also hides download] → Modal Print is enough for clinic use.
- [Printer scale-to-fit still misaligns] → Page stays A5; staff should print at 100% / actual size. Out of app control.

## Migration Plan

Frontend-only. Deploy the admin app. No data or API migration. Rollback is reverting the invoice layout files; preview and print return to a single headered layout.
