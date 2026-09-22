import { useEffect, useState } from 'react';
import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { buildOrderPayload, clearOrderRequestId, submitPublicOrder } from '../lib/orders';
import { money, textFor } from '../utils/i18n';
import { clearOrderReceipt, readOrderReceipt, storeOrderReceipt } from '../utils/orderReceipt';
import { isValidVietnamPhone, normalizePhone } from '../utils/phone';

const validationMessages = {
  vi: {
    nameRequired: 'Vui lòng nhập họ và tên.',
    phoneInvalid: 'Số điện thoại phải có 10 chữ số bắt đầu bằng 0 hoặc +84 và 9 chữ số.',
    emailInvalid: 'Vui lòng nhập địa chỉ email hợp lệ.',
    addressRequired: 'Vui lòng nhập địa chỉ giao hàng.',
    dateRequired: 'Vui lòng chọn ngày cần bánh.',
    datePast: 'Ngày cần bánh không được ở trong quá khứ.',
    timeRequired: 'Vui lòng chọn khung giờ.',
    network: 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.',
    submit: 'Không thể gửi đơn hàng. Vui lòng thử lại.',
  },
  ko: {
    nameRequired: '이름을 입력해 주세요.',
    phoneInvalid: '전화번호는 0으로 시작하는 10자리 또는 +84와 9자리 숫자로 입력해 주세요.',
    emailInvalid: '올바른 이메일 주소를 입력해 주세요.',
    addressRequired: '배송 주소를 입력해 주세요.',
    dateRequired: '케이크가 필요한 날짜를 선택해 주세요.',
    datePast: '과거 날짜는 선택할 수 없습니다.',
    timeRequired: '희망 시간대를 선택해 주세요.',
    network: '연결할 수 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.',
    submit: '주문을 보낼 수 없습니다. 다시 시도해 주세요.',
  },
};

function validateOrderDraft(orderDraft, minDate) {
  const errors = {};
  if (!orderDraft.customer_name.trim()) errors.customer_name = 'nameRequired';
  if (!isValidVietnamPhone(orderDraft.customer_phone)) errors.customer_phone = 'phoneInvalid';
  if (orderDraft.customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderDraft.customer_email.trim())) errors.customer_email = 'emailInvalid';
  if (orderDraft.fulfillment === 'delivery' && !orderDraft.delivery_address.trim()) errors.delivery_address = 'addressRequired';
  if (!orderDraft.order_date) errors.order_date = 'dateRequired';
  else if (orderDraft.order_date < minDate) errors.order_date = 'datePast';
  if (!orderDraft.order_time) errors.order_time = 'timeRequired';
  return errors;
}

function isNetworkError(error) {
  return error instanceof TypeError || /fetch|network|connection/i.test(String(error?.message || ''));
}

function optionSummary(options, locale, celebrationSizes, celebrationFlavors) {
  if (!options) return '';
  const size = celebrationSizes.find((item) => item.id === options.size);
  const flavor = celebrationFlavors.find((item) => item.id === options.flavor);
  const values = [
    size ? textFor(size.label, locale) : options.size,
    flavor ? textFor(flavor.label, locale) : options.flavor,
    options.date,
    options.note,
  ];
  return values.filter(Boolean).join(' · ');
}

