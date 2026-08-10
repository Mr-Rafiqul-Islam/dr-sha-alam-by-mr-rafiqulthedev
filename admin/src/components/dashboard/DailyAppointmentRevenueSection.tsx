import { useMemo, useState } from "react";
import {
  Button,
  Icon,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../common";
import { canAccessAdminPermission } from "../../constants/permissions";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { useGetAppointmentRevenueSummaryQuery } from "../../store/api/appointmentRevenueApi";
import {
  addDaysToYmd,
  BUSINESS_TIMEZONE,
  formatBusinessDateLabel,
  getTodayYmdInTimeZone,
} from "../../utils/bangladeshDate";
import { formatAttendanceRate, formatBdtCurrency } from "../../utils/currency";
import { AppointmentRevenueFeesModal } from "./AppointmentRevenueFeesModal";

const SITE_REF = "DOCTOR_SHA_ALAM" as const;

function categoryHasRecords(category: {
  booked: number;
  attended: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  rescheduled: number;
}) {
  return (
    category.booked +
      category.attended +
      category.pending +
      category.confirmed +
      category.cancelled +
      category.rescheduled >
    0
  );
}

export function DailyAppointmentRevenueSection() {
  const { user } = useAdminAuth();
  const [selectedDate, setSelectedDate] = useState(() =>
    getTodayYmdInTimeZone(BUSINESS_TIMEZONE),
  );
  const [feesModalOpen, setFeesModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAppointmentRevenueSummaryQuery({
    date: selectedDate,
    siteRef: SITE_REF,
  });

  const visibleCategories = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.categories.filter(
      (category) => category.key !== "OTHER" || categoryHasRecords(category),
    );
  }, [data]);

  const canConfigureFees =
    user?.role != null && canAccessAdminPermission(user.role, "appointments");

  const dateLabel = formatBusinessDateLabel(selectedDate);
  const summary = data?.summary;
  const isRefreshing = isFetching && !isLoading;

  return (
    <section className="mb-stack-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)] md:p-6">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-label-md font-semibold uppercase tracking-[0.16em] text-primary">
            Daily Appointment &amp; Revenue
          </p>
          <h3 className="mt-1 text-headline-md font-semibold text-on-surface">
            Attendance-based collection for {dateLabel}
          </h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Calculated revenue reflects attended appointments only. This is expected
            collection, not audited payment settlement.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-lg border border-outline-variant/40 bg-surface px-3 py-2 text-body-md text-on-surface"
            aria-label="Selected date"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(addDaysToYmd(selectedDate, -1))}
            >
              Previous day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelectedDate(getTodayYmdInTimeZone(BUSINESS_TIMEZONE))
              }
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(addDaysToYmd(selectedDate, 1))}
            >
              Next day
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            {canConfigureFees ? (
              <Button size="sm" onClick={() => setFeesModalOpen(true)}>
                Configure Fees
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-on-surface-variant">
          <Icon
            name="progress_activity"
            size={28}
            className="animate-spin text-primary"
          />
          <p className="text-body-md">Loading daily revenue summary...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-on-surface-variant">
          <p className="text-body-md text-error">
            Failed to load daily appointment and revenue summary.
          </p>
          <Button variant="ghost" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <StatCard
              icon={<Icon name="event_available" size={24} />}
              label="Total Booked"
              value={summary?.booked ?? 0}
              iconBgClassName="bg-primary-fixed/40 text-primary-container"
            />
            <StatCard
              icon={<Icon name="check_circle" size={24} />}
              label="Attended"
              value={summary?.attended ?? 0}
              iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
            />
            <StatCard
              icon={<Icon name="pending_actions" size={24} />}
              label="Pending"
              value={summary?.pending ?? 0}
              iconBgClassName="bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
            />
            <StatCard
              icon={<Icon name="cancel" size={24} />}
              label="Cancelled"
              value={summary?.cancelled ?? 0}
              iconBgClassName="bg-primary-container/10 text-primary-container"
            />
            <StatCard
              icon={<Icon name="percent" size={24} />}
              label="Attendance Rate"
              value={formatAttendanceRate(summary?.attendanceRate ?? 0)}
              iconBgClassName="bg-primary-fixed/40 text-primary-container"
            />
            <StatCard
              icon={<Icon name="payments" size={24} />}
              label="Calculated Revenue"
              value={formatBdtCurrency(summary?.totalRevenue ?? 0)}
              iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Category</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Booked</TableHead>
                  <TableHead>Attended</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCategories.map((category) => (
                  <TableRow key={category.key}>
                    <TableCell className="font-medium text-on-surface">
                      {category.label}
                    </TableCell>
                    <TableCell>{category.slotCode ?? "—"}</TableCell>
                    <TableCell>{category.booked}</TableCell>
                    <TableCell>{category.attended}</TableCell>
                    <TableCell>{formatBdtCurrency(category.fee)}</TableCell>
                    <TableCell>{formatBdtCurrency(category.revenue)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-surface-container-low/60">
                  <TableCell
                    colSpan={5}
                    className="font-semibold text-on-surface"
                  >
                    Total Calculated Revenue
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatBdtCurrency(summary?.totalRevenue ?? 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AppointmentRevenueFeesModal
        open={feesModalOpen}
        onClose={() => setFeesModalOpen(false)}
      />
    </section>
  );
}
