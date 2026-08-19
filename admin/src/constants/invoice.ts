export const INVOICE_COLORS = {
  primary: "#1A7567",
  header: "#0C7564",
  mint: "#A0C9C1",
  accent: "#81C67D",
  white: "#FFFFFF",
  border: "#1A7567",
  borderMuted: "#e9fffb",
  watermarkGreen: "#81c98a",
  watermarkTeal: "#0c7564",
  watermarkTealOpacity: 0.10,
} as const;

export const TRUCARE_INVOICE = {
  brandName: "TruCare",
  brandSubtitle: "DIAGNOSTIC CENTRE",
  phone: {
    icon: "📞",
    value: "09613668866",
  },
  website: {
    icon: "🌐",
    value: "trucarediagnosticcentre.com"
  },
  email: {
    icon: "✉️",
    value: "help@trucarediagnosticcentre.com"
  },
  address: {
    icon: "📍",
    value: "Siddique Tower, 49 Mohakhali, Dhaka."
  },
  paidSealLabel: "PAID",
  signatureLabel: "Trucare Diagnostic Center",
} as const;

export const INVOICE_PAGE_SIZE = "A5" as const;
export const INVOICE_TABLE_ROW_COUNT = 10;

/** Blank top of the pad-print PDF so content clears the pre-printed header. Tweak and reprint. */
export const PAD_PRINT_TOP_INSET_PT = 80;
/** Blank bottom of the pad-print PDF so items clear the pre-printed footer. Tweak and reprint. */
export const PAD_PRINT_BOTTOM_INSET_PT = 90;
/** Distance of the PAID seal/signature from the bottom edge on pad print. Tweak and reprint. */
export const PAD_PRINT_SIGNATURE_BOTTOM_PT = 72;
