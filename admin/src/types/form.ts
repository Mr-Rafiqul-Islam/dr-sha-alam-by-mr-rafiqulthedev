import type { ReactNode } from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type BaseField = {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  labelRight?: ReactNode;
};

export type FormFieldConfig =
  | (BaseField & { type: "text" | "email" | "textarea" | "number" | "tel" | "date" })
  | (BaseField & { type: "password"; passwordToggle?: boolean })
  | (BaseField & { type: "select"; options: SelectOption[] })
  | (BaseField & { type: "checkbox"; checkboxLabel?: string });
