import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User harus login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/menus" element={<MenuPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Hanya admin */}
      <Route element={<AdminRoute />}>
        <Route
          path="/admin/orders"
          element={<AdminOrdersPage />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsersPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;