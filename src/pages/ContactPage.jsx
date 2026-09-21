import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { contactContent } from '../data/siteContent';
import { textFor } from '../utils/i18n';

const demoSections = {
  hero: { eyebrow: contactContent.hero.eyebrow, title: contactContent.hero.title, body: contactContent.hero.text },
  atmosphere: {
    eyebrow: { vi: 'Một góc Hlime', ko: 'Hlime의 한 장면' },
    title: { vi: 'Hlime Bakery & Pâtisserie', ko: '흘라임 베이커리 & 파티세리' },
    image: contactContent.atmosphereImage,
  },
  support: {
    eyebrow: { vi: 'Cần Hlime tư vấn?', ko: '상담이 필요하신가요?' },
    title: { vi: 'Liên hệ theo cách thuận tiện nhất', ko: '가장 편한 방법으로 문의해 주세요' },
    body: {
      vi: 'Hlime sẽ hỗ trợ lựa chọn sản phẩm, Celebration và thông tin nhận bánh.',
      ko: '상품 선택, 셀러브레이션 케이크와 수령 정보를 안내해 드립니다.',
    },
  },
};

export default function ContactPage() {
  const { locale } = useApp();
  const { site: siteContent, pageContent, source } = useData();
  const managed = pageContent.contact || {};
  const section = (key) => managed[key] || (source === 'demo' ? demoSections[key] : null);
  const hero = section('hero');
  const atmosphere = section('atmosphere');
  const support = section('support');
  const preferredHref = siteContent.preferredContactChannel === 'email' ? `mailto:${siteContent.email}` : siteContent.phoneHref;
  const preferredLabel = siteContent.preferredContactChannel === 'email'
    ? (locale === 'ko' ? '이메일 보내기' : 'Gửi email')
    : (locale === 'ko' ? '전화하기' : 'Gọi Hlime');

  return (
    <main id="main-content">
      {hero && <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{textFor(hero.eyebrow, locale)}</p>
          <h1>{textFor(hero.title, locale)}</h1>
          <p>{textFor(hero.body, locale)}</p>
        </div>
      </section>}

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-stack">
            {atmosphere?.image && <figure className="contact-atmosphere">
              <DemoImage src={atmosphere.image} alt={textFor(atmosphere.title, locale)} loading="eager" />
              <figcaption><span>{textFor(atmosphere.eyebrow, locale)}</span></figcaption>
            </figure>}
            <article className="contact-card">
              <p className="eyebrow">{locale === 'ko' ? '주소' : 'Địa chỉ'}</p>
              <h2>{textFor(atmosphere?.title, locale) || 'Hlime Bakery & Pâtisserie'}</h2>
              <p>{textFor(siteContent.address, locale)}</p>
              {siteContent.mapUrl && <a className="text-link" href={siteContent.mapUrl} target="_blank" rel="noreferrer">{locale === 'ko' ? '지도 열기 ↗' : 'Mở bản đồ ↗'}</a>}
            </article>
            <div className="contact-card-grid">
              <article className="contact-card contact-card--small">
                <p className="eyebrow">{locale === 'ko' ? '연락처' : 'Liên hệ'}</p>
                <p>{siteContent.phone && <><a href={siteContent.phoneHref}>{siteContent.phone}</a><br /></>}{siteContent.email && <a href={`mailto:${siteContent.email}`}>{siteContent.email}</a>}</p>
              </article>
              <article className="contact-card contact-card--small">
                <p className="eyebrow">{locale === 'ko' ? '영업시간' : 'Giờ mở cửa'}</p>
                <p>{textFor(siteContent.hours, locale)}</p>
              </article>
            </div>
            <div className="map-placeholder" role="img" aria-label={locale === 'ko' ? 'Hlime 매장 위치' : 'Vị trí cửa hàng Hlime'}>
              <span aria-hidden="true">H</span><p>{locale === 'ko' ? 'Hlime 매장 위치' : 'Vị trí cửa hàng Hlime'}</p>
            </div>
          </div>

          {support && <section className="form-card" aria-labelledby="contact-support-title">
            <p className="eyebrow">{textFor(support.eyebrow, locale)}</p>
            <h2 id="contact-support-title">{textFor(support.title, locale)}</h2>
            <p className="muted">{textFor(support.body, locale)}</p>
            <div className="admin-stack">
              {preferredHref && <a className="button button--primary button--full" href={preferredHref}>{preferredLabel}</a>}
              {siteContent.phoneHref && siteContent.preferredContactChannel === 'email' && <a className="button button--secondary button--full" href={siteContent.phoneHref}>{locale === 'ko' ? '전화하기' : 'Gọi điện'}</a>}
              {siteContent.email && siteContent.preferredContactChannel !== 'email' && <a className="button button--secondary button--full" href={`mailto:${siteContent.email}`}>{locale === 'ko' ? '이메일 보내기' : 'Gửi email'}</a>}
              {Object.entries(siteContent.socialLinks || {}).map(([name, url]) => url && <a className="text-link" href={url} target="_blank" rel="noreferrer" key={name}>{name}</a>)}
            </div>
          </section>}
        </div>
      </section>
    </main>
  );
}
