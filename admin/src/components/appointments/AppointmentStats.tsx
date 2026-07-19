import { Icon, StatCard } from "../common";
import type { Appointment } from "../../types/appointment";
import {
  computeAppointmentStats,
  formatAppointmentDateLabel,
} from "../../utils/appointment";

type AppointmentStatsProps = {
  appointments: Appointment[];
  selectedDate?: string;
};

export function AppointmentStats({
  appointments,
  selectedDate,
}: AppointmentStatsProps) {
  const stats = computeAppointmentStats(
    appointments,
    selectedDate ? { dateYmd: selectedDate } : undefined,
  );
  const dateLabel = selectedDate
    ? formatAppointmentDateLabel(selectedDate)
    : null;

  return (
    <div className="mb-stack-lg grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        icon={<Icon name="groups" size={24} />}
        label={
          dateLabel ? `Appointments on ${dateLabel}` : "Total Appointments"
        }
        value={stats.total}
        iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
      />
      <StatCard
        icon={<Icon name="calendar_today" size={24} />}
        label={dateLabel ? `Scheduled on ${dateLabel}` : "Today's Appointments"}
        value={stats.today}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
      <StatCard
        icon={<Icon name="pending_actions" size={24} />}
        label={dateLabel ? `Pending on ${dateLabel}` : "Pending"}
        value={stats.pending}
        iconBgClassName="bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
      />
      <StatCard
        icon={<Icon name="check_circle" size={24} />}
        label={dateLabel ? `Attended on ${dateLabel}` : "Total Attended"}
        value={stats.completed}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
      <StatCard
        icon={<Icon name="how_to_reg" size={24} />}
        label={dateLabel ? `Attended on ${dateLabel}` : "Today Attended"}
        value={stats.todayAttended}
        iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
      />
    </div>
  );
}
