import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { requireSupabase } from '../lib/supabase';
import { useAdminAuth } from './AdminAuthContext';
import AdminLanguageSwitcher from './components/AdminLanguageSwitcher';
import { useAdminLanguage } from './i18n/AdminLanguageContext';

const navItems = [
  { to: '/admin', end: true, labelKey: 'nav.dashboard' },
  { to: '/admin/products', labelKey: 'nav.products' },
  { to: '/admin/categories', labelKey: 'nav.categories' },
  { to: '/admin/orders', labelKey: 'nav.orders', badge: true },
  { to: '/admin/homepage', labelKey: 'nav.homepage' },
  { to: '/admin/page-content', labelKey: 'nav.pageContent' },
  { to: '/admin/site-settings', labelKey: 'nav.siteSettings' },
  { to: '/admin/order-settings', labelKey: 'nav.orderSettings' },
];

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth();
  const { t } = useAdminLanguage();
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
      <a className="skip-link" href="#admin-main">{t('common.skipContent')}</a>
      <aside className={`admin-sidebar${open ? ' is-open' : ''}`} aria-label={t('common.openMenu')}>
        <div className="admin-brand"><strong>Hlime</strong><span>Admin V1</span></div>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? 'is-active' : ''}>
              <span>{t(item.labelKey)}</span>
              {item.badge && <span className="admin-nav-badge" aria-label={`${pendingCount} ${t('orders.pending')}`}>{pendingCount}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <button className="admin-backdrop" aria-label={t('common.closeNavigation')} type="button" onClick={() => setOpen(false)} />}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={t('common.openMenu')}>☰</button>
          <div className="admin-topbar__actions">
            <AdminLanguageSwitcher />
            <div className="admin-identity"><span>{user?.email}</span><button type="button" onClick={signOut}>{t('auth.logout')}</button></div>
          </div>
        </header>
        <main id="admin-main"><Outlet context={{ pendingCount, refreshPending }} /></main>
      </div>
    </div>
  );
}
