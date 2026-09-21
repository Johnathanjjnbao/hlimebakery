import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { siteContent } from '../data/siteContent';
import { useApp } from '../context/AppContext';
import { pathWithoutLocale, textFor } from '../utils/i18n';
import AppLink from './AppLink';
import CartButton from './CartButton';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { locale } = useApp();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const currentPath = pathWithoutLocale(location.pathname);

  useEffect(() => {
    setOpen(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  useEffect(() => () => document.body.classList.remove('menu-open'), []);

  const toggleMenu = () => {
    setOpen((current) => {
      document.body.classList.toggle('menu-open', !current);
      return !current;
    });
  };

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    if (path === '/menu') return currentPath === '/menu' || currentPath.startsWith('/product/');
    return currentPath.startsWith(path);
  };

  return (
    <>
      <a className="skip-link" href="#main-content">{locale === 'ko' ? '본문으로 건너뛰기' : 'Bỏ qua đến nội dung'}</a>
      <div className="demo-strip">
        {locale === 'ko'
          ? 'REACT 프론트엔드 · 데모 데이터 — 추후 Admin에서 관리'
          : 'React Frontend · DEMO DATA — Sau này được quản lý qua Admin'}
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <AppLink className="brand" to="/" aria-label={`${siteContent.brand} ${siteContent.brandSub}`}>
            <span className="brand__name">{siteContent.brand}</span>
            <span className="brand__sub">{siteContent.brandSub}</span>
          </AppLink>
          <nav className={`site-nav${open ? ' is-open' : ''}`} id="site-nav" aria-label="Primary navigation">
            {siteContent.navigation.map((item) => (
              <AppLink key={item.id} to={item.path} aria-current={isActive(item.path) ? 'page' : undefined}>
                {textFor(item.label, locale)}
              </AppLink>
            ))}
            <AppLink className="site-nav__order" to="/menu">{locale === 'ko' ? '케이크 주문' : 'Đặt bánh'}</AppLink>
          </nav>
          <div className="header-actions">
            <AppLink className="header-order-button" to="/menu">{locale === 'ko' ? '케이크 주문' : 'Đặt bánh'}</AppLink>
            <LanguageSwitcher />
            <CartButton />
            <button
              className="menu-button"
              type="button"
              aria-controls="site-nav"
              aria-expanded={open}
              aria-label={open ? (locale === 'ko' ? '메뉴 닫기' : 'Đóng menu') : (locale === 'ko' ? '메뉴 열기' : 'Mở menu')}
              onClick={toggleMenu}
            >
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
