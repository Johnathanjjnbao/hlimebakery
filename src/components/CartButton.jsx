import AppLink from './AppLink';
import { useApp } from '../context/AppContext';

export default function CartButton() {
  const { cartCount, locale } = useApp();
  return (
    <AppLink className="icon-button cart-link" to="/cart" aria-label={locale === 'ko' ? '장바구니' : 'Giỏ hàng'}>
      <span className="cart-label">{locale === 'ko' ? 'Bag / 장바구니' : 'Bag / Giỏ'}</span>
      <span className="cart-count" aria-live="polite">{cartCount}</span>
    </AppLink>
  );
}

