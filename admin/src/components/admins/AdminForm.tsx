import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";
import type { StaffRole } from "../../constants/permissions";
import type {
  AdminManagedUser,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "../../types/admin";
import { getAssignableRoles } from "../../utils/admin";

const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/\d/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one symbol");

function buildSchema(isEdit: boolean) {
  return z
    .object({
      name: z.string().trim().min(1, "Full name is required"),
      email: z.string().trim().email("Enter a valid email address"),
      phone: z.string().trim().optional(),
      role: z.enum([
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "SUPPORT",
        "EDITOR",
      ]),
      password: isEdit ? z.string().optional() : passwordSchema,
      confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isEdit) {
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirmPassword"],
          });
        }
        return;
      }

      const password = data.password?.trim() ?? "";
      if (!password && !data.confirmPassword) {
        return;
      }

      const result = passwordSchema.safeParse(password);
      if (!result.success) {
        for (const issue of result.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: issue.message,
            path: ["password"],
          });
        }
      }

      if (password !== (data.confirmPassword ?? "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["confirmPassword"],
        });
      }
    });
}

type AdminFormValues = {
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  password?: string;
  confirmPassword?: string;
};

export type AdminFormProps = {
  mode: "create" | "edit";
  actorRole: string;
  user?: AdminManagedUser | null;
  isLoading?: boolean;
  onCancel: () => void;
  onCreate: (payload: CreateAdminPayload) => Promise<void>;
  onUpdate: (id: string, payload: UpdateAdminPayload) => Promise<void>;
};

function FormFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-label-sm text-error">{message}</p>;
}

function SectionHeader({
  icon,
  iconClassName,
  title,
}: {
  icon: string;
  iconClassName: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        <Icon name={icon} size={20} />
      </span>
      <h3 className="text-title-md font-semibold text-on-surface">{title}</h3>
    </div>
  );
}

export function AdminForm({
  mode,
  actorRole,
  user,
  isLoading = false,
  onCancel,
  onCreate,
  onUpdate,
}: AdminFormProps) {
  const isEdit = mode === "edit";
  const schema = useMemo(() => buildSchema(isEdit), [isEdit]);
  const roleOptions = useMemo(
    () => getAssignableRoles(actorRole),
    [actorRole],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: roleOptions[0]?.value ?? "ADMIN",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isEdit && user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        role: user.role,
        password: "",
        confirmPassword: "",
      });
    } else if (!isEdit) {
      reset({
        name: "",
        email: "",
        phone: "",
        role: roleOptions[0]?.value ?? "ADMIN",
        password: "",
        confirmPassword: "",
      });
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isEdit, user, reset, roleOptions]);

  const onSubmit: SubmitHandler<AdminFormValues> = async (values) => {
    if (isEdit && user) {
      const payload: UpdateAdminPayload = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone?.trim() || null,
        role: values.role,
      };
      const password = values.password?.trim();
      if (password) {
        payload.password = password;
      }
      await onUpdate(user.id, payload);
      return;
    }

    await onCreate({
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone?.trim() || null,
      role: values.role,
      password: values.password ?? "",
      active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 md:p-5 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        <SectionHeader
          icon="person"
          iconClassName="bg-primary-fixed text-on-primary-fixed-variant"
          title="Personal Information"
        />
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
              Full Name
            </label>
            <Input {...register("name")} placeholder="e.g. John Doe" />
            <FormFieldError message={errors.name?.message} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Email Address
              </label>
              <Input
                type="email"
                {...register("email")}
                placeholder="john.doe@hospital.com"
              />
              <FormFieldError message={errors.email?.message} />
            </div>
            <div>
              <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
                Phone Number
              </label>
              <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
              <FormFieldError message={errors.phone?.message} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 md:p-5 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        <SectionHeader
          icon="key"
          iconClassName="bg-secondary-fixed text-on-secondary-fixed-variant"
          title="Access Control"
        />
        <div>
          <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
            Role Selection
          </label>
          <div className="relative">
            <select
              {...register("role")}
              className="w-full appearance-none rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            >
              <option value="" disabled>
                Select a role...
              </option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="expand_more" size={20} />
            </span>
          </div>
          <FormFieldError message={errors.role?.message} />
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 md:p-5 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
        <SectionHeader
          icon="lock"
          iconClassName="bg-error-container text-on-error-container"
          title="Security"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
              Password{isEdit ? " (optional)" : ""}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder={isEdit ? "Leave blank to keep" : "••••••••"}
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Icon
                  name={showPassword ? "visibility_off" : "visibility"}
                  size={18}
                />
              </button>
            </div>
            <FormFieldError message={errors.password?.message} />
          </div>
          <div>
            <label className="mb-1.5 block text-label-sm font-semibold text-on-surface">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Icon
                  name={showConfirmPassword ? "visibility_off" : "visibility"}
                  size={18}
                />
              </button>
            </div>
            <FormFieldError message={errors.confirmPassword?.message} />
          </div>
        </div>
        <p className="mt-2 text-label-sm text-on-surface-variant">
          Must contain at least 8 characters, one number, and one symbol.
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Admin"}
        </Button>
      </div>
    </form>
  );
}
