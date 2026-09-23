import { lazy, Suspense, useEffect, useRef } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { AppProvider, useApp } from './context/AppContext';
import { DataProvider } from './context/DataContext';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CelebrationPage from './pages/CelebrationPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import { pathWithoutLocale } from './utils/i18n';

const AdminApp = lazy(() => import('./admin/AdminApp'));

function AdminLoadingFallback() {
  let locale = 'vi';
  try {
    locale = window.localStorage.getItem('hlime-admin-locale') === 'ko' ? 'ko' : 'vi';
  } catch {
    // Keep the default Vietnamese label when storage is unavailable.
  }
  return <main className="admin-auth-loading">{locale === 'ko' ? '관리자 화면을 불러오는 중…' : 'Đang tải Admin…'}</main>;
}

function pageMeta(pathname, locale) {
  const path = pathWithoutLocale(pathname);
  const ko = locale === 'ko';
  const defaults = {
    description: ko
      ? 'Hlime Bakery & Pâtisserie의 섬세한 수제 디저트와 셀러브레이션 케이크를 만나보세요.'
      : 'Khám phá bánh ngọt thủ công và bánh Celebration tinh tế từ Hlime Bakery & Pâtisserie.',
  };
  if (path === '/') return { ...defaults, page: 'home', title: ko ? 'Hlime Bakery & Pâtisserie | 수제 디저트' : 'Hlime Bakery & Pâtisserie | Bánh ngọt thủ công' };
  if (path === '/menu') return { ...defaults, page: 'menu', title: ko ? '메뉴 — Hlime Bakery & Pâtisserie' : 'Menu — Hlime Bakery & Pâtisserie' };
  if (path.startsWith('/product/')) return { ...defaults, page: 'menu', title: ko ? '상품 상세 — Hlime Bakery & Pâtisserie' : 'Chi tiết sản phẩm — Hlime Bakery & Pâtisserie' };
  if (path === '/celebration') return { ...defaults, page: 'celebration', title: ko ? '셀러브레이션 케이크 — Hlime' : 'Bánh Celebration — Hlime' };
  if (path === '/about') return { ...defaults, page: 'about', title: ko ? 'Hlime 소개 — Hlime Bakery & Pâtisserie' : 'Về Hlime — Hlime Bakery & Pâtisserie' };
  if (path === '/contact') return { ...defaults, page: 'contact', title: ko ? '문의 — Hlime Bakery & Pâtisserie' : 'Liên hệ — Hlime Bakery & Pâtisserie' };
  if (path === '/cart') return { ...defaults, page: 'cart', title: ko ? '장바구니 — Hlime Bakery & Pâtisserie' : 'Giỏ hàng — Hlime Bakery & Pâtisserie' };
  return { ...defaults, page: 'not-found', title: '404 — Hlime Bakery & Pâtisserie' };
}

function setHeadLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.head.querySelector(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

function publicUrl(path) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return new URL(`${base}${path === '/' ? '/' : path}`, window.location.origin).href;
}

function Layout() {
  const location = useLocation();
  const { locale, toast } = useApp();
  const basePath = pathWithoutLocale(location.pathname);
  const previousPath = useRef(basePath);

  useEffect(() => {
    const meta = pageMeta(location.pathname, locale);
    document.body.dataset.page = meta.page;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    const route = pathWithoutLocale(location.pathname);
    const viUrl = publicUrl(route);
    const koUrl = publicUrl(route === '/' ? '/ko' : `/ko${route}`);
    setHeadLink('canonical', locale === 'ko' ? koUrl : viUrl);
    setHeadLink('alternate', viUrl, 'vi');
    setHeadLink('alternate', koUrl, 'ko');
    setHeadLink('alternate', viUrl, 'x-default');
    if (previousPath.current !== basePath) window.scrollTo({ top: 0, behavior: 'auto' });
    previousPath.current = basePath;
  }, [basePath, locale, location.pathname]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <div className={`toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DataProvider>
        <Routes>
          <Route path="/admin/*" element={<Suspense fallback={<AdminLoadingFallback />}><AdminApp /></Suspense>} />
          <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/celebration" element={<CelebrationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="/ko" element={<HomePage />} />
          <Route path="/ko/menu" element={<MenuPage />} />
          <Route path="/ko/product/:id" element={<ProductPage />} />
          <Route path="/ko/celebration" element={<CelebrationPage />} />
          <Route path="/ko/about" element={<AboutPage />} />
          <Route path="/ko/contact" element={<ContactPage />} />
          <Route path="/ko/cart" element={<CartPage />} />

          <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </DataProvider>
    </AppProvider>
  );
}
