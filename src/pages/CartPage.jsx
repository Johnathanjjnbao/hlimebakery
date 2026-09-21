import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { celebrationFlavors, celebrationSizes } from '../data/celebration';
import { getProduct } from '../data/products';
import { siteContent } from '../data/siteContent';
import { money, textFor } from '../utils/i18n';

function optionSummary(options, locale) {
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
    orderDraft,
    updateOrderDraft,
    orderStatus,
    setOrderStatus,
    showToast,
  } = useApp();
  const minDate = new Date().toISOString().split('T')[0];
  const validItems = cart.map((item, index) => ({ item, index, product: getProduct(item.productId) })).filter((entry) => entry.product);
  const subtotal = validItems.reduce((total, entry) => total + entry.product.price * entry.item.quantity, 0);

  const submit = (event) => {
    event.preventDefault();
    if (!validItems.length) {
      showToast(locale === 'ko' ? '장바구니가 비어 있습니다.' : 'Giỏ hàng đang trống.');
      return;
    }
    setOrderStatus('PENDING');
  };

  const input = (field) => ({
    value: orderDraft[field],
    onChange: (event) => updateOrderDraft(field, event.target.value),
  });

  return (
    <main id="main-content">
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{locale === 'ko' ? 'V1 장바구니' : 'Giỏ hàng V1'}</p>
          <h1>{locale === 'ko' ? '주문 정보를 작성해 주세요' : 'Hoàn tất thông tin đặt bánh'}</h1>
          <p>{locale === 'ko' ? '선택한 상품을 확인하고 정보를 입력한 뒤 픽업 또는 배송을 선택하세요. 이 프론트엔드 데모는 실제 주문이나 온라인 결제를 처리하지 않습니다.' : 'Kiểm tra món đã chọn, điền thông tin và chọn nhận tại cửa hàng hoặc giao hàng. Frontend demo chưa gửi đơn thật và chưa có thanh toán online.'}</p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-layout">
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
                  <p className="muted">{locale === 'ko' ? '오늘의 데모 메뉴에서 마음에 드는 디저트를 골라보세요.' : 'Hãy chọn một món bánh từ menu demo hôm nay.'}</p>
                  <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
                </div>
              ) : validItems.map(({ item, product, index }) => (
                <article className="cart-item" key={`${product.id}-${JSON.stringify(item.options || {})}-${index}`}>
                  <div className="cart-item__image"><DemoImage src={product.image} alt={`${textFor(product.name, locale)} — demo image`} /></div>
                  <div>
                    <span className="small muted">{textFor(product.categoryName, locale)}</span>
                    <h3>{textFor(product.name, locale)}</h3>
                    {optionSummary(item.options, locale) && <div className="cart-item__options">{optionSummary(item.options, locale)}</div>}
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

            <form className="order-form" id="frontend-order-form" onSubmit={submit}>
              <div className="form-section">
                <p className="form-section__number">01</p>
                <div className="form-section__content">
                  <h2>{locale === 'ko' ? '고객 정보' : 'Thông tin khách hàng'}</h2>
                  <div className="field-grid">
                    <label className="field"><span>{locale === 'ko' ? '이름' : 'Họ và tên'}</span><input type="text" name="customer_name" autoComplete="name" required {...input('customer_name')} placeholder={locale === 'ko' ? '수령인 이름' : 'Tên người nhận'} /></label>
                    <label className="field"><span>{locale === 'ko' ? '전화번호' : 'Số điện thoại'}</span><input type="tel" name="customer_phone" autoComplete="tel" required {...input('customer_phone')} placeholder={locale === 'ko' ? '연락 가능한 전화번호' : 'Số điện thoại liên hệ'} /></label>
                    <label className="field field--wide"><span>{locale === 'ko' ? '이메일 (선택)' : 'Email (không bắt buộc)'}</span><input type="email" name="customer_email" autoComplete="email" {...input('customer_email')} placeholder="email@example.com" /></label>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <p className="form-section__number">02</p>
                <div className="form-section__content">
                  <h2>{locale === 'ko' ? '수령 방법' : 'Cách nhận bánh'}</h2>
                  <div className="choice-grid">
                    <label className="choice-card">
                      <input type="radio" name="fulfillment" value="pickup" checked={orderDraft.fulfillment === 'pickup'} onChange={(event) => updateOrderDraft('fulfillment', event.target.value)} />
                      <span><strong>{locale === 'ko' ? '매장 픽업' : 'Nhận tại cửa hàng'}</strong><small>{textFor(siteContent.addressShort, locale)}</small></span>
                    </label>
                    <label className="choice-card">
                      <input type="radio" name="fulfillment" value="delivery" checked={orderDraft.fulfillment === 'delivery'} onChange={(event) => updateOrderDraft('fulfillment', event.target.value)} />
                      <span><strong>{locale === 'ko' ? '배송' : 'Giao hàng'}</strong><small>{locale === 'ko' ? '배송비는 Hlime 확인 후 안내됩니다' : 'Phí giao hàng sẽ được Hlime xác nhận'}</small></span>
                    </label>
                  </div>
                  {orderDraft.fulfillment === 'delivery' && (
                    <div className="field-grid delivery-fields">
                      <label className="field field--wide"><span>{locale === 'ko' ? '배송 주소' : 'Địa chỉ giao hàng'}</span><input type="text" name="delivery_address" autoComplete="street-address" required {...input('delivery_address')} placeholder={locale === 'ko' ? '상세 배송 주소' : 'Số nhà, tên đường, phường/xã, quận/huyện'} /></label>
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
                    <label className="field"><span>{locale === 'ko' ? '수령 희망일' : 'Ngày cần bánh'}</span><input type="date" name="order_date" min={minDate} required {...input('order_date')} /></label>
                    <label className="field"><span>{locale === 'ko' ? '희망 시간대' : 'Khung giờ dự kiến'}</span><select name="order_time" required {...input('order_time')}><option value="">{locale === 'ko' ? '시간대 선택' : 'Chọn khung giờ'}</option><option>09:00 – 12:00</option><option>12:00 – 16:00</option><option>16:00 – 20:00</option></select></label>
                    <label className="field field--wide"><span>{locale === 'ko' ? '주문 메모 (선택)' : 'Ghi chú đơn hàng (không bắt buộc)'}</span><textarea name="order_note" rows="4" {...input('order_note')} placeholder={locale === 'ko' ? '주문과 관련해 Hlime이 알아야 할 내용을 적어주세요' : 'Thông tin Hlime cần biết về đơn hàng'} /></label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <aside className="cart-summary">
            <p className="eyebrow">{locale === 'ko' ? '주문 요약' : 'Tóm tắt'}</p>
            <h2>{locale === 'ko' ? '주문 내역' : 'Đơn hàng'}</h2>
            <div className="summary-row"><span>{locale === 'ko' ? '상품 금액' : 'Tạm tính'}</span><strong>{money(subtotal)}</strong></div>
            <div className="summary-row"><span>{locale === 'ko' ? '배송비' : 'Phí giao hàng'}</span><span>{locale === 'ko' ? '추후 확인' : 'Xác nhận sau'}</span></div>
            <div className="summary-total"><span>{locale === 'ko' ? '예상 합계' : 'Tổng tạm tính'}</span><strong>{money(subtotal)}</strong></div>
            <div className="notice-box notice-box--small"><strong>{locale === 'ko' ? '현재 결제는 진행되지 않습니다' : 'Không thanh toán ở bước này'}</strong><span>{locale === 'ko' ? '제출 후 주문은 PENDING 상태가 됩니다. Hlime이 연락해 확인한 뒤 CONFIRMED로 변경됩니다.' : 'Sau khi gửi, đơn ở trạng thái PENDING. Hlime sẽ liên hệ xác nhận trước khi chuyển sang CONFIRMED.'}</span></div>
            <button className="button button--primary button--full" type="submit" form="frontend-order-form" disabled={!validItems.length}>{locale === 'ko' ? '데모 주문 제출' : 'Gửi thử đơn hàng'}</button>
            <p className="form-helper">{locale === 'ko' ? '프론트엔드 데모는 실제 데이터를 전송하거나 주문을 생성하지 않습니다.' : 'Frontend demo không gửi dữ liệu hay tạo đơn thật.'}</p>
            <div className={`order-status${orderStatus ? ' is-visible' : ''}`} aria-live="polite">
              {orderStatus === 'PENDING' && <><strong>{locale === 'ko' ? '데모 상태: PENDING' : 'Trạng thái demo: PENDING'}</strong><br />{locale === 'ko' ? '실제 주문은 전송되지 않았습니다. 최종 버전에서는 Hlime 확인 후 CONFIRMED로 변경됩니다.' : 'Chưa có đơn thật nào được gửi. Ở bản chính thức, Hlime sẽ xác nhận rồi chuyển sang CONFIRMED.'}</>}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

