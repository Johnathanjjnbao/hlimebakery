import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import DemoNote from '../components/DemoNote';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useApp } from '../context/AppContext';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { homeContent, siteContent } from '../data/siteContent';
import { textFor } from '../utils/i18n';

const byIds = (ids) => ids.map((id) => products.find((product) => product.id === id)).filter(Boolean);

export default function HomePage() {
  const { locale } = useApp();
  const bestSellers = byIds(['rose-croissant', 'strawberry-tart', 'chocolate-cake', 'petit-gift']);
  const everyday = byIds(['milk-bread', 'rose-croissant', 'lemon-choux']);

  return (
    <main id="main-content">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">{textFor(homeContent.hero.eyebrow, locale)}</span>
            <h1>{textFor(homeContent.hero.title, locale)}</h1>
            <p className="lead">{textFor(homeContent.hero.lead, locale)}</p>
            <div className="hero-actions">
              <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
              <AppLink className="button button--secondary" to="/celebration">{locale === 'ko' ? '케이크 주문' : 'Đặt bánh'}</AppLink>
            </div>
            <DemoNote>{locale === 'ko' ? '히어로 제목, 설명, 이미지는 데모이며 추후 Homepage Settings에서 관리됩니다.' : 'Hero title, subtitle và ảnh đang là demo; sau này quản lý qua Homepage Settings.'}</DemoNote>
          </div>
          <div className="hero-visual">
            <div className="hero-visual__frame">
              <DemoImage src={homeContent.hero.image} alt={textFor(homeContent.hero.imageAlt, locale)} />
            </div>
            <div className="hero-stamp">{textFor(homeContent.hero.stamp, locale)}</div>
          </div>
        </div>
      </section>

      <div className="trust-line" aria-label="Hlime highlights">
        {homeContent.trust.map((item) => (
          <div className="trust-item" key={item.title.vi}>
            <strong>{textFor(item.title, locale)}</strong>
            <span>{textFor(item.text, locale)}</span>
          </div>
        ))}
      </div>

      <section className="section section--white">
        <div className="container">
          <SectionHeading
            eyebrow={locale === 'ko' ? '카테고리로 둘러보기' : 'Khám phá theo nhu cầu'}
            title={locale === 'ko' ? '오늘은 어떤 디저트가 생각나나요?' : 'Hôm nay bạn muốn một chiếc bánh thế nào?'}
          />
          <div className="category-grid">
            {categories.filter((category) => category.id !== 'all').map((category) => {
              const to = category.id === 'celebration' ? '/celebration' : `/menu?category=${category.id}`;
              return (
                <AppLink className="category-card" to={to} key={category.id}>
                  <span className="category-card__image">
                    <DemoImage src={category.image} alt={`${textFor(category.name, locale)} — demo image`} />
                  </span>
                  <strong>{textFor(category.name, locale)}</strong>
                </AppLink>
              );
            })}
          </div>
          <DemoNote>{locale === 'ko' ? '카테고리 이미지와 문구는 데모이며 추후 Categories에서 관리됩니다.' : 'Category image/text là demo; sau này được quản lý qua Categories.'}</DemoNote>
        </div>
      </section>

      <section className="section home-products-section home-products-section--bestsellers">
        <div className="container">
          <SectionHeading
            eyebrow={locale === 'ko' ? '많이 찾는 메뉴' : 'Được yêu thích'}
            title={locale === 'ko' ? 'Hlime 베스트 셀러' : 'Best sellers của Hlime'}
            text={locale === 'ko' ? 'Hlime을 처음 만나는 분께 권하는 편안한 선택입니다.' : 'Những lựa chọn dễ bắt đầu khi bạn lần đầu ghé Hlime.'}
            action={<AppLink className="button button--text" to="/menu">{locale === 'ko' ? '전체 보기' : 'Xem tất cả'}</AppLink>}
          />
          <div className="product-grid">{bestSellers.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container editorial-grid">
          <div className="editorial-image"><DemoImage src={homeContent.editorialMedia.frenchSignature.image} alt={textFor(homeContent.editorialMedia.frenchSignature.alt, locale)} /></div>
          <div className="editorial-copy">
            <span className="eyebrow">{locale === 'ko' ? '프렌치 시그니처' : 'French Signature'}</span>
            <h2>{locale === 'ko' ? '프렌치 테크닉을 편안하게 즐기세요.' : 'Kỹ thuật Pháp, cảm giác thật gần.'}</h2>
            <p>{locale === 'ko' ? '섬세한 레이어와 크림, 과일의 균형을 살리되 어렵지 않게 즐길 수 있는 Hlime의 소프트 프리미엄입니다.' : 'Những lớp bánh, kem và trái cây được cân chỉnh để tinh tế nhưng không xa cách — đúng tinh thần soft premium của Hlime.'}</p>
            <ul className="signature-list">
              <li><span>Opera cà phê</span><span>108.000₫</span></li>
              <li><span>Tarte dâu kem vani</span><span>92.000₫</span></li>
              <li><span>Choux chanh vàng</span><span>72.000₫</span></li>
            </ul>
            <AppLink className="button button--primary" to="/menu?category=patisserie">{locale === 'ko' ? '파티세리 보기' : 'Khám phá Pâtisserie'}</AppLink>
          </div>
        </div>
      </section>

      <section className="section home-products-section home-products-section--everyday">
        <div className="container">
          <SectionHeading eyebrow="Everyday Favorites" title={locale === 'ko' ? '평범한 하루를 위한 작은 기쁨.' : 'Những niềm vui nhỏ cho ngày thường.'} />
          <div className="product-grid">{everyday.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container feature-panel">
          <div className="feature-panel__copy">
            <span className="eyebrow" style={{ color: '#f4dce3' }}>Celebration</span>
            <h2>{locale === 'ko' ? '소중한 날을 조금 더 특별하게.' : 'Cho một ngày đáng nhớ hơn một chút.'}</h2>
            <p>{locale === 'ko' ? '사이즈, 맛, 필요한 날짜와 메시지를 선택하세요. 프론트엔드 데모에서는 장바구니에만 담기며 실제 주문은 전송되지 않습니다.' : 'Chọn size, flavor, ngày cần bánh và lời nhắn. Frontend demo sẽ thêm lựa chọn vào Cart nhưng chưa gửi order thật.'}</p>
            <AppLink className="button button--light" to="/celebration">{locale === 'ko' ? '셀러브레이션 케이크 보기' : 'Xem bánh Celebration'}</AppLink>
          </div>
          <div className="feature-panel__image"><DemoImage src={homeContent.editorialMedia.celebration.image} alt={textFor(homeContent.editorialMedia.celebration.alt, locale)} /></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Why Hlime" title={locale === 'ko' ? '섬세하지만 언제나 편안하게.' : 'Chỉn chu, nhưng vẫn thật dễ gần.'} />
          <div className="why-story-grid" data-demo-admin="homepage-why-media">
            {homeContent.why.map((item) => (
              <article className="why-story" key={item.number}>
                <figure className="why-story__image"><DemoImage src={item.image} alt={textFor(item.alt, locale)} loading="lazy" /></figure>
                <div className="why-story__caption">
                  <span className="why-story__number">{item.number}</span>
                  <div><h3>{textFor(item.title, locale)}</h3><p>{textFor(item.text, locale)}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--pink">
        <div className="container story-layout">
          <div className="story-copy">
            <span className="eyebrow">{locale === 'ko' ? 'Hlime 이야기' : 'Câu chuyện Hlime'}</span>
            <h2>{locale === 'ko' ? '좋은 디저트는 어렵거나 멀게 느껴질 필요가 없다는 믿음에서 시작했습니다.' : 'Bắt đầu từ niềm tin rằng bánh ngon không cần tạo khoảng cách.'}</h2>
            <p>{locale === 'ko' ? '아름답고 맛이 선명하며 일상의 리듬에 자연스럽게 어울리는 디저트를 지향합니다.' : 'Chúng tôi theo đuổi những chiếc bánh đẹp, rõ vị và vừa vặn với nhịp sống hằng ngày.'}</p>
            <AppLink className="button button--secondary" to="/about">{locale === 'ko' ? '브랜드 이야기' : 'Về Hlime'}</AppLink>
          </div>
          <div className="story-image"><DemoImage src={homeContent.editorialMedia.story.image} alt={textFor(homeContent.editorialMedia.story.alt, locale)} /></div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-band">
          <div className="contact-band__copy">
            <span className="eyebrow">{locale === 'ko' ? '한 곳의 데모 매장' : 'Một chi nhánh · Demo'}</span>
            <h2>{locale === 'ko' ? '오늘 Hlime에 들러보세요.' : 'Ghé Hlime hôm nay.'}</h2>
            <div className="info-list">
              <div className="info-row"><strong>{locale === 'ko' ? '주소' : 'Địa chỉ'}</strong><span>{textFor(siteContent.addressShort, locale)}</span></div>
              <div className="info-row"><strong>{locale === 'ko' ? '영업시간' : 'Giờ mở cửa'}</strong><span>{textFor(siteContent.hours, locale)}</span></div>
              <div className="info-row"><strong>{locale === 'ko' ? '전화' : 'Điện thoại'}</strong><span>{siteContent.phone}</span></div>
            </div>
            <AppLink className="button button--primary" to="/contact">{locale === 'ko' ? '연락처 보기' : 'Thông tin liên hệ'}</AppLink>
            <DemoNote>{locale === 'ko' ? '주소, 전화, 이메일, 영업시간, 소셜 및 지도 링크는 데모이며 추후 Site Settings에서 관리됩니다.' : 'Địa chỉ, SĐT, email, giờ mở cửa, social và map link là demo; sau này quản lý qua Site Settings.'}</DemoNote>
          </div>
          <div className="contact-band__map" aria-label="Demo map placeholder"><div className="map-pin"><span>H</span></div></div>
        </div>
      </section>
    </main>
  );
}
