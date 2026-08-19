import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  INVOICE_COLORS,
  INVOICE_PAGE_SIZE,
  PAD_PRINT_BOTTOM_INSET_PT,
  PAD_PRINT_SIGNATURE_BOTTOM_PT,
  PAD_PRINT_TOP_INSET_PT,
  TRUCARE_INVOICE,
} from "../../../constants/invoice";
import type { Appointment } from "../../../types/appointment";
import {
  buildInvoiceLineItems,
  formatInvoiceDate,
  formatInvoicePatientName,
} from "../../../utils/invoice";
import { InvoiceHeaderBand, InvoiceWatermark } from "./InvoiceGraphics";

export type InvoiceDocumentVariant = "preview" | "print";

type InvoiceDocumentProps = {
  appointment: Appointment;
  variant?: InvoiceDocumentVariant;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#1A1A1A",
    position: "relative",
  },
  header: {
    width: "100%",
  },
  watermarkWrap: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 254,
    height: 282,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 64,
    flex: 1,
  },
  title: {
    color: INVOICE_COLORS.primary,
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  metaField: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: INVOICE_COLORS.primary,
  },
  metaValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.primary,
    borderStyle: "dotted",
    paddingBottom: 1,
    fontSize: 8,
  },
  itemsSection: {
    marginTop: 2,
  },
  itemsHeader: {
    flexDirection: "row",
    backgroundColor: INVOICE_COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  itemsHeaderCell: {
    color: INVOICE_COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textTransform: "uppercase",
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 18,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.borderMuted,
  },
  itemsCell: {
    fontSize: 7.5,
  },
  colSl: { width: "8%" },
  colLabel: { width: "34%" },
  colValue: { width: "42%" },
  colAmount: { width: "16%", textAlign: "center" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  totalLabelBox: {
    backgroundColor: INVOICE_COLORS.primary,
    paddingVertical: 6,
    minWidth: 96,
    justifyContent: "center",
    alignItems: "center",
  },
  totalLabel: {
    color: INVOICE_COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  totalValueBox: {
    borderWidth: 1,
    borderColor: INVOICE_COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 64,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  signatureBlock: {
    position: "absolute",
    right: 24,
    bottom: 12,
    alignItems: "center",
    width: 140,
  },
  paidSealLabel: {
    color: "#166534",
    fontFamily: "Times-Roman",
    fontWeight: "bold" as const,
    fontSize: 18,
    marginBottom: 2,
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.primary,
    borderStyle: "dotted",
    marginBottom: 4,
  },
  signatureLabel: {
    color: INVOICE_COLORS.primary,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textAlign: "center",
  },
  printBody: {
    paddingTop: PAD_PRINT_TOP_INSET_PT,
    paddingBottom: PAD_PRINT_BOTTOM_INSET_PT,
  },
  printFooter: {
    height: PAD_PRINT_BOTTOM_INSET_PT,
  },
  printSignatureBlock: {
    bottom: PAD_PRINT_SIGNATURE_BOTTOM_PT,
  },
});

export function InvoiceDocument({
  appointment,
  variant = "preview",
}: InvoiceDocumentProps) {
  const { lineItems, totalAmount } = buildInvoiceLineItems(appointment);
  const isPrint = variant === "print";

  return (
    <Document title={`Invoice - ${appointment.name}`}>
      <Page size={INVOICE_PAGE_SIZE} style={styles.page}>
        <View style={styles.watermarkWrap} fixed>
          <InvoiceWatermark />
        </View>

        {isPrint ? null : (
          <View style={styles.header}>
            <InvoiceHeaderBand />
          </View>
        )}

        <View style={isPrint ? [styles.body, styles.printBody] : styles.body}>
          <Text style={styles.title}>INVOICE</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaField}>
              <Text style={styles.metaLabel}>Name:</Text>
              <Text style={styles.metaValue}>
                {formatInvoicePatientName(appointment)}
              </Text>
            </View>
            <View style={[styles.metaField, { flex: 0.55 }]}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text style={styles.metaValue}>
                {formatInvoiceDate(appointment.appointmentDate)}
              </Text>
            </View>
          </View>

          <View style={styles.itemsSection}>
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemsHeaderCell, styles.colSl]}>SL</Text>
              <Text style={[styles.itemsHeaderCell, styles.colLabel]}>
                APPOINTMENT DETAILS
              </Text>
              <Text style={[styles.itemsHeaderCell, styles.colValue]}> </Text>
              <Text style={[styles.itemsHeaderCell, styles.colAmount]}>
                AMOUNT
              </Text>
            </View>

            {lineItems.map((item) => (
              <View key={item.serial} style={styles.itemsRow}>
                <Text style={[styles.itemsCell, styles.colSl]}>{item.serial}</Text>
                <Text style={[styles.itemsCell, styles.colLabel]}>{item.label}</Text>
                <Text style={[styles.itemsCell, styles.colValue]}>{item.value}</Text>
                <Text style={[styles.itemsCell, styles.colAmount]}>{item.amount}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <View style={styles.totalLabelBox}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT :</Text>
            </View>
            <View style={styles.totalValueBox}>
              <Text style={styles.totalValue}>{totalAmount}</Text>
            </View>
          </View>
        </View>

        <View style={isPrint ? [styles.footer, styles.printFooter] : styles.footer} fixed>
          <View
            style={
              isPrint
                ? [styles.signatureBlock, styles.printSignatureBlock]
                : styles.signatureBlock
            }
          >
            <Text style={styles.paidSealLabel}>
              {TRUCARE_INVOICE.paidSealLabel}
            </Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>
              {TRUCARE_INVOICE.signatureLabel}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
