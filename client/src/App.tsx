import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersListPage from "./pages/users/UsersListPage";
import UserCreatePage from "./pages/users/UserCreatePage";
import UserEditPage from "./pages/users/UserEditPage";
import UserDetailPage from "./pages/users/UserDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ComingSoonPage from "./pages/ComingSoonPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/users" element={<UsersListPage />} />
          <Route path="/users/new" element={<UserCreatePage />} />
          <Route path="/users/:id/edit" element={<UserEditPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<ComingSoonPage title="Settings" />} />
          <Route path="/inventory" element={<ComingSoonPage title="Inventory" />} />
          <Route path="/products" element={<ComingSoonPage title="Products" />} />
          <Route path="/warehouses" element={<ComingSoonPage title="Warehouses" />} />
          <Route path="/scan" element={<ComingSoonPage title="Scan" />} />
          <Route path="/reports" element={<ComingSoonPage title="Reports" />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
