import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLink from '../components/AppLink';
import DemoImage from '../components/DemoImage';
import DemoNote from '../components/DemoNote';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useApp } from '../context/AppContext';
import { getProduct, products } from '../data/products';
import { money, textFor } from '../utils/i18n';

export default function ProductPage() {
  const { id } = useParams();
  const { locale, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const product = getProduct(id);

  if (!product) {
    return (
      <main id="main-content">
        <section className="section">
          <div className="container">
            <AppLink className="button button--text" to="/menu">{locale === 'ko' ? '메뉴로 돌아가기' : 'Quay lại menu'}</AppLink>
            <div className="product-detail product-detail--not-found">
              <div className="product-not-found">
                <span className="product-not-found__mark" aria-hidden="true">H</span>
                <span className="eyebrow">{locale === 'ko' ? '상품을 찾을 수 없습니다' : 'Không tìm thấy sản phẩm'}</span>
                <h1>{locale === 'ko' ? '요청하신 상품이 없거나 더 이상 표시되지 않습니다.' : 'Sản phẩm bạn tìm không tồn tại hoặc không còn hiển thị.'}</h1>
                <p>{locale === 'ko' ? '현재 메뉴로 돌아가 다른 디저트를 둘러보세요.' : 'Hãy quay lại Menu để khám phá những món bánh đang có.'}</p>
                <AppLink className="button button--primary" to="/menu">{locale === 'ko' ? '메뉴로 돌아가기' : 'Về Menu'}</AppLink>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const related = products.filter((item) => ['milk-bread', 'rose-croissant', 'lemon-choux'].includes(item.id) && item.id !== product.id);

  return (
    <main id="main-content">
      <section className="section">
        <div className="container">
          <AppLink className="button button--text" to="/menu">{locale === 'ko' ? '메뉴로 돌아가기' : 'Quay lại menu'}</AppLink>
          <div className="product-detail" data-product-id={product.id}>
            <div className="product-detail__image"><DemoImage src={product.image} alt={`${textFor(product.name, locale)} — demo image`} /></div>
            <div className="product-detail__copy">
              <span className="eyebrow">{textFor(product.categoryName, locale)} · DEMO</span>
              <h1>{textFor(product.name, locale)}</h1>
              <span className="price">{money(product.price)}</span>
              <p className="description">{textFor(product.description, locale)}</p>
              <DemoNote>{locale === 'ko' ? '상품명, 설명, 가격, 이미지는 데모이며 추후 Admin에서 관리됩니다.' : 'Tên, mô tả, giá và ảnh là dữ liệu demo; sau này được quản lý qua Admin.'}</DemoNote>
              <div className="product-points">
                <div className="product-point">{locale === 'ko' ? '매일 소량으로 정성껏 준비합니다.' : 'Làm mới mỗi ngày với số lượng vừa phải.'}</div>
                <div className="product-point">{locale === 'ko' ? '결제는 포함되지 않은 프론트엔드 데모입니다.' : 'Frontend demo chưa có thanh toán online.'}</div>
              </div>
              <div className="quantity-row">
                <span className="fieldset-label">{locale === 'ko' ? '수량' : 'Số lượng'}</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label={locale === 'ko' ? '수량 줄이기' : 'Giảm số lượng'}>−</button>
                  <input type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(Math.min(20, Math.max(1, Number(event.target.value) || 1)))} aria-label={locale === 'ko' ? '수량' : 'Số lượng'} />
                  <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} aria-label={locale === 'ko' ? '수량 늘리기' : 'Tăng số lượng'}>+</button>
                </div>
              </div>
              <div className="hero-actions">
                <button className="button button--primary" type="button" onClick={() => addToCart(product.id, quantity)} disabled={!product.available}>
                  {product.available ? (locale === 'ko' ? '장바구니에 담기' : 'Thêm vào giỏ hàng') : (locale === 'ko' ? '현재 주문 불가' : 'Tạm hết')}
                </button>
                <AppLink className="button button--secondary" to="/cart">{locale === 'ko' ? '장바구니 보기' : 'Xem giỏ hàng'}</AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <SectionHeading eyebrow={locale === 'ko' ? '함께 보기' : 'Gợi ý thêm'} title={locale === 'ko' ? '이런 디저트도 좋아하실 거예요.' : 'Có thể bạn cũng thích.'} />
          <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </div>
      </section>
    </main>
  );
}

