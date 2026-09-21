import { useSearchParams } from 'react-router-dom';
import AppLink from '../components/AppLink';
import DemoNote from '../components/DemoNote';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import { textFor } from '../utils/i18n';

export default function MenuPage() {
  const { locale } = useApp();
  const { categories, products, error: dataError, source } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('category') || 'all';
  const active = categories.some((category) => category.id === requested) ? requested : 'all';
  const visible = active === 'all' ? products.filter((product) => product.active) : products.filter((product) => product.active && product.category === active);

  const setFilter = (category) => {
    if (category === 'all') setSearchParams({});
    else setSearchParams({ category });
  };

  return (
    <main id="main-content">
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">{locale === 'ko' ? 'Hlime 메뉴' : 'Menu Hlime'}</span>
          <h1>{locale === 'ko' ? '오늘의 기분에 맞는 디저트.' : 'Một chiếc bánh cho mỗi tâm trạng.'}</h1>
          <p>{locale === 'ko' ? '데일리 베이커리부터 파티세리와 선물까지, 카테고리로 편하게 둘러보세요.' : 'Từ bánh dùng mỗi ngày đến pâtisserie và quà tặng — chọn category để bắt đầu.'}</p>
        </div>
      </header>

      <section className="section section--white" style={{ paddingTop: '2.5rem' }}>
        <div className="container">
          <div className="section-heading">
            <div><span className="small muted">{locale === 'ko' ? `${visible.length}개 상품` : `${visible.length} sản phẩm`}</span></div>
            {(dataError || source !== 'supabase') && <DemoNote style={{ margin: 0 }}>{dataError || (locale === 'ko' ? '예비 데모 데이터를 사용 중입니다.' : 'Đang dùng dữ liệu demo dự phòng.')}</DemoNote>}
          </div>
          <div className="filter-bar" aria-label={locale === 'ko' ? '상품 카테고리' : 'Danh mục sản phẩm'}>
            {categories.map((category) => (
              <button
                className={`filter-button${active === category.id ? ' is-active' : ''}`}
                type="button"
                key={category.id}
                onClick={() => setFilter(category.id)}
                aria-pressed={active === category.id}
              >
                {textFor(category.name, locale)}
              </button>
            ))}
          </div>
          {visible.length ? (
            <div className="product-grid" data-menu-grid>{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" aria-hidden="true">♡</div>
              <h2>{locale === 'ko' ? '이 카테고리에는 아직 상품이 없습니다' : 'Category này chưa có sản phẩm'}</h2>
              <p className="muted">{locale === 'ko' ? '전체 메뉴에서 다른 디저트를 둘러보세요.' : 'Hãy xem tất cả để khám phá category khác.'}</p>
              <button className="button button--primary" type="button" onClick={() => setFilter('all')}>{locale === 'ko' ? '전체 메뉴 보기' : 'Xem tất cả'}</button>
            </div>
          )}
        </div>
      </section>

      <section className="section section--pink">
        <div className="container section-heading">
          <div className="section-heading__copy">
            <span className="eyebrow">{locale === 'ko' ? '특별한 케이크가 필요하신가요?' : 'Cần một chiếc bánh riêng?'}</span>
            <h2>{locale === 'ko' ? '기억에 남을 날을 위한 셀러브레이션.' : 'Celebration cho ngày đáng nhớ.'}</h2>
            <p>{locale === 'ko' ? '사이즈, 맛, 필요한 날짜와 메시지를 선택해보세요.' : 'Chọn size, flavor, ngày cần bánh và lời nhắn phù hợp.'}</p>
          </div>
          <AppLink className="button button--primary" to="/celebration">{locale === 'ko' ? '셀러브레이션 보기' : 'Xem Celebration'}</AppLink>
        </div>
      </section>
    </main>
  );
}
