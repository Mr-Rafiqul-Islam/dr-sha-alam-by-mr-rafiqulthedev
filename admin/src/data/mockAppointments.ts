export type AppointmentStatus = "pending" | "confirmed";

export type Appointment = {
  id: string;
  patientName: string;
  initials: string;
  phone: string;
  email: string;
  dateTime: string;
  symptoms: string;
  status: AppointmentStatus;
};

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Eleanor James",
    initials: "EJ",
    phone: "+1 (555) 123-4567",
    email: "ejames@email.com",
    dateTime: "Oct 12, 2024 - 4:00 PM",
    symptoms: "Severe lower back pain, radiating",
    status: "pending",
  },
  {
    id: "2",
    patientName: "Marcus Chen",
    initials: "MC",
    phone: "+1 (555) 987-6543",
    email: "m.chen@email.com",
    dateTime: "Oct 13, 2024 - 10:30 AM",
    symptoms: "Post-op knee evaluation",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Sarah Rogers",
    initials: "SR",
    phone: "+1 (555) 345-6789",
    email: "srogers@email.com",
    dateTime: "Oct 14, 2024 - 2:15 PM",
    symptoms: "Shoulder impingement consultation",
    status: "confirmed",
  },
];
