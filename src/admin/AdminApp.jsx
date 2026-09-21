import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLoading } from './components/AdminState';
import AdminLoginPage from './pages/AdminLoginPage';
import CategoriesPage from './pages/CategoriesPage';
import DashboardPage from './pages/DashboardPage';
import HomepagePage from './pages/HomepagePage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderSettingsPage from './pages/OrderSettingsPage';
import OrdersPage from './pages/OrdersPage';
import PageContentPage from './pages/PageContentPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';
import SiteSettingsPage from './pages/SiteSettingsPage';

function RequireAdmin() {
  const { user, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) return <main className="admin-auth-loading"><AdminLoading label="Đang khôi phục phiên Admin…" /></main>;
  if (!user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  return <Outlet />;
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="homepage" element={<HomepagePage />} />
            <Route path="page-content" element={<PageContentPage />} />
            <Route path="site-settings" element={<SiteSettingsPage />} />
            <Route path="order-settings" element={<OrderSettingsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}
