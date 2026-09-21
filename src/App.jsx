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

function pageMeta(pathname) {
  const path = pathWithoutLocale(pathname);
  if (path === '/') return { page: 'home', title: 'Hlime Bakery & Pâtisserie' };
  if (path === '/menu') return { page: 'menu', title: 'Menu — Hlime' };
  if (path.startsWith('/product/')) return { page: 'menu', title: 'Product Detail — Hlime' };
  if (path === '/celebration') return { page: 'celebration', title: 'Celebration — Hlime' };
  if (path === '/about') return { page: 'about', title: 'Về Hlime — Hlime Bakery & Pâtisserie' };
  if (path === '/contact') return { page: 'contact', title: 'Liên hệ — Hlime Bakery & Pâtisserie' };
  if (path === '/cart') return { page: 'cart', title: 'Giỏ hàng — Hlime Bakery & Pâtisserie' };
  return { page: 'not-found', title: '404 — Hlime Bakery & Pâtisserie' };
}

function Layout() {
  const location = useLocation();
  const { toast } = useApp();
  const basePath = pathWithoutLocale(location.pathname);
  const previousPath = useRef(basePath);

  useEffect(() => {
    const meta = pageMeta(location.pathname);
    document.body.dataset.page = meta.page;
    document.title = meta.title;
    if (previousPath.current !== basePath) window.scrollTo({ top: 0, behavior: 'auto' });
    previousPath.current = basePath;
  }, [basePath, location.pathname]);

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
          <Route path="/admin/*" element={<Suspense fallback={<main className="admin-auth-loading">Đang tải Admin…</main>}><AdminApp /></Suspense>} />
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
