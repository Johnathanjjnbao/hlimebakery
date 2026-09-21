import DemoImage from '../components/DemoImage';
import DemoNote from '../components/DemoNote';
import { useApp } from '../context/AppContext';
import { celebrationEditorial, celebrationFlavors, celebrationSizes } from '../data/celebration';
import { textFor } from '../utils/i18n';

export default function CelebrationPage() {
  const { locale, celebrationDraft, updateCelebrationDraft, addToCart } = useApp();
  const selectedFlavor = celebrationFlavors.find((flavor) => flavor.id === celebrationDraft.flavor) || celebrationFlavors[0];
  const minDate = new Date().toISOString().split('T')[0];

  const submit = (event) => {
    event.preventDefault();
    addToCart('celebration-rose', 1, { ...celebrationDraft });
  };

  return (
    <main id="main-content">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">{locale === 'ko' ? '셀러브레이션 케이크' : 'Celebration Cakes'}</span>
          <h1>{locale === 'ko' ? '오래 기억하고 싶은 날을 위해.' : 'Dành cho những ngày muốn nhớ thật lâu.'}</h1>
          <p>{locale === 'ko' ? '생일과 기념일에 어울리는 우아하고 편안한 디자인의 케이크입니다.' : 'Một mẫu bánh mềm mại, dễ tùy chọn và đủ trang trọng cho sinh nhật hoặc ngày kỷ niệm.'}</p>
        </div>
      </header>

      <section className="section section--white" style={{ paddingTop: '2rem' }}>
        <div className="container celebration-layout">
          <div className="celebration-visual">
            <div className="celebration-visual__image" data-demo-admin="celebration-flavor-media">
              <DemoImage src={selectedFlavor.image} alt={textFor(selectedFlavor.alt, locale)} data-flavor={selectedFlavor.id} />
            </div>
            <figure className="celebration-detail" data-demo-admin="celebration-editorial-media">
              <DemoImage src={celebrationEditorial.image} alt={textFor(celebrationEditorial.alt, locale)} />
              <figcaption><span>{locale === 'ko' ? '수작업으로 완성' : 'Hoàn thiện thủ công'}</span><small>{locale === 'ko' ? '데모 이미지 및 콘텐츠' : 'Ảnh và nội dung demo'}</small></figcaption>
            </figure>
            <DemoNote>{locale === 'ko' ? '케이크, 가격, 사이즈, 맛, 이미지는 모두 데모이며 추후 Products에서 관리됩니다.' : 'Mẫu bánh, giá, size, flavor và ảnh đều là demo; sau này quản lý qua Products.'}</DemoNote>
          </div>

          <form className="form-card" onSubmit={submit}>
            <span className="eyebrow">{locale === 'ko' ? '로즈 가든 케이크 · 데모' : 'Rose Garden Cake · Demo'}</span>
            <h2>{locale === 'ko' ? '케이크 옵션 선택' : 'Chọn bánh của bạn'}</h2>
            <p className="muted">{locale === 'ko' ? '650,000₫부터. 프론트엔드 데모에서는 장바구니에만 담기며 실제 주문은 전송되지 않습니다.' : 'Giá từ 650.000₫. Frontend demo chỉ thêm lựa chọn vào Cart, chưa gửi order thật.'}</p>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="cake-size">{locale === 'ko' ? '사이즈' : 'Size'}</label>
                <select id="cake-size" name="size" required value={celebrationDraft.size} onChange={(event) => updateCelebrationDraft('size', event.target.value)}>
                  {celebrationSizes.map((size) => <option key={size.id} value={size.id}>{textFor(size.label, locale)}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="cake-flavor">{locale === 'ko' ? '맛' : 'Flavor'}</label>
                <select id="cake-flavor" name="flavor" required value={celebrationDraft.flavor} onChange={(event) => updateCelebrationDraft('flavor', event.target.value)}>
                  {celebrationFlavors.map((flavor) => <option key={flavor.id} value={flavor.id}>{textFor(flavor.label, locale)}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cake-date">{locale === 'ko' ? '필요한 날짜' : 'Ngày cần bánh'}</label>
              <input id="cake-date" name="date" type="date" min={minDate} required value={celebrationDraft.date} onChange={(event) => updateCelebrationDraft('date', event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="cake-note">{locale === 'ko' ? '메시지 / 요청사항' : 'Lời nhắn / ghi chú'}</label>
              <textarea id="cake-note" name="note" maxLength="180" value={celebrationDraft.note} onChange={(event) => updateCelebrationDraft('note', event.target.value)} placeholder={locale === 'ko' ? '예: Happy Birthday Mina · 부드러운 핑크 톤' : 'Ví dụ: Happy Birthday Linh · tone hồng nhẹ'} />
            </div>
            <button className="button button--primary" type="submit" style={{ width: '100%' }}>{locale === 'ko' ? '셀러브레이션 케이크 담기' : 'Thêm Celebration vào giỏ'}</button>
          </form>
        </div>
      </section>

      <section className="section celebration-steps">
        <div className="container">
          <div className="section-heading"><div className="section-heading__copy"><span className="eyebrow">{locale === 'ko' ? '주문 순서' : 'Cách đặt'}</span><h2>{locale === 'ko' ? '세 단계로 간단하게.' : 'Ba bước rõ ràng.'}</h2></div></div>
          <div className="why-grid celebration-steps__grid">
            <article className="why-card"><span className="why-card__number">01</span><h3>{locale === 'ko' ? '케이크 선택' : 'Chọn bánh'}</h3><p>{locale === 'ko' ? '사이즈, 맛, 날짜와 메시지를 선택합니다.' : 'Chọn size, flavor, ngày và lời nhắn.'}</p></article>
            <article className="why-card"><span className="why-card__number">02</span><h3>{locale === 'ko' ? '수령 방법 선택' : 'Chọn cách nhận'}</h3><p>{locale === 'ko' ? '매장 픽업 또는 배송을 선택합니다.' : 'Pickup tại cửa hàng hoặc Delivery.'}</p></article>
            <article className="why-card"><span className="why-card__number">03</span><h3>{locale === 'ko' ? 'Hlime 확인' : 'Hlime xác nhận'}</h3><p>{locale === 'ko' ? '실제 주문은 PENDING 상태 후 Hlime 확인을 거쳐 CONFIRMED로 변경됩니다.' : 'Order thật sau này sẽ ở PENDING trước khi Hlime chuyển sang CONFIRMED.'}</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}
