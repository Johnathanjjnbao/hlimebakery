import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { money } from '../../utils/i18n';
import { requireSupabase } from '../../lib/supabase';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminState';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function DashboardPage() {
  const { locale, t } = useAdminLanguage();
  const [state, setState] = useState({ loading: true, error: '', counts: {}, orders: [] });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    const client = requireSupabase();
    const [products, categories, orders, pending, preview] = await Promise.all([
      client.from('products').select('id', { count: 'exact', head: true }),
      client.from('categories').select('id', { count: 'exact', head: true }),
      client.from('orders').select('id', { count: 'exact', head: true }),
      client.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
      client.from('orders').select('id,customer_name,requested_fulfillment_date,fulfillment_type,subtotal_amount,created_at').eq('status', 'PENDING').order('created_at', { ascending: false }).limit(5),
    ]);
    const failed = [products, categories, orders, pending, preview].find((result) => result.error);
    if (failed) {
      setState({ loading: false, error: failed.error.message, counts: {}, orders: [] });
      return;
    }
    setState({
      loading: false,
      error: '',
      counts: { products: products.count || 0, categories: categories.count || 0, orders: orders.count || 0, pending: pending.count || 0 },
      orders: preview.data,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminPage title={t('dashboard.title')} description={t('dashboard.description')}>
      {state.loading ? <AdminLoading /> : state.error ? <AdminError error={state.error} retry={load} /> : (
        <>
          <div className="admin-stat-grid">
            {[[t('dashboard.products'), state.counts.products], [t('dashboard.categories'), state.counts.categories], [t('dashboard.orders'), state.counts.orders], [t('dashboard.pendingOrders'), state.counts.pending]].map(([label, value]) => (
              <article className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong></article>
            ))}
          </div>
          <section className="admin-card">
            <div className="admin-card__header"><div><h2>{t('dashboard.latestPending')}</h2><p>{t('dashboard.pendingDescription')}</p></div><Link className="admin-button admin-button--secondary" to="/admin/orders">{t('dashboard.viewAll')}</Link></div>
            {!state.orders.length ? <AdminEmpty title={t('dashboard.noPending')} text={t('dashboard.noPendingText')} /> : (
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t('common.customer')}</th><th>{t('dashboard.requiredDate')}</th><th>{t('dashboard.fulfillment')}</th><th>{t('common.subtotal')}</th><th /></tr></thead><tbody>
                {state.orders.map((order) => <tr key={order.id}><td>{order.customer_name}</td><td>{order.requested_fulfillment_date || '—'}</td><td>{t(order.fulfillment_type === 'DELIVERY' ? 'orders.delivery' : 'orders.pickup')}</td><td>{money(order.subtotal_amount, locale)}</td><td><Link to={`/admin/orders/${order.id}`}>{t('common.details')}</Link></td></tr>)}
              </tbody></table></div>
            )}
          </section>
        </>
      )}
    </AdminPage>
  );
}
