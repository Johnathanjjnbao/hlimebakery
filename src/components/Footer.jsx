import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { textFor } from '../utils/i18n';
import { instagramProfile } from '../utils/socialLinks';
import AppLink from './AppLink';

export default function Footer() {
  const { locale } = useApp();
  const { site: siteContent } = useData();
  const instagram = instagramProfile(siteContent.socialLinks?.instagram);
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
              {textFor(siteContent.tagline, locale)}
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
              {instagram && <a href={instagram.href} target="_blank" rel="noopener noreferrer">{locale === 'ko' ? '인스타그램' : 'Instagram'}</a>}
            </div>
          </div>
          <div>
            <h3>{locale === 'ko' ? '매장' : 'Cửa hàng'}</h3>
            <p className="small">
              {textFor(siteContent.addressShort, locale)}<br />
              {siteContent.phone}<br />
              {textFor(siteContent.hours, locale)}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Hlime Bakery & Pâtisserie</span>
          <span>VI · KO</span>
        </div>
      </div>
    </footer>
  );
}
