import AppLink from '../components/AppLink';
import { useApp } from '../context/AppContext';

export default function NotFoundPage() {
  const { locale } = useApp();
  return (
    <main id="main-content">
      <section className="section">
        <div className="container">
          <div className="product-detail product-detail--not-found">
            <div className="product-not-found">
              <span className="product-not-found__mark" aria-hidden="true">404</span>
              <span className="eyebrow">{locale === 'ko' ? '페이지를 찾을 수 없습니다' : 'Không tìm thấy trang'}</span>
              <h1>{locale === 'ko' ? '요청하신 페이지가 없거나 주소가 변경되었습니다.' : 'Trang bạn cần không tồn tại hoặc đường dẫn đã thay đổi.'}</h1>
              <p>{locale === 'ko' ? '홈 또는 메뉴로 돌아가 계속 둘러보세요.' : 'Hãy quay về Home hoặc Menu để tiếp tục khám phá.'}</p>
              <div className="hero-actions">
                <AppLink className="button button--primary" to="/">{locale === 'ko' ? '홈으로' : 'Về Home'}</AppLink>
                <AppLink className="button button--secondary" to="/menu">{locale === 'ko' ? '메뉴 보기' : 'Xem Menu'}</AppLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

