import { lazy, type ComponentType } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  RequireAdminPermission,
  RoleDefaultRedirect,
} from "./components/auth/RequireAdminPermission";
import { RequireAdminAuth } from "./components/auth/RequireAdminAuth";
import { AdminLayout } from "./components/layout/AdminLayout";

function lazyNamed<T extends Record<string, ComponentType<object>>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) {
  return lazy(() => loader().then((m) => ({ default: m[exportName] })));
}

const LoginPage = lazyNamed(() => import("./pages/LoginPage"), "LoginPage");
const DashboardPage = lazyNamed(
  () => import("./pages/DashboardPage"),
  "DashboardPage",
);
const AppointmentsPage = lazyNamed(
  () => import("./pages/AppointmentsPage"),
  "AppointmentsPage",
);
const CreateAppointmentPage = lazyNamed(
  () => import("./pages/CreateAppointmentPage"),
  "CreateAppointmentPage",
);
const AppointmentSchedulesPage = lazyNamed(
  () => import("./pages/AppointmentSchedulesPage"),
  "AppointmentSchedulesPage",
);
const SlotDefaultsPage = lazyNamed(
  () => import("./pages/SlotDefaultsPage"),
  "SlotDefaultsPage",
);
const ArticlesPage = lazyNamed(
  () => import("./pages/ArticlesPage"),
  "ArticlesPage",
);
const CreateArticlePage = lazyNamed(
  () => import("./pages/CreateArticlePage"),
  "CreateArticlePage",
);
const ContactMessagesPage = lazyNamed(
  () => import("./pages/ContactMessagesPage"),
  "ContactMessagesPage",
);
const ContactMessageDetailPage = lazyNamed(
  () => import("./pages/ContactMessageDetailPage"),
  "ContactMessageDetailPage",
);
const SettingsPage = lazyNamed(
  () => import("./pages/SettingsPage"),
  "SettingsPage",
);
const PendingDeletesPage = lazyNamed(
  () => import("./pages/PendingDeletesPage"),
  "PendingDeletesPage",
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<RoleDefaultRedirect />} />
          <Route element={<RequireAdminPermission permission="dashboard" />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
          <Route
            element={<RequireAdminPermission permission="appointmentSchedules" />}
          >
            <Route
              path="dashboard/appointments/schedules"
              element={<AppointmentSchedulesPage />}
            />
            <Route
              path="dashboard/appointments/slot-defaults"
              element={<SlotDefaultsPage />}
            />
          </Route>
          <Route element={<RequireAdminPermission permission="appointments" />}>
            <Route path="appointments/new" element={<CreateAppointmentPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
          </Route>
          <Route element={<RequireAdminPermission permission="articles" />}>
            <Route path="articles/new" element={<CreateArticlePage />} />
            <Route path="articles/:id/edit" element={<CreateArticlePage />} />
            <Route path="articles" element={<ArticlesPage />} />
          </Route>
          <Route
            element={<RequireAdminPermission permission="contactMessages" />}
          >
            <Route
              path="contact-messages/:id"
              element={<ContactMessageDetailPage />}
            />
            <Route path="contact-messages" element={<ContactMessagesPage />} />
          </Route>
          <Route element={<RequireAdminPermission permission="settings" />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route element={<RequireAdminPermission permission="deleteApprovals" />}>
            <Route path="pending-deletes" element={<PendingDeletesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<RoleDefaultRedirect />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
