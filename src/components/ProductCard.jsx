import { useApp } from '../context/AppContext';
import { money, textFor } from '../utils/i18n';
import AppLink from './AppLink';
import DemoImage from './DemoImage';
import { useData } from '../context/DataContext';

export default function ProductCard({ product }) {
  const { locale } = useApp();
  const { source } = useData();
  const name = textFor(product.name, locale);
  const badge = textFor(product.badge, locale);
  return (
    <article className="product-card">
      <AppLink className="product-card__image" to={`/product/${product.id}`} aria-label={name}>
        <DemoImage src={product.image} alt={name} />
        {badge && <span className="product-card__badge">{badge}</span>}
      </AppLink>
      <div className="product-card__body">
        <div className="product-card__meta"><span>{textFor(product.categoryName, locale)}</span><span>{source === 'supabase' ? 'HLIME' : 'DEMO'}</span></div>
        <h3><AppLink to={`/product/${product.id}`}>{name}</AppLink></h3>
        <p className="small muted">{textFor(product.short, locale)}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{money(product.price)}</span>
          <AppLink className="arrow-link" to={`/product/${product.id}`} aria-label={locale === 'ko' ? '상품 보기' : 'Xem sản phẩm'}>→</AppLink>
        </div>
      </div>
    </article>
  );
}
