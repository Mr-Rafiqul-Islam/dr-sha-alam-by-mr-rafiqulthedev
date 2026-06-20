import { useMemo, useState } from "react";
import { ActivityFeedList } from "../components/dashboard/ActivityFeedList";
import { StaffActivityPicker } from "../components/dashboard/StaffActivityPicker";
import { Icon, PageHeader, StatCard } from "../components/common";
import {
  useGetActivityFeedQuery,
  useGetTraceableStaffQuery,
} from "../store/api/activityApi";
import { useGetAppointmentsQuery } from "../store/api/appointmentsApi";
import { useGetBlogsQuery } from "../store/api/blogsApi";
import { useGetContactMessagesQuery } from "../store/api/contactMessagesApi";

type ActivityPoint = {
  label: string;
  shortLabel: string;
  appointments: number;
  blogs: number;
  messages: number;
};

type ActivitySeries = {
  key: keyof Pick<ActivityPoint, "appointments" | "blogs" | "messages">;
  label: string;
  color: string;
};

const ACTIVITY_SERIES: ActivitySeries[] = [
  { key: "appointments", label: "Appointments", color: "#00779b" },
  { key: "blogs", label: "Blogs", color: "#006a64" },
  { key: "messages", label: "Messages", color: "#814700" },
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function createLastSevenDaysActivity(
  appointments: Array<{ createdAt: string }>,
  blogs: Array<{ createdAt: string }>,
  messages: Array<{ createdAt: string }>,
) {
  const today = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en", { weekday: "short" });

  const points = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - (6 - index) * DAY_IN_MS);
    return {
      key: getDateKey(date),
      label: dateFormatter.format(date),
      shortLabel: weekdayFormatter.format(date),
      appointments: 0,
      blogs: 0,
      messages: 0,
    };
  });

  const pointByDate = new Map(points.map((point) => [point.key, point]));

  const countByDate = (
    items: Array<{ createdAt: string }>,
    key: ActivitySeries["key"],
  ) => {
    items.forEach((item) => {
      const point = pointByDate.get(getDateKey(new Date(item.createdAt)));
      if (point) {
        point[key] += 1;
      }
    });
  };

  countByDate(appointments, "appointments");
  countByDate(blogs, "blogs");
  countByDate(messages, "messages");

  return points;
}

