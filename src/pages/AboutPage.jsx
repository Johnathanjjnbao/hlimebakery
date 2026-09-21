import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { aboutContent } from '../data/siteContent';
import { textFor } from '../utils/i18n';

const demoSections = {
  hero: {
    eyebrow: aboutContent.hero.eyebrow,
    title: aboutContent.hero.title,
    body: aboutContent.hero.text,
  },
  feature: {
    eyebrow: aboutContent.feature.eyebrow,
    title: aboutContent.feature.title,
    body: {
      vi: aboutContent.feature.paragraphs.map((item) => item.vi).join('\n\n'),
      ko: aboutContent.feature.paragraphs.map((item) => item.ko).join('\n\n'),
    },
    image: aboutContent.feature.image,
  },
  'values-header': {
    eyebrow: { vi: 'Điều Hlime theo đuổi', ko: '흘라임이 추구하는 것' },
    title: { vi: 'Tinh tế không đồng nghĩa với xa cách', ko: '섬세함은 어렵거나 멀지 않습니다' },
  },
  ...Object.fromEntries(aboutContent.stories.map((story, index) => [`value-${index + 1}`, {
    title: story.title,
    body: story.text,
    image: story.image,
  }])),
  cta: {
    eyebrow: { vi: 'Ghé Hlime hôm nay', ko: '오늘 흘라임에 들러보세요' },
    title: { vi: 'Chọn một món cho ngày thường — hoặc ngày thật đặc biệt.', ko: '평범한 오늘에도, 아주 특별한 날에도 어울리는 디저트를 골라보세요.' },
  },
};

export default function AboutPage() {
  const { locale } = useApp();
  const { pageContent, source } = useData();
  const managed = pageContent.about || {};
  const section = (key) => managed[key] || (source === 'demo' ? demoSections[key] : null);
  const hero = section('hero');
  const feature = section('feature');
  const valuesHeader = section('values-header');
  const values = [1, 2, 3].map((number) => section(`value-${number}`)).filter(Boolean);
  const cta = section('cta');

  return (
    <main id="main-content">
      {hero && <section className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="eyebrow">{textFor(hero.eyebrow, locale)}</p>
          <h1>{textFor(hero.title, locale)}</h1>
          <p>{textFor(hero.body, locale)}</p>
        </div>
      </section>}

      {feature && <section className="section">
        <div className="container split-feature">
          {feature.image && <figure className="about-feature-image">
            <DemoImage src={feature.image} alt={textFor(feature.title, locale)} loading="eager" />
          </figure>}
          <div className="split-feature__copy">
            <p className="eyebrow">{textFor(feature.eyebrow, locale)}</p>
            <h2>{textFor(feature.title, locale)}</h2>
            {textFor(feature.body, locale).split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>}

      {(valuesHeader || values.length) && <section className="section section--soft">
        <div className="container">
          {valuesHeader && <div className="section-heading section-heading--center">
            <div className="section-heading__copy">
              <p className="eyebrow">{textFor(valuesHeader.eyebrow, locale)}</p>
              <h2>{textFor(valuesHeader.title, locale)}</h2>
            </div>
          </div>}
          <div className="about-story-grid">
            {values.map((story, index) => (
              <article className="about-story" key={story.id || index}>
                {story.image && <figure className="about-story__image"><DemoImage src={story.image} alt={textFor(story.title, locale)} loading="lazy" /></figure>}
                <div className="about-story__caption">
                  <span className="about-story__number">{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{textFor(story.title, locale)}</h3><p>{textFor(story.body, locale)}</p></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {cta && <section className="section">
        <div className="container cta-panel">
          <div><p className="eyebrow">{textFor(cta.eyebrow, locale)}</p><h2>{textFor(cta.title, locale)}</h2></div>
          <div className="button-row">
            <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem menu'}</AppLink>
            <AppLink className="button button--secondary" to="/contact">{locale === 'ko' ? '흘라임 문의하기' : 'Liên hệ Hlime'}</AppLink>
          </div>
        </div>
      </section>}
    </main>
  );
}
