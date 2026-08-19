import { useCallback } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { Button, Modal } from "../../common";
import type { Appointment } from "../../../types/appointment";
import { InvoiceDocument } from "./InvoiceDocument";

type InvoicePrintModalProps = {
  appointment: Appointment | null;
  onClose: () => void;
};

export function InvoicePrintModal({
  appointment,
  onClose,
}: InvoicePrintModalProps) {
  const handlePrint = useCallback(async () => {
    if (!appointment) return;

    const blob = await pdf(
      <InvoiceDocument appointment={appointment} variant="print" />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      iframe.remove();
    };

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      window.setTimeout(cleanup, 1000);
    };

    document.body.appendChild(iframe);
  }, [appointment]);

  return (
    <Modal
      open={appointment !== null}
      onClose={onClose}
      title="Appointment Invoice"
      subtitle={appointment ? appointment.name : undefined}
      className="min-w-5xl"
    >
      {appointment ? (
        <div className="flex flex-col gap-4">
          <div className="h-160 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <InvoiceDocument appointment={appointment} variant="preview" />
            </PDFViewer>
          </div>

          <div className="flex justify-end gap-3 border-t border-outline-variant/30 pt-4">
            <Button variant="primary" onClick={() => void handlePrint()}>
              Print
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
