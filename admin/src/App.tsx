import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { CreateAppointmentPage } from "./pages/CreateAppointmentPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { CreateArticlePage } from "./pages/CreateArticlePage";
import { ContactMessagesPage } from "./pages/ContactMessagesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointments/new" element={<CreateAppointmentPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="articles/new" element={<CreateArticlePage />} />
        <Route path="articles/:id/edit" element={<CreateArticlePage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="contact-messages" element={<ContactMessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
