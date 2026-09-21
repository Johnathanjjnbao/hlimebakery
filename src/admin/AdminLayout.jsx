import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { requireSupabase } from '../lib/supabase';
import { useAdminAuth } from './AdminAuthContext';

const navItems = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders', badge: true },
  { to: '/admin/homepage', label: 'Homepage' },
  { to: '/admin/page-content', label: 'Page Content' },
  { to: '/admin/site-settings', label: 'Site Settings' },
  { to: '/admin/order-settings', label: 'Order Settings' },
];

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const refreshPending = async () => {
    const { count } = await requireSupabase().from('orders').select('id', { count: 'exact', head: true }).eq('status', 'PENDING');
    setPendingCount(count || 0);
  };

  useEffect(() => {
    document.body.dataset.page = 'admin';
    document.title = 'Hlime Admin';
    refreshPending();
  }, [location.pathname]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">Bỏ qua đến nội dung</a>
      <aside className={`admin-sidebar${open ? ' is-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-brand"><strong>Hlime</strong><span>Admin V1</span></div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? 'is-active' : ''}>
              <span>{item.label}</span>
              {item.badge && <span className="admin-nav-badge" aria-label={`${pendingCount} đơn pending`}>{pendingCount}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button className="admin-backdrop" aria-label="Đóng navigation" type="button" onClick={() => setOpen(false)} />}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>☰</button>
          <div className="admin-identity"><span>{user?.email}</span><button type="button" onClick={signOut}>Đăng xuất</button></div>
        </header>
        <main id="admin-main"><Outlet context={{ pendingCount, refreshPending }} /></main>
      </div>
    </div>
  );
}
