import type { ReactNode } from "react";
import { Badge, Button, Modal } from "../common";
import type { Appointment } from "../../types/appointment";
import {
  formatAppointmentDateTime,
  formatNullable,
  getPaymentMethodLabel,
  getPaymentStatusBadgeVariant,
  getPaymentStatusLabel,
  getSiteRefLabel,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../../utils/appointment";
import {
  canModifySerial,
  formatSerialDisplay,
  getEffectiveSerialNumber,
  isSerialModified,
} from "../../utils/appointmentSerial";
import { formatDiscountSummary } from "../../utils/discount";

type AppointmentViewModalProps = {
  appointment: Appointment | null;
  onClose: () => void;
  onPrint?: (appointment: Appointment) => void;
  onModifySerial?: (appointment: Appointment) => void;
  onResetSerial?: (appointment: Appointment) => void;
  onConfirmBkash?: (appointment: Appointment) => void;
  isConfirmingBkash?: boolean;
};

type DetailRowProps = {
  label: string;
  value: ReactNode;
  multiline?: boolean;
};

function DetailRow({ label, value, multiline = false }: DetailRowProps) {
  return (
    <div className="grid gap-1 border-b border-outline-variant/20 py-3 last:border-b-0 sm:grid-cols-3 sm:gap-4">
      <dt className="text-label-md font-medium text-on-surface-variant">
        {label}
      </dt>
      <dd
        className={
          multiline
            ? "text-body-md text-on-surface wrap-break-word whitespace-pre-wrap sm:col-span-2"
            : "text-body-md text-on-surface wrap-break-word sm:col-span-2"
        }
      >
        {value}
      </dd>
    </div>
  );
}

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section>
      <h3 className="mb-1 text-label-md font-semibold uppercase tracking-wide text-on-surface-variant">
        {title}
      </h3>
      <dl>{children}</dl>
    </section>
  );
}

export function AppointmentViewModal({
  appointment,
  onClose,
  onPrint,
  onModifySerial,
  onResetSerial,
  onConfirmBkash,
  isConfirmingBkash,
}: AppointmentViewModalProps) {
  const effectiveSerial = appointment
    ? getEffectiveSerialNumber(appointment)
    : null;

  return (
    <Modal
      open={appointment !== null}
      onClose={onClose}
      title="Appointment Details"
      className="min-w-4xl"
    >
      {appointment && effectiveSerial !== null ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-5 rounded-lg border border-outline-variant/30 bg-surface-container-low px-4 py-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <p className="text-label-lg text-on-surface-variant">Current Serial:</p>
                <p className="text-body-md font-semibold text-on-surface">
                  {formatSerialDisplay(effectiveSerial)}
                </p>
              </div>
              {isSerialModified(appointment) ? (
                <p className="text-label-sm text-on-surface-variant">
                  Modified from {formatSerialDisplay(appointment.serialNumber)}
                </p>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-lg font-semibold text-on-surface">
                {appointment.name}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(appointment.status)}>
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>

          <DetailSection title="Serial Information">
            <DetailRow
              label="Original Serial"
              value={formatSerialDisplay(appointment.serialNumber)}
            />
            <DetailRow
              label="Modified Serial"
              value={
                isSerialModified(appointment)
                  ? formatSerialDisplay(appointment.modifiedSerialNumber!)
                  : "Not modified"
              }
            />
            <DetailRow
              label="Current Serial"
              value={formatSerialDisplay(effectiveSerial)}
            />
          </DetailSection>

          <DetailSection title="Patient Information">
            <DetailRow label="Phone" value={appointment.phone} />
            <DetailRow
              label="Age"
              value={formatNullable(appointment.age)}
            />
            <DetailRow
              label="Email"
              value={formatNullable(appointment.email)}
            />
            <DetailRow
              label="Home Address"
              value={formatNullable(appointment.homeAddress)}
              multiline
            />
          </DetailSection>

          <DetailSection title="Appointment Details">
            <DetailRow
              label="Date & Time"
              value={formatAppointmentDateTime(appointment)}
            />
            <DetailRow
              label="Preferred Time"
              value={appointment.preferredTime}
            />
            <DetailRow
              label="Site"
              value={getSiteRefLabel(appointment.siteRef)}
            />
            <DetailRow
              label="Symptoms / Problem"
              value={formatNullable(appointment.problem)}
              multiline
            />
            <DetailRow
              label="Injection"
              value={
                appointment.injectionName
                  ? `${appointment.injectionName} — ${appointment.injectionAmount ?? ""}`
                  : "—"
              }
            />
            <DetailRow
              label="Operation"
              value={
                appointment.operationName
                  ? `${appointment.operationName} — ${appointment.operationAmount ?? ""}`
                  : "—"
              }
            />
            <DetailRow
              label="Fee Discount"
              value={
                appointment.feesDiscount?.length
                  ? appointment.feesDiscount
                      .map((discount) =>
                        formatDiscountSummary(
                          discount,
                          appointment.consultationFee ?? 0,
                        ),
                      )
                      .join("; ")
                  : "—"
              }
            />
          </DetailSection>

          <DetailSection title="Reference">
            <DetailRow
              label="Transaction ID"
              value={formatNullable(appointment.transactionId)}
            />
            <DetailRow
              label="Payment Status"
              value={
                <Badge
                  variant={getPaymentStatusBadgeVariant(appointment.paymentStatus)}
                >
                  {getPaymentStatusLabel(appointment.paymentStatus)}
                </Badge>
              }
            />
            <DetailRow
              label="Payment Method"
              value={getPaymentMethodLabel(appointment.paymentMethod)}
            />
            <DetailRow
              label="Collected Amount"
              value={
                appointment.collectedAmount != null
                  ? String(appointment.collectedAmount)
                  : "—"
              }
            />
          </DetailSection>

          <DetailSection title="Audit">
            <DetailRow
              label="Admin Note"
              value={formatNullable(appointment.note)}
              multiline
            />
            <DetailRow
              label="Created by"
              value={formatNullable(appointment.createdBy)}
            />
            <DetailRow
              label="Updated by"
              value={formatNullable(appointment.updatedBy)}
            />
          </DetailSection>

          <div className="flex flex-wrap justify-between gap-3 border-t border-outline-variant/30 pt-4">
            <div className="flex flex-wrap gap-2">
              {canModifySerial(appointment.status) ? (
                <Button
                  variant="ghost"
                  onClick={() => onModifySerial?.(appointment)}
                >
                  Modify Serial
                </Button>
              ) : null}
              {isSerialModified(appointment) && canModifySerial(appointment.status) ? (
                <Button
                  variant="ghost"
                  className="text-error hover:bg-error-container/30"
                  onClick={() => onResetSerial?.(appointment)}
                >
                  Reset to Original Serial
                </Button>
              ) : null}
            </div>
            <div className="flex gap-3">
              {appointment.paymentMethod === "BKASH" &&
              appointment.paymentStatus === "PENDING" &&
              onConfirmBkash ? (
                <Button
                  variant="primary"
                  disabled={isConfirmingBkash}
                  onClick={() => onConfirmBkash(appointment)}
                >
                  {isConfirmingBkash ? "Confirming..." : "Confirm bKash collected"}
                </Button>
              ) : null}
              <Button
                variant="primary"
                onClick={() => {
                  onPrint?.(appointment);
                }}
              >
                Print
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
