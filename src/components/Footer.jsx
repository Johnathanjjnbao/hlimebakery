import { siteContent } from '../data/siteContent';
import { useApp } from '../context/AppContext';
import { textFor } from '../utils/i18n';
import AppLink from './AppLink';

export default function Footer() {
  const { locale } = useApp();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <AppLink className="brand" to="/">
              <span className="brand__name">{siteContent.brand}</span>
              <span className="brand__sub">{siteContent.brandSub}</span>
            </AppLink>
            <p className="small" style={{ maxWidth: 310, marginTop: '1.2rem' }}>
              {siteContent.tagline} {locale === 'ko' ? '아래 연락처는 프론트엔드 데모입니다.' : 'Dữ liệu liên hệ bên dưới là demo cho frontend.'}
            </p>
          </div>
          <div>
            <h3>{locale === 'ko' ? '둘러보기' : 'Khám phá'}</h3>
            <div className="footer-links">
              <AppLink to="/menu">{locale === 'ko' ? '메뉴' : 'Menu'}</AppLink>
              <AppLink to="/celebration">{locale === 'ko' ? '셀러브레이션' : 'Celebration'}</AppLink>
              <AppLink to="/about">{locale === 'ko' ? '브랜드' : 'Về Hlime'}</AppLink>
            </div>
          </div>
          <div>
            <h3>{locale === 'ko' ? '도움말' : 'Hỗ trợ'}</h3>
            <div className="footer-links">
              <AppLink to="/contact">{locale === 'ko' ? '문의' : 'Liên hệ'}</AppLink>
              <AppLink to="/cart">{locale === 'ko' ? '장바구니' : 'Giỏ hàng'}</AppLink>
              <a href="#instagram-demo">{locale === 'ko' ? '인스타그램 (데모)' : 'Instagram (demo)'}</a>
            </div>
          </div>
          <div>
            <h3>{locale === 'ko' ? '데모 매장' : 'Cửa hàng demo'}</h3>
            <p className="small">
              {textFor(siteContent.addressShort, locale)}<br />
              {siteContent.phone}<br />
              {textFor(siteContent.hours, locale)}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Hlime Frontend</span>
          <span>{locale === 'ko' ? '데모 — 실제 운영 데이터가 아닙니다' : 'DEMO — Không phải dữ liệu production'}</span>
        </div>
      </div>
    </footer>
  );
}

