import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';

const Info = ({ label, children }) => <div className="admin-detail-row"><span>{label}</span><strong>{children || '—'}</strong></div>;

export default function OrderDetailPage() {
  const { id } = useParams();
  const { refreshPending } = useOutletContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await requireSupabase().from('orders').select('*, order_items(*)').eq('id', id).single();
    if (loadError) setError(loadError.message); else { setOrder(data); setError(''); }
    setLoading(false);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const confirmOrder = async () => {
    if (!window.confirm(`Chuyển Order #${id} từ PENDING sang CONFIRMED?`)) return;
    setConfirming(true);
    const { data, error: updateError } = await requireSupabase().rpc('confirm_order', { p_order_id: Number(id) }).single();
    if (updateError) setStatus({ type: 'error', message: updateError.message });
    else {
      setOrder((current) => ({ ...current, status: data.order_status, confirmed_at: data.confirmed_at }));
      setStatus({ type: 'success', message: 'Order đã chuyển sang CONFIRMED.' });
      await refreshPending();
    }
    setConfirming(false);
  };

  return <AdminPage title={`Order #${id}`} description="Snapshot item chỉ đọc, không thay đổi sau khi order đã tồn tại." action={<Link className="admin-button admin-button--secondary" to="/admin/orders">Quay lại Orders</Link>}>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : <>
      <div className="admin-detail-grid">
        <section className="admin-card"><h2>Customer</h2><Info label="Name">{order.customer_name}</Info><Info label="Phone">{order.customer_phone}</Info><Info label="Email">{order.customer_email}</Info></section>
        <section className="admin-card"><h2>Fulfillment</h2><Info label="Type">{order.fulfillment_type}</Info><Info label="Address">{order.delivery_address}</Info><Info label="Delivery note">{order.delivery_note}</Info><Info label="Requested">{[order.requested_fulfillment_date, order.requested_fulfillment_time].filter(Boolean).join(' · ')}</Info></section>
        <section className="admin-card"><h2>Order</h2><Info label="Created">{new Date(order.created_at).toLocaleString('vi-VN')}</Info><Info label="Status">{order.status}</Info><Info label="Note">{order.order_note}</Info><Info label="Subtotal">{money(order.subtotal_amount)}</Info>{order.status === 'PENDING' && <button className="admin-button admin-button--primary" type="button" onClick={confirmOrder} disabled={confirming}>{confirming ? 'Đang xác nhận…' : 'Chuyển sang CONFIRMED'}</button>}<SaveNotice status={status} /></section>
      </div>
      <section className="admin-card"><h2>Items</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product snapshot</th><th>Price</th><th>Qty</th><th>Size</th><th>Flavor</th><th>Celebration</th><th>Subtotal</th></tr></thead><tbody>
        {order.order_items.map((item) => <tr key={item.id}><td>{item.product_name_vi}<small>{item.product_name_ko || ''}</small></td><td>{money(item.unit_price_amount)}</td><td>{item.quantity}</td><td>{item.selected_size_label_vi || '—'}</td><td>{item.selected_flavor_label_vi || '—'}</td><td>{item.is_celebration ? <>{item.celebration_required_date}<small>{item.celebration_note || ''}</small></> : '—'}</td><td>{money(item.line_subtotal_amount)}</td></tr>)}
      </tbody></table></div></section>
    </>}
  </AdminPage>;
}
