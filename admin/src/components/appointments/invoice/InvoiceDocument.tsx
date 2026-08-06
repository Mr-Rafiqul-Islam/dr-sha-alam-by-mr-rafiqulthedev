import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  INVOICE_COLORS,
  TRUCARE_INVOICE,
} from "../../../constants/invoice";
import type { Appointment } from "../../../types/appointment";
import {
  buildInvoiceLineItems,
  formatInvoiceDate,
  formatInvoicePatientName,
} from "../../../utils/invoice";
import { InvoiceHeaderBand, InvoiceWatermark } from "./InvoiceGraphics";

type InvoiceDocumentProps = {
  appointment: Appointment;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
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
    width: 360,
    height: 400,
  },
  body: {
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 90,
    flex: 1,
  },
  title: {
    color: INVOICE_COLORS.primary,
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 24,
  },
  metaField: {
    flexDirection: "row",
    alignItems: "flex-end",
    flex: 1,
    gap: 6,
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: INVOICE_COLORS.primary,
  },
  metaValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.primary,
    borderStyle: "dotted",
    paddingBottom: 2,
    fontSize: 10,
  },
  itemsSection: {
    marginTop: 4,
  },
  itemsHeader: {
    flexDirection: "row",
    backgroundColor: INVOICE_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  itemsHeaderCell: {
    color: INVOICE_COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    textTransform: "uppercase",
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 26,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.borderMuted,
  },
  itemsCell: {
    fontSize: 8.5,
  },
  colSl: { width: "8%" },
  colLabel: { width: "34%" },
  colValue: { width: "42%" },
  colAmount: { width: "16%", textAlign: "center" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalLabelBox: {
    backgroundColor: INVOICE_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 120,
  },
  totalLabel: {
    color: INVOICE_COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "right",
  },
  totalValueBox: {
    borderWidth: 1,
    borderColor: INVOICE_COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  signatureBlock: {
    position: "absolute",
    right: 36,
    bottom: 18,
    alignItems: "center",
    width: 180,
  },
  paidSealLabel: {
    color: "red",
    fontFamily: "Times-Roman",
    fontWeight: "bold" as const,
    fontSize: 26,
    marginBottom: 4,
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.primary,
    borderStyle: "dotted",
    marginBottom: 6,
  },
  signatureLabel: {
    color: INVOICE_COLORS.primary,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textAlign: "center",
  },
});

export function InvoiceDocument({ appointment }: InvoiceDocumentProps) {
  const { lineItems, totalAmount } = buildInvoiceLineItems(appointment);

  return (
    <Document title={`Invoice - ${appointment.name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkWrap} fixed>
          <InvoiceWatermark />
        </View>

        <View style={styles.header}>
          <InvoiceHeaderBand />
        </View>

        <View style={styles.body}>
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
              <Text style={styles.totalLabel}>TOTAL AMOUNT:</Text>
            </View>
            <View style={styles.totalValueBox}>
              <Text style={styles.totalValue}>{totalAmount}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.signatureBlock}>
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
