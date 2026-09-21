import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { aboutContent } from '../data/siteContent';
import { textFor } from '../utils/i18n';

export default function AboutPage() {
  const { locale } = useApp();
  return (
    <main id="main-content">
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{textFor(aboutContent.hero.eyebrow, locale)}</p>
          <h1>{textFor(aboutContent.hero.title, locale)}</h1>
          <p>{textFor(aboutContent.hero.text, locale)}</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-feature">
          <figure className="about-feature-image" data-demo-admin="about-media">
            <DemoImage src={aboutContent.feature.image} alt={textFor(aboutContent.feature.alt, locale)} loading="eager" />
          </figure>
          <div className="split-feature__copy">
            <p className="eyebrow">{textFor(aboutContent.feature.eyebrow, locale)}</p>
            <h2>{textFor(aboutContent.feature.title, locale)}</h2>
            {aboutContent.feature.paragraphs.map((paragraph) => <p key={paragraph.vi}>{textFor(paragraph, locale)}</p>)}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-heading section-heading--center">
            <div className="section-heading__copy">
              <p className="eyebrow">{locale === 'ko' ? '흘라임이 추구하는 것' : 'Điều Hlime theo đuổi'}</p>
              <h2>{locale === 'ko' ? '섬세함은 어렵거나 멀지 않습니다' : 'Tinh tế không đồng nghĩa với xa cách'}</h2>
            </div>
          </div>
          <div className="about-story-grid" data-demo-admin="about-story-media">
            {aboutContent.stories.map((story) => (
              <article className="about-story" key={story.number}>
                <figure className="about-story__image"><DemoImage src={story.image} alt={textFor(story.alt, locale)} loading="lazy" /></figure>
                <div className="about-story__caption">
                  <span className="about-story__number">{story.number}</span>
                  <div><h3>{textFor(story.title, locale)}</h3><p>{textFor(story.text, locale)}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">{locale === 'ko' ? '오늘 흘라임에 들러보세요' : 'Ghé Hlime hôm nay'}</p>
            <h2>{locale === 'ko' ? '평범한 오늘에도, 아주 특별한 날에도 어울리는 디저트를 골라보세요.' : 'Chọn một món cho ngày thường — hoặc ngày thật đặc biệt.'}</h2>
          </div>
          <div className="button-row">
            <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
            <AppLink className="button button--secondary" to="/contact">{locale === 'ko' ? '흘라임 문의하기' : 'Liên hệ Hlime'}</AppLink>
          </div>
        </div>
      </section>
    </main>
  );
}

