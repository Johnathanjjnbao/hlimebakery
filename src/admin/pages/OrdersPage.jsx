import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminState';

export default function OrdersPage() {
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

  return <AdminPage title="Orders" description="Pending được ưu tiên; V1 chỉ có PENDING và CONFIRMED.">
    <div className="admin-filter-tabs" role="group" aria-label="Lọc trạng thái đơn">{['ALL', 'PENDING', 'CONFIRMED'].map((status) => <button className={filter === status ? 'is-active' : ''} type="button" key={status} onClick={() => setFilter(status)}>{status}</button>)}</div>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !orders.length ? <AdminEmpty title={`Không có order ${filter}`} text="Không tạo dữ liệu order giả để test." /> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Created</th><th>Status</th><th>Customer</th><th>Phone</th><th>Fulfillment</th><th>Ngày/giờ cần</th><th>Subtotal</th><th /></tr></thead><tbody>
      {orders.map((order) => <tr key={order.id}><td>#{order.id}</td><td>{new Date(order.created_at).toLocaleString('vi-VN')}</td><td><span className={`admin-chip admin-chip--${order.status.toLowerCase()}`}>{order.status}</span></td><td>{order.customer_name}</td><td>{order.customer_phone}</td><td>{order.fulfillment_type}</td><td>{order.requested_fulfillment_date || '—'}<small>{order.requested_fulfillment_time || ''}</small></td><td>{money(order.subtotal_amount)}</td><td><Link to={`/admin/orders/${order.id}`}>Chi tiết</Link></td></tr>)}
    </tbody></table></div>}
  </AdminPage>;
}
