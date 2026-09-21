import { useEffect } from 'react';
import DemoImage from '../components/DemoImage';
import DemoNote from '../components/DemoNote';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { celebrationEditorial } from '../data/celebration';
import { money, textFor } from '../utils/i18n';

export default function CelebrationPage() {
  const { locale, celebrationDraft, updateCelebrationDraft, addToCart } = useApp();
  const { products, sizeOptions, flavorOptions, pageContent, source, error: dataError } = useData();
  const celebrationProduct = products.find((product) => product.active && product.category === 'celebration') || products.find((product) => product.id === 'celebration-rose');
  const celebrationSizes = sizeOptions.filter((option) => option.productId === celebrationProduct?.id);
  const celebrationFlavors = flavorOptions.filter((option) => option.productId === celebrationProduct?.id);
  const selectedFlavor = celebrationFlavors.find((flavor) => flavor.id === celebrationDraft.flavor) || celebrationFlavors[0];
  const minDate = new Date().toISOString().split('T')[0];
  const managed = pageContent.celebration || {};
  const demoSections = {
    hero: {
      eyebrow: { vi: 'Celebration Cakes', ko: '셀러브레이션 케이크' },
      title: { vi: 'Dành cho những ngày muốn nhớ thật lâu.', ko: '오래 기억하고 싶은 날을 위해.' },
      body: {
        vi: 'Một mẫu bánh mềm mại, dễ tùy chọn và đủ trang trọng cho sinh nhật hoặc ngày kỷ niệm.',
        ko: '생일과 기념일에 어울리는 우아하고 편안한 디자인의 케이크입니다.',
      },
    },
    editorial: {
      eyebrow: { vi: 'Hoàn thiện thủ công', ko: '수작업으로 완성' },
      title: { vi: 'Mỗi chi tiết đều được chuẩn bị chỉn chu.', ko: '모든 디테일을 정성스럽게 준비합니다.' },
      image: celebrationEditorial.image,
    },
    'steps-header': {
      eyebrow: { vi: 'Cách đặt', ko: '주문 순서' },
      title: { vi: 'Ba bước rõ ràng.', ko: '세 단계로 간단하게.' },
    },
    'step-1': { title: { vi: 'Chọn bánh', ko: '케이크 선택' }, body: { vi: 'Chọn size, flavor, ngày và lời nhắn.', ko: '사이즈, 맛, 날짜와 메시지를 선택합니다.' } },
    'step-2': { title: { vi: 'Chọn cách nhận', ko: '수령 방법 선택' }, body: { vi: 'Pickup tại cửa hàng hoặc Delivery.', ko: '매장 픽업 또는 배송을 선택합니다.' } },
    'step-3': { title: { vi: 'Hlime xác nhận', ko: 'Hlime 확인' }, body: { vi: 'Order ở trạng thái PENDING trước khi Hlime chuyển sang CONFIRMED.', ko: '주문은 PENDING 상태 후 Hlime 확인을 거쳐 CONFIRMED로 변경됩니다.' } },
  };
  const section = (key) => managed[key] || (source === 'demo' ? demoSections[key] : null);
  const hero = section('hero');
  const editorial = section('editorial');
  const stepsHeader = section('steps-header');
  const steps = [1, 2, 3].map((number) => section(`step-${number}`)).filter(Boolean);

  useEffect(() => {
    if (celebrationSizes.length && !celebrationSizes.some((option) => option.id === celebrationDraft.size)) {
      updateCelebrationDraft('size', celebrationSizes[0].id);
    }
    if (celebrationFlavors.length && !celebrationFlavors.some((option) => option.id === celebrationDraft.flavor)) {
      updateCelebrationDraft('flavor', celebrationFlavors[0].id);
    }
  }, [celebrationDraft.flavor, celebrationDraft.size, celebrationFlavors, celebrationSizes, updateCelebrationDraft]);

  const submit = (event) => {
    event.preventDefault();
    if (celebrationProduct) addToCart(celebrationProduct.id, 1, { ...celebrationDraft });
  };

  return (
    <main id="main-content">
      {hero && <header className="page-hero">
        <div className="container">
          <span className="eyebrow">{textFor(hero.eyebrow, locale)}</span>
          <h1>{textFor(hero.title, locale)}</h1>
          <p>{textFor(hero.body, locale)}</p>
        </div>
      </header>}

      <section className="section section--white" style={{ paddingTop: '2rem' }}>
        <div className="container celebration-layout">
          <div className="celebration-visual">
            <div className="celebration-visual__image" data-demo-admin="celebration-flavor-media">
              <DemoImage src={selectedFlavor?.image || celebrationProduct?.image} alt={selectedFlavor ? textFor(selectedFlavor.alt, locale) : textFor(celebrationProduct?.name, locale)} data-flavor={selectedFlavor?.id} />
            </div>
            {editorial && <figure className="celebration-detail">
              {editorial.image && <DemoImage src={editorial.image} alt={textFor(editorial.title, locale)} />}
              <figcaption><span>{textFor(editorial.eyebrow, locale)}</span><small>{textFor(editorial.title, locale)}</small></figcaption>
            </figure>}
            {(dataError || source !== 'supabase') && <DemoNote>{dataError || (locale === 'ko' ? '예비 데모 데이터를 사용 중입니다.' : 'Đang dùng dữ liệu demo dự phòng.')}</DemoNote>}
          </div>

          <form className="form-card" onSubmit={submit}>
            <span className="eyebrow">{textFor(celebrationProduct?.name, locale) || 'Celebration Cake'} · Hlime</span>
            <h2>{locale === 'ko' ? '케이크 옵션 선택' : 'Chọn bánh của bạn'}</h2>
            <p className="muted">{locale === 'ko' ? `${money(celebrationProduct?.price || 0)}부터. 제출 후 Hlime이 주문을 확인합니다.` : `Giá từ ${money(celebrationProduct?.price || 0)}. Hlime sẽ xác nhận sau khi nhận yêu cầu.`}</p>
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

      {(stepsHeader || steps.length) && <section className="section celebration-steps">
        <div className="container">
          {stepsHeader && <div className="section-heading"><div className="section-heading__copy"><span className="eyebrow">{textFor(stepsHeader.eyebrow, locale)}</span><h2>{textFor(stepsHeader.title, locale)}</h2></div></div>}
          <div className="why-grid celebration-steps__grid">
            {steps.map((step, index) => <article className="why-card" key={step.id || index}><span className="why-card__number">{String(index + 1).padStart(2, '0')}</span><h3>{textFor(step.title, locale)}</h3><p>{textFor(step.body, locale)}</p></article>)}
          </div>
        </div>
      </section>}
    </main>
  );
}
