import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { Avatar, Badge, Icon } from "../components/common";
import { useGetContactMessageByIdQuery } from "../store/api/contactMessagesApi";
import {
  formatContactDate,
  formatContactTime,
  getApiErrorMessage,
  getInitials,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../utils/contact";
import { formatNullable } from "../utils/appointment";

export function ContactMessageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: message,
    isLoading,
    isError,
    error,
  } = useGetContactMessageByIdQuery(id ?? "", { skip: !id });

  useEffect(() => {
    if (isError) {
      toast.error(getApiErrorMessage(error, "Failed to load contact message"));
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-on-surface-variant">
        <Icon
          name="progress_activity"
          size={32}
          className="animate-spin text-primary"
        />
        <p className="text-body-md">Loading contact message...</p>
      </div>
    );
  }

  if (isError || !message) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          to="/contact-messages"
          className="inline-flex items-center gap-2 text-body-md font-medium text-primary-container hover:text-primary"
        >
          <Icon name="arrow_back" size={18} />
          Back to List
        </Link>
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-16 text-on-surface-variant">
          <Icon name="error" size={32} className="text-error" />
          <p className="text-body-md">Contact message not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/contact-messages"
        className="inline-flex w-fit items-center gap-2 text-body-md font-medium text-primary-container hover:text-primary print:hidden"
      >
        <Icon name="arrow_back" size={18} />
        Back to List
      </Link>

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        <div className="border-b border-outline-variant/20 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <Avatar initials={getInitials(message.name)} size="md" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-headline-md font-semibold text-on-surface">
                    {message.name}
                  </h2>
                  <Badge variant={getStatusBadgeVariant(message.status)}>
                    {getStatusLabel(message.status)}
                  </Badge>
                </div>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  {message.subject}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-body-md text-on-surface-variant lg:items-end">
              <div className="flex items-center gap-2">
                <Icon name="calendar_today" size={18} className="text-primary" />
                <span>Submitted: {formatContactDate(message.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="schedule" size={18} className="text-primary" />
                <span>Time: {formatContactTime(message.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
              <Icon name="call" size={20} />
            </div>
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
                Phone Number
              </p>
              <p className="mt-1 text-body-md text-on-surface">{message.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-container/10 text-primary-container">
              <Icon name="mail" size={20} />
            </div>
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
                Email Address
              </p>
              <p className="mt-1 text-body-md text-on-surface">
                {formatNullable(message.email)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4 print:hidden">
          <h3 className="text-headline-md font-semibold text-on-surface">
            Message Content
          </h3>
        </div>
        <div className="p-6">
          <div className="rounded-lg bg-surface-container-low p-5">
            <p className="whitespace-pre-wrap text-body-md leading-relaxed text-on-surface">
              {formatNullable(message.message)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
