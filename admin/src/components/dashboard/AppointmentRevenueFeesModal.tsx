import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button, Input, Modal } from "../common";
import {
  useGetAppointmentRevenueFeesQuery,
  useUpdateAppointmentRevenueFeesMutation,
  type AppointmentRevenueFees,
} from "../../store/api/appointmentRevenueApi";

const feeSchema = z
  .string()
  .trim()
  .min(1, "Fee is required")
  .refine((value) => Number.isFinite(Number(value)), "Enter a valid number")
  .refine((value) => Number(value) >= 0, "Fee must be at least 0")
  .refine((value) => Number(value) <= 1_000_000, "Fee is too large")
  .refine((value) => {
    const [, decimals = ""] = value.split(".");
    return decimals.length <= 2;
  }, "Use at most two decimal places");

const feesFormSchema = z.object({
  newPlidFee: feeSchema,
  oldPlidFee: feeSchema,
  generalFee: feeSchema,
});

type FeesFormValues = z.infer<typeof feesFormSchema>;

type AppointmentRevenueFeesModalProps = {
  open: boolean;
  onClose: () => void;
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

function feesToFormValues(fees: AppointmentRevenueFees["fees"]): FeesFormValues {
  return {
    newPlidFee: String(fees.NEW_PLID),
    oldPlidFee: String(fees.OLD_PLID),
    generalFee: String(fees.GENERAL),
  };
}

export function AppointmentRevenueFeesModal({
  open,
  onClose,
}: AppointmentRevenueFeesModalProps) {
  const { data, isLoading, isError, refetch } = useGetAppointmentRevenueFeesQuery(
    "DOCTOR_SHA_ALAM",
    { skip: !open },
  );
  const [updateFees, { isLoading: isSaving }] =
    useUpdateAppointmentRevenueFeesMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeesFormValues>({
    resolver: zodResolver(feesFormSchema),
    defaultValues: {
      newPlidFee: "0",
      oldPlidFee: "0",
      generalFee: "0",
    },
  });

  useEffect(() => {
    if (!data || !open) {
      return;
    }
    reset(feesToFormValues(data.fees));
  }, [data, open, reset]);

  const onSubmit: SubmitHandler<FeesFormValues> = async (values) => {
    try {
      await updateFees({
        siteRef: "DOCTOR_SHA_ALAM",
        fees: {
          NEW_PLID: Number(values.newPlidFee),
          OLD_PLID: Number(values.oldPlidFee),
          GENERAL: Number(values.generalFee),
        },
      }).unwrap();
      toast.success("Revenue fees updated successfully");
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update revenue fees"));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configure Fees"
      subtitle="Set attendance-based expected collection amounts per patient category."
    >
      {isLoading ? (
        <p className="px-6 py-8 text-body-md text-on-surface-variant">
          Loading fee settings...
        </p>
      ) : isError ? (
        <div className="flex flex-col gap-4 px-6 py-8">
          <p className="text-body-md text-error">Failed to load fee settings.</p>
          <Button variant="ghost" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <label htmlFor="newPlidFee" className="text-label-md font-medium">
              New PLID Fee
            </label>
            <Input
              id="newPlidFee"
              type="number"
              min={0}
              step="0.01"
              {...register("newPlidFee")}
            />
            {errors.newPlidFee ? (
              <p className="text-label-sm text-error">
                {errors.newPlidFee.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="oldPlidFee" className="text-label-md font-medium">
              Old PLID Fee
            </label>
            <Input
              id="oldPlidFee"
              type="number"
              min={0}
              step="0.01"
              {...register("oldPlidFee")}
            />
            {errors.oldPlidFee ? (
              <p className="text-label-sm text-error">
                {errors.oldPlidFee.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="generalFee" className="text-label-md font-medium">
              General Fee
            </label>
            <Input
              id="generalFee"
              type="number"
              min={0}
              step="0.01"
              {...register("generalFee")}
            />
            {errors.generalFee ? (
              <p className="text-label-sm text-error">
                {errors.generalFee.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Fees"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
