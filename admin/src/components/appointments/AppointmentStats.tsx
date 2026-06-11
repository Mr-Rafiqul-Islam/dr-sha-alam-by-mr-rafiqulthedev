import { Icon, StatCard } from "../common";
import type { Appointment } from "../../types/appointment";
import { computeAppointmentStats } from "../../utils/appointment";

type AppointmentStatsProps = {
  appointments: Appointment[];
};

export function AppointmentStats({ appointments }: AppointmentStatsProps) {
  const stats = computeAppointmentStats(appointments);

  return (
    <div className="mb-stack-lg grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Icon name="groups" size={24} />}
        label="Total Appointments"
        value={stats.total}
        iconBgClassName="bg-secondary-fixed/40 text-secondary-container"
      />
      <StatCard
        icon={<Icon name="calendar_today" size={24} />}
        label="Today's Appointments"
        value={stats.today}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
      <StatCard
        icon={<Icon name="pending_actions" size={24} />}
        label="Pending"
        value={stats.pending}
        iconBgClassName="bg-tertiary-fixed/50 text-on-tertiary-fixed-variant"
      />
      <StatCard
        icon={<Icon name="check_circle" size={24} />}
        label="Completed"
        value={stats.completed}
        iconBgClassName="bg-primary-fixed/40 text-primary-container"
      />
    </div>
  );
}
