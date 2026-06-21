import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button, Input, PageHeader } from "../components/common";
import {
  useGetAnalyticsSettingsQuery,
  useUpsertAnalyticsSettingsMutation,
} from "../store/api/analyticsSettingsApi";

const analyticsSettingsFormSchema = z.object({
  pixelId: z.string().trim().optional(),
  accessToken: z.string().trim().optional(),
  testEventCode: z.string().trim().optional(),
  enabled: z.boolean(),
});

type AnalyticsSettingsFormValues = z.infer<typeof analyticsSettingsFormSchema>;

function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: unknown } }).data;
    if (typeof data?.message === "string") {
      return data.message;
    }
  }
  return fallback;
}

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-label-sm text-error">{message}</p>;
}

export function SettingsPage() {
  const { data, isLoading, isError, refetch } = useGetAnalyticsSettingsQuery();
  const [upsertAnalyticsSettings, { isLoading: isSaving }] =
    useUpsertAnalyticsSettingsMutation();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<AnalyticsSettingsFormValues>({
    resolver: zodResolver(analyticsSettingsFormSchema),
    defaultValues: {
      pixelId: "",
      accessToken: "",
      testEventCode: "",
      enabled: false,
    },
  });

  const accessTokenValue = watch("accessToken");

  useEffect(() => {
    if (!data) return;

    reset({
      pixelId: data.pixelId ?? "",
      accessToken: "",
      testEventCode: data.testEventCode ?? "",
      enabled: data.enabled,
    });
  }, [data, reset]);

  const handleFormSubmit: SubmitHandler<AnalyticsSettingsFormValues> = async (
    values,
  ) => {
    try {
      await upsertAnalyticsSettings({
        pixelId: values.pixelId?.trim() || null,
        testEventCode: values.testEventCode?.trim() || null,
        enabled: values.enabled,
        ...(values.accessToken?.trim()
          ? { accessToken: values.accessToken.trim() }
          : {}),
      }).unwrap();

      toast.success("Analytics settings saved successfully");
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to save analytics settings"),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-text-sub">Loading analytics settings...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-error">Failed to load analytics settings.</p>
        <Button type="button" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Analytics Settings"
        subtitle="Configure Meta Pixel and Conversion API for appointment and lead tracking."
      />

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-2xl space-y-6 rounded-2xl border border-outline-variant bg-surface p-6"
      >
        <div className="space-y-2">
          <label htmlFor="pixelId" className="text-label-md font-medium">
            Meta Pixel ID
          </label>
          <Input
            id="pixelId"
            placeholder="e.g. 977651841809899"
            {...register("pixelId")}
          />
          <FormFieldError message={errors.pixelId?.message} />
        </div>

        <div className="space-y-2">
          <label htmlFor="accessToken" className="text-label-md font-medium">
            CAPI Access Token
          </label>
          <Input
            id="accessToken"
            type="password"
            placeholder="Enter a new token to update"
            autoComplete="new-password"
            {...register("accessToken")}
          />
          {data?.hasToken && !accessTokenValue?.trim() ? (
            <p className="text-label-sm text-accent">Token already saved</p>
          ) : null}
          <FormFieldError message={errors.accessToken?.message} />
        </div>

        <div className="space-y-2">
          <label htmlFor="testEventCode" className="text-label-md font-medium">
            Test Event Code (optional)
          </label>
          <Input
            id="testEventCode"
            placeholder="Meta Events Manager test code"
            {...register("testEventCode")}
          />
          <FormFieldError message={errors.testEventCode?.message} />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-outline"
            {...register("enabled")}
          />
          <span className="text-label-md font-medium">Enable Conversion API</span>
        </label>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
