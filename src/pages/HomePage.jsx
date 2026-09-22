import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import DemoNote from '../components/DemoNote';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import LocationMap from '../components/LocationMap';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { money, textFor } from '../utils/i18n';

export default function HomePage() {
  const { locale } = useApp();
  const { categories, products, home: homeContent, homeSections, site: siteContent, source, error: dataError } = useData();
  const fallbackEnabled = source === 'demo';
  const section = (key, fallback = null) => homeSections[key] || (fallbackEnabled ? fallback : null);
  const hero = section('hero', {
    eyebrow: homeContent.hero.eyebrow,
    title: homeContent.hero.title,
    subtitle: homeContent.hero.lead,
    body: homeContent.hero.stamp,
    image: homeContent.hero.image,
  });
  const trustSections = [1, 2, 3].map((number, index) => section(`trust-${number}`, {
    title: homeContent.trust[index].title,
    body: homeContent.trust[index].text,
  })).filter(Boolean);
  const categorySection = section('category-intro', {
    eyebrow: { vi: 'Khám phá theo nhu cầu', ko: '카테고리로 둘러보기' },
    title: { vi: 'Hôm nay bạn muốn một chiếc bánh thế nào?', ko: '오늘은 어떤 디저트가 생각나나요?' },
  });
  const bestSellerSection = section('best-sellers', {
    eyebrow: { vi: 'Được yêu thích', ko: '많이 찾는 메뉴' },
    title: { vi: 'Best sellers của Hlime', ko: 'Hlime 베스트 셀러' },
    subtitle: { vi: 'Những lựa chọn dễ bắt đầu khi bạn lần đầu ghé Hlime.', ko: 'Hlime을 처음 만나는 분께 권하는 편안한 선택입니다.' },
  });
  const frenchSection = section('french-signature', {
    eyebrow: { vi: 'French Signature', ko: '프렌치 시그니처' },
    title: { vi: 'Kỹ thuật Pháp, cảm giác thật gần.', ko: '프렌치 테크닉을 편안하게 즐기세요.' },
    body: { vi: 'Những lớp bánh, kem và trái cây được cân chỉnh để tinh tế nhưng không xa cách — đúng tinh thần soft premium của Hlime.', ko: '섬세한 레이어와 크림, 과일의 균형을 살리되 어렵지 않게 즐길 수 있는 Hlime의 소프트 프리미엄입니다.' },
    image: homeContent.editorialMedia.frenchSignature.image,
  });
  const everydaySection = section('everyday', {
    eyebrow: { vi: 'Everyday Favorites', ko: 'Everyday Favorites' },
    title: { vi: 'Những niềm vui nhỏ cho ngày thường.', ko: '평범한 하루를 위한 작은 기쁨.' },
  });
  const celebrationSection = section('celebration', {
    eyebrow: { vi: 'Celebration', ko: '셀러브레이션' },
    title: { vi: 'Cho một ngày đáng nhớ hơn một chút.', ko: '소중한 날을 조금 더 특별하게.' },
    body: { vi: 'Chọn size, flavor, ngày cần bánh và lời nhắn.', ko: '사이즈, 맛, 필요한 날짜와 메시지를 선택하세요.' },
    image: homeContent.editorialMedia.celebration.image,
  });
  const whyHeader = section('why-header', {
    eyebrow: { vi: 'Why Hlime', ko: 'Why Hlime' },
    title: { vi: 'Chỉn chu, nhưng vẫn thật dễ gần.', ko: '섬세하지만 언제나 편안하게.' },
  });
  const whySections = [1, 2, 3].map((number, index) => section(`why-${number}`, {
    title: homeContent.why[index].title,
    body: homeContent.why[index].text,
    image: homeContent.why[index].image,
  })).filter(Boolean);
  const storySection = section('about-preview', {
    eyebrow: { vi: 'Câu chuyện Hlime', ko: 'Hlime 이야기' },
    title: { vi: 'Bắt đầu từ niềm tin rằng bánh ngon không cần tạo khoảng cách.', ko: '좋은 디저트는 어렵거나 멀게 느껴질 필요가 없다는 믿음에서 시작했습니다.' },
    body: { vi: 'Chúng tôi theo đuổi những chiếc bánh đẹp, rõ vị và vừa vặn với nhịp sống hằng ngày.', ko: '아름답고 맛이 선명하며 일상의 리듬에 자연스럽게 어울리는 디저트를 지향합니다.' },
    image: homeContent.editorialMedia.story.image,
  });
  const contactSection = section('contact-preview', {
    eyebrow: { vi: 'Một chi nhánh', ko: '한 곳의 매장' },
    title: { vi: 'Ghé Hlime hôm nay.', ko: '오늘 Hlime에 들러보세요.' },
  });
  const bestSellers = products.filter((product) => product.active && product.bestSeller).slice(0, 4);
  const everyday = products.filter((product) => product.active && (product.category === 'everyday' || product.category === 'viennoiserie')).slice(0, 3);
  const signatureProducts = products.filter((product) => product.active && product.category === 'patisserie').slice(0, 3);
  const dataNote = dataError
    ? (locale === 'ko' ? '연결할 수 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요.' : 'Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.')
    : (locale === 'ko' ? '예비 데모 콘텐츠를 사용 중입니다.' : 'Đang dùng nội dung demo dự phòng.');

  return (
    <main id="main-content">
      {hero && <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{textFor(hero.eyebrow, locale)}</span>
            <h1>{textFor(hero.title, locale)}</h1>
            <p className="lead">{textFor(hero.subtitle, locale)}</p>
            <div className="hero-actions">
              <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
              <AppLink className="button button--secondary" to="/celebration">{locale === 'ko' ? '케이크 주문' : 'Đặt bánh'}</AppLink>
            </div>
            {(dataError || source !== 'supabase') && <DemoNote>{dataNote}</DemoNote>}
          </div>
          <div className="hero-visual">
            <div className="hero-visual__frame">
              <DemoImage src={hero.image} alt={textFor(hero.title, locale)} />
            </div>
            <div className="hero-stamp">{textFor(hero.body, locale)}</div>
          </div>
        </div>
      </section>}

      {trustSections.length > 0 && <div className="trust-line" aria-label="Hlime highlights">
        {trustSections.map((item) => (
          <div className="trust-item" key={item.id || item.title.vi}>
            <strong>{textFor(item.title, locale)}</strong>
            <span>{textFor(item.body, locale)}</span>
          </div>
        ))}
      </div>}

      {categorySection && <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow={textFor(categorySection.eyebrow, locale)}
            title={textFor(categorySection.title, locale)}
          />
          <div className="category-grid">
            {categories.filter((category) => category.id !== 'all').map((category) => {
              const to = category.id === 'celebration' ? '/celebration' : `/menu?category=${category.id}`;
              return (
                <AppLink className="category-card" to={to} key={category.id}>
                  <span className="category-card__image">
                    <DemoImage src={category.image} alt={textFor(category.name, locale)} />
                  </span>
                  <strong>{textFor(category.name, locale)}</strong>
                </AppLink>
              );
            })}
          </div>
            {(dataError || source !== 'supabase') && <DemoNote>{dataNote}</DemoNote>}
        </div>
      </section>}

      {bestSellerSection && <section className="section home-products-section home-products-section--bestsellers">
        <div className="container">
          <SectionHeading
            eyebrow={textFor(bestSellerSection.eyebrow, locale)}
            title={textFor(bestSellerSection.title, locale)}
            text={textFor(bestSellerSection.subtitle, locale)}
            action={<AppLink className="button button--text" to="/menu">{locale === 'ko' ? '전체 보기' : 'Xem tất cả'}</AppLink>}
          />
          <div className="product-grid">{bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>}

      {frenchSection && <section className="section section--white">
        <div className="container editorial-grid">
          <div className="editorial-image"><DemoImage src={frenchSection.image} alt={textFor(frenchSection.title, locale)} /></div>
          <div className="editorial-copy">
            <span className="eyebrow">{textFor(frenchSection.eyebrow, locale)}</span>
            <h2>{textFor(frenchSection.title, locale)}</h2>
            <p>{textFor(frenchSection.body, locale)}</p>
            <ul className="signature-list">
              {signatureProducts.map((product) => <li key={product.id}><span>{textFor(product.name, locale)}</span><span>{money(product.price)}</span></li>)}
            </ul>
            <AppLink className="button button--primary" to="/menu?category=patisserie">{locale === 'ko' ? '파티세리 보기' : 'Khám phá Pâtisserie'}</AppLink>
          </div>
        </div>
      </section>}

      {everydaySection && <section className="section home-products-section home-products-section--everyday">
        <div className="container">
          <SectionHeading eyebrow={textFor(everydaySection.eyebrow, locale)} title={textFor(everydaySection.title, locale)} />
          <div className="product-grid">{everyday.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>}

      {celebrationSection && <section className="section section--white">
        <div className="container feature-panel">
          <div className="feature-panel__copy">
            <span className="eyebrow" style={{ color: '#f4dce3' }}>{textFor(celebrationSection.eyebrow, locale)}</span>
            <h2>{textFor(celebrationSection.title, locale)}</h2>
            <p>{textFor(celebrationSection.body, locale)}</p>
            <AppLink className="button button--light" to="/celebration">{locale === 'ko' ? '셀러브레이션 케이크 보기' : 'Xem bánh Celebration'}</AppLink>
          </div>
          <div className="feature-panel__image"><DemoImage src={celebrationSection.image} alt={textFor(celebrationSection.title, locale)} /></div>
        </div>
      </section>}

      {(whyHeader || whySections.length) && <section className="section">
        <div className="container">
          {whyHeader && <SectionHeading eyebrow={textFor(whyHeader.eyebrow, locale)} title={textFor(whyHeader.title, locale)} />}
          <div className="why-story-grid">
            {whySections.map((item, index) => (
              <article className="why-story" key={item.id || index}>
                {item.image && <figure className="why-story__image"><DemoImage src={item.image} alt={textFor(item.title, locale)} loading="lazy" /></figure>}
                <div className="why-story__caption">
                  <span className="why-story__number">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{textFor(item.title, locale)}</h3><p>{textFor(item.body, locale)}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {storySection && <section className="section section--pink">
        <div className="container story-layout">
          <div className="story-copy">
            <span className="eyebrow">{textFor(storySection.eyebrow, locale)}</span>
            <h2>{textFor(storySection.title, locale)}</h2>
            <p>{textFor(storySection.body, locale)}</p>
            <AppLink className="button button--secondary" to="/about">{locale === 'ko' ? '브랜드 이야기' : 'Về Hlime'}</AppLink>
          </div>
          <div className="story-image"><DemoImage src={storySection.image} alt={textFor(storySection.title, locale)} /></div>
        </div>
      </section>}

      {contactSection && <section className="section">
        <div className="container contact-band">
          <div className="contact-band__copy">
            <span className="eyebrow">{textFor(contactSection.eyebrow, locale)}</span>
            <h2>{textFor(contactSection.title, locale)}</h2>
            <div className="info-list">
              <div className="info-row"><strong>{locale === 'ko' ? '주소' : 'Địa chỉ'}</strong><span>{textFor(siteContent.addressShort, locale)}</span></div>
              <div className="info-row"><strong>{locale === 'ko' ? '영업시간' : 'Giờ mở cửa'}</strong><span>{textFor(siteContent.hours, locale)}</span></div>
              <div className="info-row"><strong>{locale === 'ko' ? '전화' : 'Điện thoại'}</strong><span>{siteContent.phone}</span></div>
            </div>
            <AppLink className="button button--primary" to="/contact">{locale === 'ko' ? '연락처 보기' : 'Thông tin liên hệ'}</AppLink>
            {(dataError || source !== 'supabase') && <DemoNote>{dataNote}</DemoNote>}
          </div>
          <LocationMap className="contact-band__map" address={siteContent.address} mapUrl={siteContent.mapUrl} locale={locale} />
        </div>
      </section>}
    </main>
  );
}