function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const width = 760;
  const height = 260;
  const padding = { top: 24, right: 24, bottom: 48, left: 44 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(
    4,
    ...data.flatMap((point) => [
      point.appointments,
      point.blogs,
      point.messages,
    ]),
  );
  const ticks = Array.from({ length: 5 }, (_, index) =>
    Math.round((maxValue / 4) * index),
  );

  const getX = (index: number) =>
    padding.left + (chartWidth / Math.max(1, data.length - 1)) * index;
  const getY = (value: number) =>
    padding.top + chartHeight - (value / maxValue) * chartHeight;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="min-h-[260px] min-w-[680px] w-full"
        role="img"
        aria-label="Admin activity over the last seven days"
      >
        {ticks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                className="stroke-outline-variant/40"
                strokeDasharray="4 6"
              />
              <text
                x={padding.left - 14}
                y={y + 4}
                textAnchor="end"
                className="fill-on-surface-variant text-[11px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((point, index) => {
          const x = getX(index);
          return (
            <g key={point.label}>
              <line
                x1={x}
                x2={x}
                y1={padding.top}
                y2={height - padding.bottom}
                className="stroke-outline-variant/20"
              />
              <text
                x={x}
                y={height - 24}
                textAnchor="middle"
                className="fill-on-surface-variant text-[11px]"
              >
                {point.shortLabel}
              </text>
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="fill-on-surface-variant text-[10px]"
              >
                {point.label}
              </text>
            </g>
          );
        })}

        {ACTIVITY_SERIES.map((series) => {
          const points = data
            .map((point, index) => `${getX(index)},${getY(point[series.key])}`)
            .join(" ");

          return (
            <g key={series.key}>
              <polyline
                fill="none"
                points={points}
                stroke={series.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
              {data.map((point, index) => (
                <circle
                  key={`${series.key}-${point.label}`}
                  cx={getX(index)}
                  cy={getY(point[series.key])}
                  r="4"
                  fill={series.color}
                  className="stroke-surface-container-lowest"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function DashboardPage() {
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);

  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    isError: appointmentsError,
  } = useGetAppointmentsQuery();
  const {
    data: blogs = [],
    isLoading: blogsLoading,
    isError: blogsError,
  } = useGetBlogsQuery();
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useGetContactMessagesQuery();
  const {
    data: traceableStaff = [],
    isLoading: staffLoading,
  } = useGetTraceableStaffQuery();
  const {
    data: activityFeed,
    isLoading: activityFeedLoading,
    isError: activityFeedError,
  } = useGetActivityFeedQuery(
    selectedActorId ? { actorId: selectedActorId, limit: 20 } : { limit: 20 },
  );

  console.log(activityFeed);
  const isLoading = appointmentsLoading || blogsLoading || messagesLoading;
  const hasError = appointmentsError || blogsError || messagesError;

  const publishedBlogs = blogs.filter((blog) => blog.published).length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "PENDING",
  ).length;
  const unreadMessages = messages.filter(
    (message) => message.status !== "READ",
  ).length;

  const activityData = useMemo(
    () => createLastSevenDaysActivity(appointments, blogs, messages),
    [appointments, blogs, messages],
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor appointments, articles, and patient messages from one place."
      />

      <section className="mb-stack-lg">
        <div className="mb-4">
          <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
            Platform Overview
          </p>
          <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
            Today&apos;s admin snapshot
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Icon name="event_available" size={24} />}
            label="Total Appointments"
            value={isLoading ? "..." : appointments.length}
            iconBgClassName="bg-primary-fixed/40 text-primary-container"
          />
          <StatCard
            icon={<Icon name="pending_actions" size={24} />}
            label="Pending Appointments"
            value={isLoading ? "..." : pendingAppointments}
            iconBgClassName="bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
          />
          <StatCard
            icon={<Icon name="article" size={24} />}
            label="Published Blogs"
            value={isLoading ? "..." : publishedBlogs}
            iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
          />
          <StatCard
            icon={<Icon name="mark_email_unread" size={24} />}
            label="Unread Messages"
            value={isLoading ? "..." : unreadMessages}
            iconBgClassName="bg-primary-container/10 text-primary-container"
          />
        </div>
      </section>

      <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
              Activity Chart
            </p>
            <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
              Last 7 days activity
            </h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Daily appointments, published content, and contact messages.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {ACTIVITY_SERIES.map((series) => (
              <div
                key={series.key}
                className="flex items-center gap-2 text-label-sm text-on-surface-variant"
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                {series.label}
              </div>
            ))}
          </div>
        </div>

        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-container-low px-6 py-14 text-center text-on-surface-variant">
            <Icon name="error" size={32} className="text-error" />
            <p className="text-body-md">Failed to load dashboard activity.</p>
          </div>
        ) : (
          <ActivityChart data={activityData} />
        )}
      </section>

      <section className="mt-stack-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] md:p-6">
        <div className="mb-6">
          <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
            Staff Work Trace
          </p>
          <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
            Support and editor activity
          </h3>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Review what support and editor staff create, edit, and update across
            the admin panel.
          </p>
        </div>

        <div className="mb-6">
          <StaffActivityPicker
            staff={traceableStaff}
            selectedActorId={selectedActorId}
            onSelect={setSelectedActorId}
            isLoading={staffLoading}
          />
        </div>

        <ActivityFeedList
          items={activityFeed?.items ?? []}
          isLoading={activityFeedLoading}
          isError={activityFeedError}
        />
      </section>
    </>
  );
}
