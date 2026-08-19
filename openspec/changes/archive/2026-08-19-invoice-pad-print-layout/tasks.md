## 1. Pad-print constants

- [x] 1.1 Add `PAD_PRINT_TOP_INSET_PT` (80), `PAD_PRINT_BOTTOM_INSET_PT` (90), and `PAD_PRINT_SIGNATURE_BOTTOM_PT` (72) to `admin/src/constants/invoice.ts`

## 2. Invoice document variants

- [x] 2.1 Add `variant: "preview" | "print"` to `InvoiceDocument` (default `"preview"`)
- [x] 2.2 Render `InvoiceHeaderBand` only when `variant` is `"preview"`
- [x] 2.3 Apply pad top/bottom insets and raised signature offset when `variant` is `"print"`; keep current spacing for `"preview"`

## 3. Modal preview and print paths

- [x] 3.1 Pass `variant="preview"` to the modal `PDFViewer` document and set `showToolbar={false}`
- [x] 3.2 Pass `variant="print"` to the document used by the modal Print blob so pad prints omit the header
