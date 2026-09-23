import { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

const Info = ({ label, children }) => <div className="admin-detail-row"><span>{label}</span><strong>{children || '—'}</strong></div>;

export default function OrderDetailPage() {
  const { locale, t } = useAdminLanguage();
  const { id } = useParams();
  const { refreshPending } = useOutletContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await requireSupabase().from('orders').select('*, order_items(*)').eq('id', id).single();
    if (loadError) setError(loadError.message); else { setOrder(data); setError(''); }
    setLoading(false);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const confirmOrder = async () => {
    if (!window.confirm(t('orders.confirmPrompt', { id }))) return;
    setConfirming(true);
    const { data, error: updateError } = await requireSupabase().rpc('confirm_order', { p_order_id: Number(id) }).single();
    if (updateError) setStatus({ type: 'error', message: updateError.message });
    else {
      setOrder((current) => ({ ...current, status: data.order_status, confirmed_at: data.confirmed_at }));
      setStatus({ type: 'success', message: t('orders.confirmedSuccess') });
      await refreshPending();
    }
    setConfirming(false);
  };

  const markPaid = async () => {
    if (!window.confirm(t('orders.markPaidPrompt', { code: order.order_code }))) return;
    setMarkingPaid(true);
    const { data, error: updateError } = await requireSupabase().rpc('mark_order_paid', { p_order_id: Number(id) }).single();
    if (updateError) setStatus({ type: 'error', message: updateError.message });
    else {
      setOrder((current) => ({ ...current, payment_status: data.payment_status, paid_at: data.paid_at }));
      setStatus({ type: 'success', message: t('orders.markPaidSuccess') });
    }
    setMarkingPaid(false);
  };

  const statusLabel = (value) => t(value === 'PENDING' ? 'orders.pending' : 'orders.confirmed');
  const fulfillmentLabel = (value) => t(value === 'DELIVERY' ? 'orders.delivery' : 'orders.pickup');
  const paymentMethodLabel = (value) => t(value === 'BANK_TRANSFER' ? 'orders.bankTransfer' : 'orders.cash');
  const paymentStatusLabel = (value) => t(value === 'PAID' ? 'orders.paid' : 'orders.unpaid');

  return <AdminPage title={`${t('orders.order')} ${order?.order_code || `#${id}`}`} description={t('orders.detailDescription')} action={<Link className="admin-button admin-button--secondary" to="/admin/orders">{t('orders.back')}</Link>}>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : <>
      <div className="admin-detail-grid">
        <section className="admin-card"><h2>{t('orders.customerSection')}</h2><Info label={t('common.name')}>{order.customer_name}</Info><Info label={t('common.phone')}>{order.customer_phone}</Info><Info label={t('common.email')}>{order.customer_email}</Info></section>
        <section className="admin-card"><h2>{t('orders.fulfillmentSection')}</h2><Info label={t('common.type')}>{fulfillmentLabel(order.fulfillment_type)}</Info><Info label={t('orders.deliveryAddress')}>{order.delivery_address}</Info><Info label={t('orders.deliveryNote')}>{order.delivery_note}</Info><Info label={t('orders.requested')}>{[order.requested_fulfillment_date, order.requested_fulfillment_time].filter(Boolean).join(' · ')}</Info></section>
        <section className="admin-card"><h2>{t('orders.orderSection')}</h2><Info label={t('orders.orderCode')}>{order.order_code}</Info><Info label={t('common.created')}>{new Date(order.created_at).toLocaleString(locale === 'ko' ? 'ko-KR' : 'vi-VN')}</Info><Info label={t('common.status')}>{statusLabel(order.status)}</Info><Info label={t('common.note')}>{order.order_note}</Info><Info label={t('common.subtotal')}>{money(order.subtotal_amount)}</Info>{order.status === 'PENDING' && <button className="admin-button admin-button--primary" type="button" onClick={confirmOrder} disabled={confirming}>{confirming ? t('orders.confirming') : t('orders.confirmAction')}</button>}</section>
        <section className="admin-card"><h2>{t('orders.paymentSection')}</h2><Info label={t('orders.paymentMethod')}>{paymentMethodLabel(order.payment_method)}</Info><Info label={t('orders.paymentStatus')}>{paymentStatusLabel(order.payment_status)}</Info><Info label={t('orders.paidAt')}>{order.paid_at ? new Date(order.paid_at).toLocaleString(locale === 'ko' ? 'ko-KR' : 'vi-VN') : null}</Info>{order.payment_method === 'BANK_TRANSFER' && <><Info label={t('orderSettings.bankName')}>{order.payment_bank_name_snapshot}</Info><Info label={t('orderSettings.accountNo')}>{order.payment_account_no_snapshot}</Info><Info label={t('orderSettings.accountName')}>{order.payment_account_name_snapshot}</Info></>}{order.payment_status === 'UNPAID' && <button className="admin-button admin-button--primary" type="button" onClick={markPaid} disabled={markingPaid}>{markingPaid ? t('orders.markingPaid') : t('orders.markPaidAction')}</button>}<SaveNotice status={status} /></section>
      </div>
      <section className="admin-card"><h2>{t('common.items')}</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{t('orders.productSnapshot')}</th><th>{t('common.price')}</th><th>{t('common.quantity')}</th><th>{t('orders.size')}</th><th>{t('orders.flavor')}</th><th>{t('orders.celebration')}</th><th>{t('common.subtotal')}</th></tr></thead><tbody>
        {order.order_items.map((item) => <tr key={item.id}><td>{item.product_name_vi}<small>{item.product_name_ko || ''}</small></td><td>{money(item.unit_price_amount)}</td><td>{item.quantity}</td><td>{item.selected_size_label_vi || '—'}</td><td>{item.selected_flavor_label_vi || '—'}</td><td>{item.is_celebration ? <>{item.celebration_required_date}<small>{item.celebration_note || ''}</small></> : '—'}</td><td>{money(item.line_subtotal_amount)}</td></tr>)}
      </tbody></table></div></section>
    </>}
  </AdminPage>;
}
