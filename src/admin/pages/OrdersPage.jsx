import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminState';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function OrdersPage() {
  const { locale, t } = useAdminLanguage();
  const [filter, setFilter] = useState('PENDING');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    let query = requireSupabase().from('orders').select('*').order('status', { ascending: false }).order('created_at', { ascending: false }).limit(500);
    if (filter !== 'ALL') query = query.eq('status', filter);
    const { data, error: loadError } = await query;
    if (loadError) setError(loadError.message); else { setOrders(data); setError(''); }
    setLoading(false);
  }, [filter]);
  useEffect(() => { load(); }, [load]);

  const statusLabel = (status) => t(status === 'PENDING' ? 'orders.pending' : status === 'CONFIRMED' ? 'orders.confirmed' : 'orders.all');
  const fulfillmentLabel = (type) => t(type === 'DELIVERY' ? 'orders.delivery' : 'orders.pickup');
  const paymentMethodLabel = (method) => t(method === 'BANK_TRANSFER' ? 'orders.bankTransfer' : 'orders.cash');
  const paymentStatusLabel = (status) => t(status === 'PAID' ? 'orders.paid' : 'orders.unpaid');

  return <AdminPage title={t('orders.title')} description={t('orders.description')}>
    <div className="admin-filter-tabs" role="group" aria-label={t('orders.filterLabel')}>{['ALL', 'PENDING', 'CONFIRMED'].map((status) => <button className={filter === status ? 'is-active' : ''} type="button" key={status} onClick={() => setFilter(status)}>{statusLabel(status)}</button>)}</div>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !orders.length ? <AdminEmpty title={t('orders.noOrders', { status: statusLabel(filter) })} text={t('orders.noFakeData')} /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t('orders.orderCode')}</th><th>{t('common.created')}</th><th>{t('common.status')}</th><th>{t('orders.paymentMethod')}</th><th>{t('orders.paymentStatus')}</th><th>{t('common.customer')}</th><th>{t('common.phone')}</th><th>{t('orders.fulfillment')}</th><th>{t('orders.requestedDateTime')}</th><th>{t('common.subtotal')}</th><th /></tr></thead><tbody>
      {orders.map((order) => <tr key={order.id}><td><strong>{order.order_code}</strong><small>#{order.id}</small></td><td>{new Date(order.created_at).toLocaleString(locale === 'ko' ? 'ko-KR' : 'vi-VN')}</td><td><span className={`admin-chip admin-chip--${order.status.toLowerCase()}`}>{statusLabel(order.status)}</span></td><td>{paymentMethodLabel(order.payment_method)}</td><td><span className={`admin-chip admin-chip--${order.payment_status.toLowerCase()}`}>{paymentStatusLabel(order.payment_status)}</span></td><td>{order.customer_name}</td><td>{order.customer_phone}</td><td>{fulfillmentLabel(order.fulfillment_type)}</td><td>{order.requested_fulfillment_date || '—'}<small>{order.requested_fulfillment_time || ''}</small></td><td>{money(order.subtotal_amount)}</td><td><Link to={`/admin/orders/${order.id}`}>{t('common.details')}</Link></td></tr>)}
    </tbody></table></div>}
  </AdminPage>;
}
