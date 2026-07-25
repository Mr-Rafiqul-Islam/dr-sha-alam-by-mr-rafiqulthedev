import {
  useForm,
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { ReactNode } from "react";
import type { ZodTypeAny } from "zod";

import { Button } from "../common/Button";
import { Icon } from "../common/Icon";
import { cn } from "../../lib/cn";
import { getTodayYmd } from "../../utils/appointment";
import type { FormFieldConfig } from "../../types/form";
import { AppointmentDatePicker } from "./AppointmentDatePicker";

const controlInputClass = cn(
  "w-full min-h-10 px-4 py-2.5 rounded-lg border border-outline-variant",
  "bg-surface-container-lowest text-body-md text-on-surface",
  "placeholder:text-on-surface-variant",
  "focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/30",
);

const textareaClass = cn(controlInputClass, "min-h-24 resize-y py-3 leading-relaxed");

const labelClass = (fDisabled: boolean) =>
  cn(
    "block text-label-md font-medium text-on-surface",
    fDisabled && "cursor-not-allowed opacity-70",
  );

function PasswordInputBlock({
  fieldId,
  field,
  fieldState,
  fDisabled,
  describedBy,
  placeholder,
  showToggle,
}: {
  fieldId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  fieldState: { error?: { message?: unknown } };
  fDisabled: boolean;
  describedBy?: string;
  placeholder?: string;
  showToggle: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={fieldId}
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        placeholder={placeholder}
        className={cn(controlInputClass, showToggle && "pr-11")}
        disabled={fDisabled}
        aria-invalid={!!fieldState.error}
        aria-describedby={describedBy}
        {...field}
        value={field.value ?? ""}
      />
      {showToggle ? (
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon
            name={visible ? "visibility_off" : "visibility"}
            size={18}
          />
        </button>
      ) : null}
    </div>
  );
}

export function CommonFormFields<TFieldValues extends FieldValues>({
  control,
  fields,
  disabled = false,
}: {
  control: Control<TFieldValues>;
  fields: FormFieldConfig[];
  disabled?: boolean;
}) {
  return (
    <>
      {fields.map((f) => {
        const fieldId = `field-${String(f.name)}`;
        const fDisabled = Boolean(disabled || f.disabled);

        return (
          <Controller
            key={f.name}
            control={control}
            name={f.name as Path<TFieldValues>}
            render={({ field, fieldState }) => {
              const describedBy = f.description ? `${fieldId}-desc` : undefined;

              return (
                <div className={cn("space-y-2", f.wrapperClassName)}>
                  {f.type === "checkbox" ? (
                    <fieldset className="m-0 min-w-0 space-y-2 border-0 p-0">
                      <legend className={cn(labelClass(fDisabled), "mb-1")}>
                        {f.label}
                      </legend>
                      <div className="flex items-center gap-2">
                        <input
                          id={fieldId}
                          type="checkbox"
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          className={cn(
                            "size-4 shrink-0 rounded border-2 border-outline-variant bg-surface-container-lowest text-primary",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                          )}
                        />
                        {f.checkboxLabel ? (
                          <label
                            htmlFor={fieldId}
                            className={cn(
                              "text-body-md text-on-surface",
                              fDisabled
                                ? "cursor-not-allowed"
                                : "cursor-pointer",
                            )}
                          >
                            {f.checkboxLabel}
                          </label>
                        ) : null}
                      </div>
                    </fieldset>
                  ) : (
                    <>
                      {f.labelRight != null ? (
                        <div className="flex items-end justify-between gap-2">
                          <label
                            htmlFor={fieldId}
                            className={cn(
                              labelClass(fDisabled),
                              f.labelClassName,
                            )}
                          >
                            {f.label}
                          </label>
                          <span className="-mb-0.5 shrink-0">
                            {f.labelRight as ReactNode}
                          </span>
                        </div>
                      ) : (
                        <label
                          htmlFor={fieldId}
                          className={cn(
                            labelClass(fDisabled),
                            f.labelClassName,
                          )}
                        >
                          {f.label}
                        </label>
                      )}

                      {f.type === "email" ? (
                        <input
                          id={fieldId}
                          type="email"
                          autoComplete="email"
                          placeholder={f.placeholder}
                          className={controlInputClass}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      ) : f.type === "password" ? (
                        <PasswordInputBlock
                          fieldId={fieldId}
                          field={field}
                          fieldState={fieldState}
                          fDisabled={fDisabled}
                          describedBy={describedBy}
                          placeholder={f.placeholder}
                          showToggle={f.passwordToggle !== false}
                        />
                      ) : f.type === "tel" ? (
                        <input
                          id={fieldId}
                          type="tel"
                          autoComplete="tel"
                          placeholder={f.placeholder}
                          className={controlInputClass}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      ) : f.type === "date" && f.useAppointmentSchedules ? (
                        <AppointmentDatePicker
                          value={String(field.value ?? "")}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          minDate={f.minDate ?? getTodayYmd()}
                          closedDates={f.closedDates ?? new Set()}
                          disabled={fDisabled}
                          isLoading={f.schedulesLoading}
                          schedulesError={f.schedulesError}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                        />
                      ) : f.type === "date" ? (
                        <input
                          id={fieldId}
                          type="date"
                          className={controlInputClass}
                          disabled={fDisabled}
                          min={f.minDate ?? getTodayYmd()}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      ) : f.type === "text" ? (
                        <>
                          <input
                            id={fieldId}
                            type="text"
                            autoComplete="off"
                            placeholder={f.placeholder}
                            className={controlInputClass}
                            disabled={fDisabled}
                            aria-invalid={!!fieldState.error}
                            aria-describedby={describedBy}
                            list={
                              f.suggestions?.length
                                ? `${fieldId}-suggestions`
                                : undefined
                            }
                            {...field}
                            value={String(field.value ?? "")}
                          />
                          {f.suggestions?.length ? (
                            <datalist id={`${fieldId}-suggestions`}>
                              {f.suggestions.map((suggestion) => (
                                <option key={suggestion} value={suggestion} />
                              ))}
                            </datalist>
                          ) : null}
                          {/* {f.suggestions?.length ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {f.suggestions.map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  disabled={fDisabled}
                                  onClick={() => field.onChange(suggestion)}
                                  className={cn(
                                    "rounded-full border border-outline-variant/40 bg-surface-container-low px-3 py-1 text-label-sm text-on-surface-variant transition-colors",
                                    "hover:border-primary-container hover:bg-primary-fixed/30 hover:text-on-surface",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container",
                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                    field.value === suggestion &&
                                      "border-primary-container bg-primary-fixed/30 text-on-surface",
                                  )}
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          ) : null} */}
                        </>
                      ) : f.type === "number" ? (
                        <input
                          id={fieldId}
                          type="number"
                          inputMode="decimal"
                          placeholder={f.placeholder}
                          className={controlInputClass}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={
                            field.value === undefined || field.value === null
                              ? ""
                              : field.value
                          }
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      ) : f.type === "textarea" ? (
                        <textarea
                          id={fieldId}
                          placeholder={f.placeholder}
                          className={textareaClass}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      ) : f.type === "select" ? (
                        <select
                          id={fieldId}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={String(field.value ?? "")}
                          onChange={field.onChange}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          className={controlInputClass}
                        >
                          {f.options.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={Boolean(option.disabled)}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={fieldId}
                          type="text"
                          autoComplete="off"
                          placeholder={f.placeholder}
                          className={controlInputClass}
                          disabled={fDisabled}
                          aria-invalid={!!fieldState.error}
                          aria-describedby={describedBy}
                          {...field}
                          value={String(field.value ?? "")}
                        />
                      )}
                    </>
                  )}

                  {f.description ? (
                    <p
                      id={`${fieldId}-desc`}
                      className={cn(
                        "text-label-sm text-on-surface-variant",
                        f.descriptionClassName,
                      )}
                    >
                      {f.description}
                    </p>
                  ) : null}

                  {fieldState.error ? (
                    <p
                      role="alert"
                      className="text-label-sm font-medium text-error"
                      aria-live="polite"
                    >
                      {fieldState.error.message != null
                        ? String(fieldState.error.message)
                        : ""}
                    </p>
                  ) : null}
                </div>
              );
            }}
          />
        );
      })}
    </>
  );
}

export function CommonForm({
  schema,
  defaultValues,
  fields,
  onSubmit,
  submitLabel = "Submit",
  disabled = false,
  isSubmitting = false,
  id: formId,
  formClassName,
  submitWrapperClassName,
  submitClassName,
  hideSubmitButton = false,
  aboveSubmit,
  formFooter,
  disableSubmit,
}: {
  schema: ZodTypeAny;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: any;
  fields: FormFieldConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void | Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
  isSubmitting?: boolean;
  id?: string;
  formClassName?: string;
  submitWrapperClassName?: string;
  submitClassName?: string;
  hideSubmitButton?: boolean;
  aboveSubmit?: ReactNode;
  formFooter?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disableSubmit?: (values: any) => boolean;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const fieldsDisabled = Boolean(disabled || isSubmitting);
  // eslint-disable-next-line react-hooks/incompatible-library
  const watched = form.watch();
  const submitExtraDisabled =
    typeof disableSubmit === "function"
      ? Boolean(disableSubmit(watched))
      : false;

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-6", formClassName)}
      noValidate
    >
      <CommonFormFields
        control={form.control}
        fields={fields}
        disabled={fieldsDisabled}
      />

      {aboveSubmit}

      {!disabled && !hideSubmitButton ? (
        <div className={submitWrapperClassName}>
          <Button
            type="submit"
            className={cn(
              "disabled:pointer-events-none disabled:opacity-50",
              submitClassName,
            )}
            disabled={fieldsDisabled || submitExtraDisabled}
          >
            {submitLabel}
          </Button>
        </div>
      ) : null}
      {formFooter}
    </form>
  );
}
