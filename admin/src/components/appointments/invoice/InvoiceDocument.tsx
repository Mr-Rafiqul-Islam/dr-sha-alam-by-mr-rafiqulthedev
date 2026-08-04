import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
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

type InvoiceDocumentProps = {
  appointment: Appointment;
};

import logo from '../../../assets/01-01.svg';
import footerSwoosh from '../../../assets/02-01.svg';

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1A1A1A",
    paddingBottom: 72,
  },
  header: {
    backgroundColor: "#0F7B70",
    height: 95,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  brandBlock: {
    flexDirection: "column",
    gap: 6,
  },
  brandName: {
    color: INVOICE_COLORS.white,
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
  },
  brandPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: INVOICE_COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  brandSubtitle: {
    color: INVOICE_COLORS.white,
    fontSize: 8,
    letterSpacing: 1.2,
  },
  contactBlock: {
    alignItems: "flex-start",
    gap: 4,
  },
  contactLine: {
    color: INVOICE_COLORS.white,
    fontSize: 8.5,
    textAlign: "left",
  },
  body: {
    paddingHorizontal: 28,
    paddingTop: 22,
    flex: 1,
  },
  title: {
    color: INVOICE_COLORS.primary,
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  },
  metaValue: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: INVOICE_COLORS.primary,
    borderStyle: "dotted",
    paddingBottom: 2,
    fontSize: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: INVOICE_COLORS.border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: INVOICE_COLORS.primary,
  },
  tableHeaderCell: {
    color: INVOICE_COLORS.white,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: INVOICE_COLORS.white,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 24,
    borderTopWidth: 1,
    borderTopColor: INVOICE_COLORS.border,
  },
  tableCell: {
    fontSize: 8.5,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: INVOICE_COLORS.border,
    justifyContent: "center",
  },
  colSl: { width: "8%" },
  colLabel: { width: "34%" },
  colValue: { width: "42%" },
  colAmount: { width: "16%", textAlign: "center", borderRightWidth: 0 },
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
    height: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  footerGraphic: {
    width: 140,
    height: 56,
  },
  signatureBlock: {
    alignItems: "center",
    width: 140,
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
    fontSize: 14,
  },
});

export function InvoiceDocument({ appointment }: InvoiceDocumentProps) {
  const { lineItems, totalAmount } = buildInvoiceLineItems(appointment);

  return (
    <Document title={`Invoice - ${appointment.name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} />

          <View style={styles.contactBlock}>
            <Text style={styles.contactLine}>
              {TRUCARE_INVOICE.phone.value}
            </Text>
            <Text style={styles.contactLine}>
              {TRUCARE_INVOICE.website.value}
            </Text>
            <Text style={styles.contactLine}>
              {TRUCARE_INVOICE.email.value}
            </Text>
            <Text style={styles.contactLine}>
              {TRUCARE_INVOICE.address.value}
            </Text>
       
          </View>
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

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colSl]}>SL</Text>
              <Text style={[styles.tableHeaderCell, styles.colLabel]}>
                APPOINTMENT DETAILS
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colValue]}> </Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>
                AMOUNT
              </Text>
            </View>

            {lineItems.map((item) => (
              <View key={item.serial} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colSl]}>{item.serial}</Text>
                <Text style={[styles.tableCell, styles.colLabel]}>{item.label}</Text>
                <Text style={[styles.tableCell, styles.colValue]}>{item.value}</Text>
                <Text style={[styles.tableCell, styles.colAmount]}>{item.amount}</Text>
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
          <Image src={footerSwoosh} style={{
            zIndex: 100,
          }} />
          <View style={styles.signatureBlock}>
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
