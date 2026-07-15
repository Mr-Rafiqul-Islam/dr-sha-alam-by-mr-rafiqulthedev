import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityFeedList } from "../components/dashboard/ActivityFeedList";
import { DashboardDateRangeFilter } from "../components/dashboard/DashboardDateRangeFilter";
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

function toLocalDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDateKey(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getThisMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    from: toLocalDateKey(from),
    to: toLocalDateKey(to),
  };
}

function isInInclusiveRange(dateKey: string, from: string, to: string) {
  if (!dateKey) {
    return false;
  }

  if (!from && !to) {
    return true;
  }

  if (from && dateKey < from) {
    return false;
  }

  if (to && dateKey > to) {
    return false;
  }

  return true;
}

function buildDayKeys(fromYmd: string, toYmd: string) {
  const keys: string[] = [];
  const cursor = parseLocalDateKey(fromYmd);
  const end = parseLocalDateKey(toYmd);

  while (cursor.getTime() <= end.getTime()) {
    keys.push(toLocalDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

function createLastSevenDayKeys() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime() - (6 - index) * DAY_IN_MS);
    return toLocalDateKey(date);
  });
}

function createActivitySeries(
  dayKeys: string[],
  appointments: Array<{ appointmentDate: string }>,
  blogs: Array<{ createdAt: string }>,
  messages: Array<{ createdAt: string }>,
) {
  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en", { weekday: "short" });

  const points = dayKeys.map((key) => {
    const date = parseLocalDateKey(key);
    return {
      key,
      label: dateFormatter.format(date),
      shortLabel: weekdayFormatter.format(date),
      appointments: 0,
      blogs: 0,
      messages: 0,
    };
  });

  const pointByDate = new Map(points.map((point) => [point.key, point]));

  const countByDate = (
    items: Array<{ dateValue: string }>,
    key: ActivitySeries["key"],
  ) => {
    items.forEach((item) => {
      const point = pointByDate.get(toLocalDateKey(item.dateValue));
      if (point) {
        point[key] += 1;
      }
    });
  };

  countByDate(
    appointments.map((appointment) => ({
      dateValue: appointment.appointmentDate,
    })),
    "appointments",
  );
  countByDate(
    blogs.map((blog) => ({ dateValue: blog.createdAt })),
    "blogs",
  );
  countByDate(
    messages.map((message) => ({ dateValue: message.createdAt })),
    "messages",
  );

  return points;
}

function ActivityChart({
  data,
  ariaLabel,
}: {
  data: ActivityPoint[];
  ariaLabel: string;
}) {
  const padding = { top: 24, right: 24, bottom: 48, left: 44 };
  const height = 260;
  const width = Math.max(
    760,
    padding.left + padding.right + Math.max(1, data.length - 1) * 48,
  );
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
    <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain">
      <div
        className="min-h-[260px]"
        style={{ width: `max(100%, ${width}px)` }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full"
          role="img"
          aria-label={ariaLabel}
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
              <g key={`${point.label}-${index}`}>
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
              .map(
                (point, index) => `${getX(index)},${getY(point[series.key])}`,
              )
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
                    key={`${series.key}-${point.label}-${index}`}
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
    </div>
  );
}

const ACTIVITY_PAGE_SIZE = 10;

