import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pathWithoutLocale } from '../utils/i18n';
import { readCart, writeCart } from '../utils/storage';

const AppContext = createContext(null);

const initialCelebration = {
  size: '14',
  flavor: 'vanilla-berry',
  date: '',
  note: '',
};

const initialOrderDraft = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  fulfillment: 'pickup',
  delivery_address: '',
  delivery_note: '',
  order_date: '',
  order_time: '',
  order_note: '',
};

export function AppProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const locale = location.pathname === '/ko' || location.pathname.startsWith('/ko/') ? 'ko' : 'vi';
  const [cart, setCart] = useState(readCart);
  const [celebrationDraft, setCelebrationDraft] = useState(initialCelebration);
  const [orderDraft, setOrderDraft] = useState(initialOrderDraft);
  const [orderStatus, setOrderStatus] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  const switchLocale = useCallback(() => {
    const base = pathWithoutLocale(location.pathname);
    const nextPath = locale === 'vi' ? (base === '/' ? '/ko' : `/ko${base}`) : base;
    navigate(`${nextPath}${location.search}${location.hash}`);
  }, [locale, location.hash, location.pathname, location.search, navigate]);

  const addToCart = useCallback((productId, quantity = 1, options = {}) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    setCart((current) => {
      const next = current.map((item) => ({ ...item }));
      const optionKey = JSON.stringify(options || {});
      const existing = next.find((item) => item.productId === productId && JSON.stringify(item.options || {}) === optionKey);
      if (existing) existing.quantity += safeQuantity;
      else next.push({ productId, quantity: safeQuantity, options });
      return next;
    });
    showToast(locale === 'ko' ? '장바구니에 담았습니다.' : 'Đã thêm vào giỏ hàng.');
  }, [locale, showToast]);

  const updateCartQuantity = useCallback((index, change) => {
    setCart((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    )));
  }, []);

  const removeCartItem = useCallback((index) => {
    setCart((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const updateCelebrationDraft = useCallback((field, value) => {
    setCelebrationDraft((current) => ({ ...current, [field]: value }));
  }, []);

  const updateOrderDraft = useCallback((field, value) => {
    setOrderDraft((current) => ({ ...current, [field]: value }));
    setOrderStatus('');
  }, []);

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    locale,
    switchLocale,
    cart,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    celebrationDraft,
    updateCelebrationDraft,
    orderDraft,
    updateOrderDraft,
    orderStatus,
    setOrderStatus,
    toast,
    showToast,
  }), [
    addToCart,
    cart,
    cartCount,
    celebrationDraft,
    locale,
    orderDraft,
    orderStatus,
    removeCartItem,
    showToast,
    switchLocale,
    toast,
    updateCartQuantity,
    updateCelebrationDraft,
    updateOrderDraft,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