export default function CartPage() {
  const {
    locale,
    cart,
    cartCount,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    orderDraft,
    updateOrderDraft,
    orderStatus,
    setOrderStatus,
    showToast,
  } = useApp();
  const { getProduct, sizeOptions: celebrationSizes, flavorOptions: celebrationFlavors, site: siteContent, orderSettings } = useData();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [orderReceipt, setOrderReceipt] = useState(readOrderReceipt);
  const minDate = new Date().toISOString().split('T')[0];
  const validItems = cart.map((item, index) => ({ item, index, product: getProduct(item.productId) })).filter((entry) => entry.product);
  const subtotal = validItems.reduce((total, entry) => total + entry.product.price * entry.item.quantity, 0);
  const receiptStatus = orderReceipt?.order_status || orderStatus;
  const messages = validationMessages[locale];

  useEffect(() => {
    if (validItems.length && orderReceipt) {
      clearOrderReceipt();
      setOrderReceipt(null);
      setOrderStatus('');
    }
  }, [orderReceipt, setOrderStatus, validItems.length]);

  const submit = async (event) => {
    event.preventDefault();
    if (!validItems.length) {
      showToast(locale === 'ko' ? '장바구니가 비어 있습니다.' : 'Giỏ hàng đang trống.');
      return;
    }
    const validationErrors = validateOrderDraft(orderDraft, minDate);
    if (Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors);
      event.currentTarget.elements.namedItem(Object.keys(validationErrors)[0])?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    setOrderReceipt(null);
    try {
      const payload = buildOrderPayload({
        locale,
        orderDraft: { ...orderDraft, customer_phone: normalizePhone(orderDraft.customer_phone) },
        items: validItems,
      });
      const receipt = await submitPublicOrder(payload);
      storeOrderReceipt(receipt);
      setOrderReceipt(receipt);
      setOrderStatus(receipt.order_status);
      clearCart();
      clearOrderRequestId();
      showToast(locale === 'ko' ? '주문 요청을 보냈습니다.' : 'Đã gửi yêu cầu đặt bánh.');
    } catch (error) {
      console.error('Order submission failed.', error);
      setOrderStatus('');
      setSubmitError(isNetworkError(error) ? 'network' : 'submit');
    } finally {
      setSubmitting(false);
    }
  };

  const input = (field) => ({
    value: orderDraft[field],
    onChange: (event) => {
      updateOrderDraft(field, event.target.value);
      setSubmitError('');
      setFieldErrors((current) => ({ ...current, [field]: '' }));
    },
  });

  const fieldError = (field) => fieldErrors[field] ? messages[fieldErrors[field]] : '';

  return (
    <main id="main-content">
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{locale === 'ko' ? 'V1 장바구니' : 'Giỏ hàng V1'}</p>
          <h1>{locale === 'ko' ? '주문 정보를 작성해 주세요' : 'Hoàn tất thông tin đặt bánh'}</h1>
          <p>{locale === 'ko' ? '선택한 상품을 확인하고 정보를 입력한 뒤 픽업 또는 배송을 선택하세요. 온라인 결제는 진행되지 않습니다.' : 'Kiểm tra món đã chọn, điền thông tin và chọn nhận tại cửa hàng hoặc giao hàng. Bước này không xử lý thanh toán online.'}</p>
        </div>
      </section>

      <section className="section">
        <div className={`container cart-layout${!validItems.length ? ' cart-layout--empty' : ''}`}>
          <div className="cart-main">
            <div className="cart-section-heading">
              <div><p className="eyebrow">{locale === 'ko' ? '선택한 상품' : 'Các món đã chọn'}</p><h2>{locale === 'ko' ? `${cartCount}개 상품` : `${cartCount} sản phẩm`}</h2></div>
              <AppLink className="text-link" to="/menu">{locale === 'ko' ? '상품 더 담기' : 'Thêm món khác'}</AppLink>
            </div>
            <div className="cart-list" aria-live="polite">
              {!validItems.length ? (
                <div className="empty-state">
                  <div className="empty-state__icon" aria-hidden="true">♡</div>
                  <h2>{locale === 'ko' ? '장바구니가 비어 있어요' : 'Giỏ hàng đang trống'}</h2>
                  <p className="muted">{locale === 'ko' ? '오늘의 메뉴에서 마음에 드는 디저트를 골라보세요.' : 'Hãy chọn một món bánh từ menu hôm nay.'}</p>
                  <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
                </div>
              ) : validItems.map(({ item, product, index }) => (
                <article className="cart-item" key={`${product.id}-${JSON.stringify(item.options || {})}-${index}`}>
                  <div className="cart-item__image"><DemoImage src={product.image} alt={textFor(product.name, locale)} /></div>
                  <div>
                    <span className="small muted">{textFor(product.categoryName, locale)}</span>
                    <h3>{textFor(product.name, locale)}</h3>
                    {optionSummary(item.options, locale, celebrationSizes, celebrationFlavors) && <div className="cart-item__options">{optionSummary(item.options, locale, celebrationSizes, celebrationFlavors)}</div>}
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateCartQuantity(index, -1)} aria-label={locale === 'ko' ? '수량 줄이기' : 'Giảm số lượng'}>−</button>
                      <input type="number" value={item.quantity} min="1" readOnly aria-label={locale === 'ko' ? '수량' : 'Số lượng'} />
                      <button type="button" onClick={() => updateCartQuantity(index, 1)} aria-label={locale === 'ko' ? '수량 늘리기' : 'Tăng số lượng'}>+</button>
                    </div>
                  </div>
                  <div className="cart-item__right">
                    <strong>{money(product.price * item.quantity)}</strong>
                    <button className="remove-button" type="button" onClick={() => removeCartItem(index)}>{locale === 'ko' ? '삭제' : 'Xóa'}</button>
                  </div>
                </article>
              ))}
            </div>

            {!validItems.length && orderReceipt && (
              <div className="order-status is-visible" aria-live="polite">
                <strong>{locale === 'ko' ? `상태: ${receiptStatus}` : `Trạng thái: ${receiptStatus}`}</strong>
                {orderReceipt.order_id ? ` · #${orderReceipt.order_id}` : ''}<br />
                {textFor(orderSettings.pending_help, locale)}
              </div>
            )}

            {validItems.length > 0 && <form className="order-form" id="frontend-order-form" onSubmit={submit} noValidate>
              <div className="form-section">
                <p className="form-section__number">01</p>
                <div className="form-section__content">
                  <h2>{locale === 'ko' ? '고객 정보' : 'Thông tin khách hàng'}</h2>
                  <div className="field-grid">
                    <label className="field"><span>{locale === 'ko' ? '이름' : 'Họ và tên'}</span><input type="text" name="customer_name" autoComplete="name" required aria-invalid={Boolean(fieldError('customer_name'))} aria-describedby="customer-name-error" {...input('customer_name')} placeholder={locale === 'ko' ? '수령인 이름' : 'Tên người nhận'} />{fieldError('customer_name') && <small className="field-error" id="customer-name-error">{fieldError('customer_name')}</small>}</label>
                    <label className="field"><span>{locale === 'ko' ? '전화번호' : 'Số điện thoại'}</span><input type="tel" name="customer_phone" autoComplete="tel" required aria-invalid={Boolean(fieldError('customer_phone'))} aria-describedby="customer-phone-error" {...input('customer_phone')} placeholder={locale === 'ko' ? '연락 가능한 전화번호' : 'Số điện thoại liên hệ'} />{fieldError('customer_phone') && <small className="field-error" id="customer-phone-error">{fieldError('customer_phone')}</small>}</label>
                    <label className="field field--wide"><span>{locale === 'ko' ? '이메일 (선택)' : 'Email (không bắt buộc)'}</span><input type="email" name="customer_email" autoComplete="email" aria-invalid={Boolean(fieldError('customer_email'))} aria-describedby="customer-email-error" {...input('customer_email')} placeholder="email@example.com" />{fieldError('customer_email') && <small className="field-error" id="customer-email-error">{fieldError('customer_email')}</small>}</label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <p className="form-section__number">02</p>
                <div className="form-section__content">
                  <h2>{locale === 'ko' ? '수령 방법' : 'Cách nhận bánh'}</h2>
                  <div className="choice-grid">
                    <label className="choice-card">
                      <input type="radio" name="fulfillment" value="pickup" checked={orderDraft.fulfillment === 'pickup'} onChange={(event) => { updateOrderDraft('fulfillment', event.target.value); setFieldErrors((current) => ({ ...current, delivery_address: '' })); }} />
                      <span><strong>{locale === 'ko' ? '매장 픽업' : 'Nhận tại cửa hàng'}</strong><small>{textFor(orderSettings.pickup_help, locale) || textFor(siteContent.addressShort, locale)}</small></span>
                    </label>
                    <label className="choice-card">
                      <input type="radio" name="fulfillment" value="delivery" checked={orderDraft.fulfillment === 'delivery'} onChange={(event) => updateOrderDraft('fulfillment', event.target.value)} />
                      <span><strong>{locale === 'ko' ? '배송' : 'Giao hàng'}</strong><small>{textFor(orderSettings.delivery_help, locale)}</small></span>
                    </label>
                  </div>
                  {orderDraft.fulfillment === 'delivery' && (
                    <div className="field-grid delivery-fields">
                      <label className="field field--wide"><span>{locale === 'ko' ? '배송 주소' : 'Địa chỉ giao hàng'}</span><input type="text" name="delivery_address" autoComplete="street-address" required aria-invalid={Boolean(fieldError('delivery_address'))} aria-describedby="delivery-address-error" {...input('delivery_address')} placeholder={locale === 'ko' ? '상세 배송 주소' : 'Số nhà, tên đường, phường/xã, quận/huyện'} />{fieldError('delivery_address') && <small className="field-error" id="delivery-address-error">{fieldError('delivery_address')}</small>}</label>
                      <label className="field field--wide"><span>{locale === 'ko' ? '배송 메모 (선택)' : 'Hướng dẫn giao hàng (không bắt buộc)'}</span><input type="text" name="delivery_note" {...input('delivery_note')} placeholder={locale === 'ko' ? '예: 배송 전 연락' : 'Ví dụ: gọi trước khi giao'} /></label>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <p className="form-section__number">03</p>
                <div className="form-section__content">
                  <h2>{locale === 'ko' ? '시간 및 요청사항' : 'Thời gian và ghi chú'}</h2>
                  <div className="field-grid">
                    <label className="field"><span>{locale === 'ko' ? '수령 희망일' : 'Ngày cần bánh'}</span><input type="date" name="order_date" min={minDate} required aria-invalid={Boolean(fieldError('order_date'))} aria-describedby="order-date-error" {...input('order_date')} />{fieldError('order_date') && <small className="field-error" id="order-date-error">{fieldError('order_date')}</small>}</label>
                    <label className="field"><span>{locale === 'ko' ? '희망 시간대' : 'Khung giờ dự kiến'}</span><select name="order_time" required aria-invalid={Boolean(fieldError('order_time'))} aria-describedby="order-time-error" {...input('order_time')}><option value="">{locale === 'ko' ? '시간대 선택' : 'Chọn khung giờ'}</option><option>09:00 – 12:00</option><option>12:00 – 16:00</option><option>16:00 – 20:00</option></select>{fieldError('order_time') && <small className="field-error" id="order-time-error">{fieldError('order_time')}</small>}</label>
                    <label className="field field--wide"><span>{locale === 'ko' ? '주문 메모 (선택)' : 'Ghi chú đơn hàng (không bắt buộc)'}</span><textarea name="order_note" rows="4" {...input('order_note')} placeholder={locale === 'ko' ? '주문과 관련해 Hlime이 알아야 할 내용을 적어주세요' : 'Thông tin Hlime cần biết về đơn hàng'} /></label>
                  </div>
                </div>
              </div>
            </form>}
          </div>

          {validItems.length > 0 && <aside className="cart-summary">
            <p className="eyebrow">{locale === 'ko' ? '주문 요약' : 'Tóm tắt'}</p>
            <h2>{locale === 'ko' ? '주문 내역' : 'Đơn hàng'}</h2>
            <div className="summary-row"><span>{locale === 'ko' ? '상품 금액' : 'Tạm tính'}</span><strong>{money(subtotal)}</strong></div>
            <div className="summary-row"><span>{locale === 'ko' ? '배송비' : 'Phí giao hàng'}</span><span>{locale === 'ko' ? '추후 확인' : 'Xác nhận sau'}</span></div>
            <div className="summary-total"><span>{locale === 'ko' ? '예상 합계' : 'Tổng tạm tính'}</span><strong>{money(subtotal)}</strong></div>
            <div className="notice-box notice-box--small"><strong>{locale === 'ko' ? '현재 결제는 진행되지 않습니다' : 'Không thanh toán ở bước này'}</strong><span>{locale === 'ko' ? '제출 후 주문은 PENDING 상태가 됩니다. Hlime이 연락해 확인한 뒤 CONFIRMED로 변경됩니다.' : 'Sau khi gửi, đơn ở trạng thái PENDING. Hlime sẽ liên hệ xác nhận trước khi chuyển sang CONFIRMED.'}</span></div>
            <button className="button button--primary button--full" type="submit" form="frontend-order-form" disabled={!validItems.length || submitting}>{submitting ? (locale === 'ko' ? '전송 중…' : 'Đang gửi…') : (locale === 'ko' ? '주문 요청 보내기' : 'Gửi yêu cầu đặt bánh')}</button>
            <p className="form-helper">{textFor(orderSettings.submit_help, locale)}</p>
            <div className={`order-status${receiptStatus || submitError ? ' is-visible' : ''}${submitError ? ' order-status--error' : ''}`} aria-live="polite">
              {receiptStatus === 'PENDING' && <><strong>{locale === 'ko' ? '상태: PENDING' : 'Trạng thái: PENDING'}</strong>{orderReceipt?.order_id ? ` · #${orderReceipt.order_id}` : ''}<br />{textFor(orderSettings.pending_help, locale)}</>}
              {submitError && <><strong>{locale === 'ko' ? '주문을 보내지 못했습니다.' : 'Chưa gửi được đơn hàng.'}</strong><br />{messages[submitError]}<br />{locale === 'ko' ? '장바구니와 입력 정보가 유지되었습니다. 다시 시도해 주세요.' : 'Giỏ hàng và thông tin đã được giữ nguyên. Bạn có thể thử lại.'}</>}
            </div>
          </aside>}
        </div>
      </section>
    </main>
  );
}
