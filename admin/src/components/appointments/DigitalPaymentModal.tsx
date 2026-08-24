import type { ReactNode } from "react";
import { Button, Modal } from "../common";
import fallbackBkashQr from "../../assets/bkash-merchant-qr.svg";

type DigitalPaymentModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function DigitalPaymentModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: DigitalPaymentModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle}>
      <div className="space-y-4">
        {children}
        <div className="flex justify-end gap-3 pt-2">
          {footer}
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function SslPaymentQr({
  gatewayPageUrl,
  qrCode,
}: {
  gatewayPageUrl: string;
  qrCode?: string;
}) {
  const src =
    qrCode ||
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(gatewayPageUrl)}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={src}
        alt="SSL payment QR code"
        className="h-60 w-60 rounded-lg border border-outline-variant/40 bg-white p-2"
      />
      <a
        href={gatewayPageUrl}
        target="_blank"
        rel="noreferrer"
        className="text-label-sm text-primary underline"
      >
        Open payment page
      </a>
    </div>
  );
}

export function BkashMerchantQr({ uploadedUrl }: { uploadedUrl?: string | null }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={uploadedUrl || fallbackBkashQr}
        alt="bKash merchant QR code"
        className="h-60 w-60 rounded-lg border border-outline-variant/40 bg-white object-contain p-2"
      />
      <p className="text-center text-label-sm text-on-surface-variant">
        Ask the patient to scan this QR, then confirm when the amount is collected.
      </p>
    </div>
  );
}
