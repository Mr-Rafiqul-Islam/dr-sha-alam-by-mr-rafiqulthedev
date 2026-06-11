import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { ContactMessagesPage } from "./pages/ContactMessagesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SuccessStoriesPage } from "./pages/SuccessStoriesPage";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="success-stories" element={<SuccessStoriesPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="contact-messages" element={<ContactMessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