export function DashboardPage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [activityPageIndex, setActivityPageIndex] = useState(0);
  const [activityPageCursors, setActivityPageCursors] = useState<
    (string | undefined)[]
  >([undefined]);
  const activityFeedSectionRef = useRef<HTMLElement>(null);
  const isFirstActivityPage = useRef(true);

  const hasDateRange = fromDate !== "" || toDate !== "";
  const thisMonthRange = useMemo(() => getThisMonthRange(), []);
  const isThisMonthActive =
    fromDate === thisMonthRange.from && toDate === thisMonthRange.to;

  const handleSelectActor = (actorId: string | null) => {
    setSelectedActorId(actorId);
    setActivityPageIndex(0);
    setActivityPageCursors([undefined]);
  };

  const handleThisMonth = () => {
    const range = getThisMonthRange();
    setFromDate(range.from);
    setToDate(range.to);
  };

  const handleClearDateRange = () => {
    setFromDate("");
    setToDate("");
  };

  useEffect(() => {
    if (isFirstActivityPage.current) {
      isFirstActivityPage.current = false;
      return;
    }

    activityFeedSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [activityPageIndex]);

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

  const activityCursor = activityPageCursors[activityPageIndex];
  const {
    data: activityFeed,
    isLoading: activityFeedLoading,
    isFetching: activityFeedFetching,
    isError: activityFeedError,
  } = useGetActivityFeedQuery({
    ...(selectedActorId ? { actorId: selectedActorId } : {}),
    limit: ACTIVITY_PAGE_SIZE,
    ...(activityCursor ? { cursor: activityCursor } : {}),
  });

  const handleActivityPreviousPage = () => {
    setActivityPageIndex((index) => Math.max(0, index - 1));
  };

  const handleActivityNextPage = () => {
    const nextCursor = activityFeed?.nextCursor;
    if (!nextCursor) {
      return;
    }

    setActivityPageCursors((cursors) => {
      const nextCursors = cursors.slice(0, activityPageIndex + 1);
      nextCursors.push(nextCursor);
      return nextCursors;
    });
    setActivityPageIndex((index) => index + 1);
  };

  const isLoading = appointmentsLoading || blogsLoading || messagesLoading;
  const hasError = appointmentsError || blogsError || messagesError;

  const filteredAppointments = useMemo(() => {
    if (!hasDateRange) {
      return appointments;
    }

    return appointments.filter((appointment) =>
      isInInclusiveRange(
        toLocalDateKey(appointment.appointmentDate),
        fromDate,
        toDate,
      ),
    );
  }, [appointments, fromDate, toDate, hasDateRange]);

  const filteredBlogs = useMemo(() => {
    if (!hasDateRange) {
      return blogs;
    }

    return blogs.filter((blog) =>
      isInInclusiveRange(toLocalDateKey(blog.createdAt), fromDate, toDate),
    );
  }, [blogs, fromDate, toDate, hasDateRange]);

  const filteredMessages = useMemo(() => {
    if (!hasDateRange) {
      return messages;
    }

    return messages.filter((message) =>
      isInInclusiveRange(toLocalDateKey(message.createdAt), fromDate, toDate),
    );
  }, [messages, fromDate, toDate, hasDateRange]);

  const publishedBlogs = filteredBlogs.filter((blog) => blog.published).length;
  const pendingAppointments = filteredAppointments.filter(
    (appointment) => appointment.status === "PENDING",
  ).length;
  const unreadMessages = filteredMessages.filter(
    (message) => message.status !== "READ",
  ).length;

  const activityDayKeys = useMemo(() => {
    if (!hasDateRange) {
      return createLastSevenDayKeys();
    }

    const rangeFrom = fromDate || toDate;
    const rangeTo = toDate || fromDate;

    if (!rangeFrom || !rangeTo) {
      return createLastSevenDayKeys();
    }

    return buildDayKeys(rangeFrom, rangeTo);
  }, [fromDate, toDate, hasDateRange]);

  const activityData = useMemo(
    () =>
      createActivitySeries(
        activityDayKeys,
        appointments,
        blogs,
        messages,
      ),
    [activityDayKeys, appointments, blogs, messages],
  );

  const chartTitle = hasDateRange
    ? "Selected range activity"
    : "Last 7 days activity";
  const chartAriaLabel = hasDateRange
    ? "Admin activity for the selected date range"
    : "Admin activity over the last seven days";

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor appointments, articles, and patient messages from one place."
      />

      <section className="mb-stack-lg">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
              Platform Overview
            </p>
            <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
              {hasDateRange
                ? "Filtered admin snapshot"
                : "Today's admin snapshot"}
            </h3>
          </div>
        </div>

        <div className="mb-4">
          <DashboardDateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onThisMonth={handleThisMonth}
            onClear={handleClearDateRange}
            isThisMonthActive={isThisMonthActive}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Icon name="event_available" size={24} />}
            label="Total Appointments"
            value={isLoading ? "..." : filteredAppointments.length}
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

      <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
              Activity Chart
            </p>
            <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
              {chartTitle}
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
          <ActivityChart data={activityData} ariaLabel={chartAriaLabel} />
        )}
      </section>

      <section
        ref={activityFeedSectionRef}
        className="mt-stack-lg scroll-mt-20 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] md:p-6 lg:scroll-mt-24"
      >
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
            onSelect={handleSelectActor}
            isLoading={staffLoading}
          />
        </div>

        <ActivityFeedList
          items={activityFeed?.items ?? []}
          isLoading={activityFeedLoading}
          isFetching={activityFeedFetching}
          isError={activityFeedError}
          page={activityPageIndex + 1}
          pageSize={ACTIVITY_PAGE_SIZE}
          hasPreviousPage={activityPageIndex > 0}
          hasNextPage={Boolean(activityFeed?.nextCursor)}
          onPreviousPage={handleActivityPreviousPage}
          onNextPage={handleActivityNextPage}
        />
      </section>
    </>
  );
}
