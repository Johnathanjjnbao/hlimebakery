/*
 * HLIME HTML PROTOTYPE — DEMO DATA ONLY.
 * Product, category, homepage, site and order-help content in this file is temporary.
 * The final React version must load this changeable business content from Admin-managed data.
 */

const DEMO_PRODUCTS = [
  {
    id: 'rose-croissant',
    category: 'viennoiserie',
    categoryVi: 'Viennoiserie',
    categoryKo: '비에누아즈리',
    nameVi: 'Croissant bơ Pháp',
    nameKo: '프렌치 버터 크루아상',
    shortVi: 'Vỏ giòn nhẹ, ruột tơi lớp và thơm bơ.',
    shortKo: '가볍고 바삭한 결, 풍부한 버터 향.',
    descriptionVi: 'Croissant cán lớp thủ công, nướng vàng mỗi sáng. Một lựa chọn thanh lịch nhưng gần gũi cho bữa sáng hoặc giờ trà.',
    descriptionKo: '매일 아침 구워내는 수제 크루아상입니다. 섬세한 결감과 고소한 버터 향으로 아침과 티타임에 잘 어울립니다.',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Bán chạy',
    badgeKo: '베스트'
  },
  {
    id: 'strawberry-tart',
    category: 'patisserie',
    categoryVi: 'French Pâtisserie',
    categoryKo: '프렌치 파티세리',
    nameVi: 'Tarte dâu kem vani',
    nameKo: '딸기 바닐라 타르트',
    shortVi: 'Dâu tươi, kem vani và đế tart hạnh nhân.',
    shortKo: '생딸기, 바닐라 크림, 아몬드 타르트.',
    descriptionVi: 'Đế tart giòn mỏng, kem hạnh nhân dịu và dâu tươi theo mùa. Vị chua ngọt cân bằng, phù hợp cho một buổi chiều nhẹ nhàng.',
    descriptionKo: '얇고 바삭한 타르트에 부드러운 아몬드 크림과 제철 딸기를 올렸습니다. 산뜻한 오후에 어울리는 균형 잡힌 맛입니다.',
    price: 92000,
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Mới',
    badgeKo: '신메뉴'
  },
  {
    id: 'opera-slice',
    category: 'patisserie',
    categoryVi: 'French Pâtisserie',
    categoryKo: '프렌치 파티세리',
    nameVi: 'Opera cà phê',
    nameKo: '커피 오페라 케이크',
    shortVi: 'Hạnh nhân, cà phê và chocolate đắng dịu.',
    shortKo: '아몬드, 커피, 은은한 다크 초콜릿.',
    descriptionVi: 'Các lớp biscuit hạnh nhân, ganache chocolate và kem bơ cà phê được cân chỉnh để đậm đà nhưng không nặng.',
    descriptionKo: '아몬드 비스퀴, 초콜릿 가나슈, 커피 버터크림을 섬세하게 쌓아 진하지만 부담스럽지 않습니다.',
    price: 108000,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Signature',
    badgeKo: '시그니처'
  },
  {
    id: 'milk-bread',
    category: 'everyday',
    categoryVi: 'Everyday Bakery',
    categoryKo: '데일리 베이커리',
    nameVi: 'Bánh mì sữa mềm',
    nameKo: '부드러운 밀크 브레드',
    shortVi: 'Mềm, thơm sữa, dễ dùng mỗi ngày.',
    shortKo: '매일 즐기기 좋은 부드러운 우유빵.',
    descriptionVi: 'Bánh mì sữa có thớ mềm, vị ngọt vừa phải. Ngon khi dùng trực tiếp hoặc nướng ấm cho bữa sáng.',
    descriptionKo: '결이 부드럽고 단맛이 과하지 않은 우유빵입니다. 그대로 또는 살짝 데워 아침 식사로 즐겨보세요.',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Mỗi ngày',
    badgeKo: '데일리'
  },
  {
    id: 'lemon-choux',
    category: 'patisserie',
    categoryVi: 'French Pâtisserie',
    categoryKo: '프렌치 파티세리',
    nameVi: 'Choux chanh vàng',
    nameKo: '레몬 슈',
    shortVi: 'Kem chanh sáng vị, lớp craquelin giòn.',
    shortKo: '상큼한 레몬 크림과 바삭한 크라클랭.',
    descriptionVi: 'Choux nhỏ gọn với kem chanh vàng tươi sáng và lớp vỏ craquelin mỏng giòn.',
    descriptionKo: '산뜻한 레몬 크림과 얇고 바삭한 크라클랭이 어우러진 작은 슈입니다.',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=85',
    badgeVi: '',
    badgeKo: ''
  },
  {
    id: 'chocolate-cake',
    category: 'cakes',
    categoryVi: 'Cakes',
    categoryKo: '케이크',
    nameVi: 'Chocolate velvet',
    nameKo: '초콜릿 벨벳',
    shortVi: 'Chocolate 64%, mềm ẩm và vừa vị.',
    shortKo: '64% 초콜릿의 촉촉하고 균형 잡힌 맛.',
    descriptionVi: 'Bánh chocolate mềm ẩm với ganache mượt, dành cho những buổi gặp gỡ nhỏ hoặc bữa tối ấm cúng.',
    descriptionKo: '촉촉한 초콜릿 시트와 부드러운 가나슈로 완성한 케이크입니다. 작은 모임과 따뜻한 저녁에 잘 어울립니다.',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Bán chạy',
    badgeKo: '베스트'
  },
  {
    id: 'celebration-rose',
    category: 'celebration',
    categoryVi: 'Celebration Cakes',
    categoryKo: '셀러브레이션 케이크',
    nameVi: 'Rose Garden Cake',
    nameKo: '로즈 가든 케이크',
    shortVi: 'Kem sữa nhẹ, berry và trang trí hoa mềm mại.',
    shortKo: '가벼운 크림, 베리, 우아한 플라워 장식.',
    descriptionVi: 'Mẫu bánh Celebration thanh lịch với kem sữa nhẹ và nhân berry. Có thể chọn size, hương vị, ngày cần bánh và lời nhắn.',
    descriptionKo: '가벼운 밀크 크림과 베리 필링의 우아한 셀러브레이션 케이크입니다. 사이즈, 맛, 픽업 날짜와 메시지를 선택할 수 있습니다.',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Đặt trước',
    badgeKo: '예약'
  },
  {
    id: 'petit-gift',
    category: 'gift',
    categoryVi: 'Gift Box',
    categoryKo: '기프트 박스',
    nameVi: 'Petit Tea Box',
    nameKo: '쁘띠 티 박스',
    shortVi: 'Madeleine, financier và sablé theo mùa.',
    shortKo: '마들렌, 피낭시에, 시즌 사블레 구성.',
    descriptionVi: 'Hộp bánh nhỏ gọn để gửi lời cảm ơn hoặc mang đến một buổi gặp mặt. Bao bì demo sẽ do Admin quản lý sau này.',
    descriptionKo: '감사의 마음이나 작은 모임에 어울리는 구움과자 세트입니다. 패키지 정보는 추후 Admin에서 관리됩니다.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=85',
    badgeVi: 'Quà tặng',
    badgeKo: '선물'
  }
];

const CATEGORY_LABELS = {
  all: { vi: 'Tất cả', ko: '전체' },
  everyday: { vi: 'Everyday Bakery', ko: '데일리 베이커리' },
  viennoiserie: { vi: 'Viennoiserie', ko: '비에누아즈리' },
  patisserie: { vi: 'French Pâtisserie', ko: '프렌치 파티세리' },
  cakes: { vi: 'Cakes', ko: '케이크' },
  celebration: { vi: 'Celebration', ko: '셀러브레이션' },
  gift: { vi: 'Gift Box', ko: '기프트 박스' }
};

// Demo flavor media mapping. The final React version should load these records from Admin-managed product data.
const CELEBRATION_FLAVOR_IMAGES = {
  'vanilla-berry': {
    src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1300&q=88',
    altVi: 'Bánh Celebration Vanilla & Berry — ảnh demo',
    altKo: '바닐라 & 베리 셀러브레이션 케이크 — 데모 이미지'
  },
  'chocolate-64': {
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1300&q=88',
    altVi: 'Bánh Celebration Chocolate 64% — ảnh demo',
    altKo: '64% 초콜릿 셀러브레이션 케이크 — 데모 이미지'
  },
  'earl-grey-peach': {
    src: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1300&q=88',
    altVi: 'Bánh Celebration Earl Grey & Peach — ảnh demo',
    altKo: '얼그레이 & 복숭아 셀러브레이션 케이크 — 데모 이미지'
  }
};

const CART_KEY = 'hlime-prototype-cart';
const LANGUAGE_KEY = 'hlime-prototype-language';
const memoryStorage = new Map();

function storageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

function storageSet(key, value) {
  memoryStorage.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // In-memory fallback keeps the prototype usable when storage is blocked.
  }
}

const storedLanguage = storageGet(LANGUAGE_KEY);
let currentLanguage = storedLanguage === 'ko' ? 'ko' : 'vi';
const requestedCategory = new URLSearchParams(window.location.search).get('category');
let activeFilter = requestedCategory && CATEGORY_LABELS[requestedCategory] ? requestedCategory : 'all';

const money = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`;
const textFor = (item, stem) => item[`${stem}${currentLanguage === 'ko' ? 'Ko' : 'Vi'}`];

function getCart() {
  try {
    return JSON.parse(storageGet(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  storageSet(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function buildHeader() {
  const page = document.body.dataset.page || '';
  const nav = [
    ['home', 'index.html', 'Trang chủ', '홈'],
    ['menu', 'menu.html', 'Menu', '메뉴'],
    ['celebration', 'celebration.html', 'Celebration', '셀러브레이션'],
    ['about', 'about.html', 'Về Hlime', '브랜드'],
    ['contact', 'contact.html', 'Liên hệ', '문의']
  ];

  return `
    <a class="skip-link" href="#main-content" data-vi="Bỏ qua đến nội dung" data-ko="본문으로 건너뛰기">Bỏ qua đến nội dung</a>
    <div class="demo-strip" data-vi="HTML Prototype · DEMO DATA — Sau này được quản lý qua Admin" data-ko="HTML 프로토타입 · 데모 데이터 — 추후 Admin에서 관리">HTML Prototype · DEMO DATA — Sau này được quản lý qua Admin</div>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="Hlime Bakery & Pâtisserie">
          <span class="brand__name">Hlime</span>
          <span class="brand__sub">Bakery & Pâtisserie</span>
        </a>
        <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
          ${nav.map(([key, href, vi, ko]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ''} data-vi="${vi}" data-ko="${ko}">${currentLanguage === 'ko' ? ko : vi}</a>`).join('')}
          <a class="site-nav__order" href="menu.html" data-vi="Đặt bánh" data-ko="케이크 주문">${currentLanguage === 'ko' ? '케이크 주문' : 'Đặt bánh'}</a>
        </nav>
        <div class="header-actions">
          <a class="header-order-button" href="menu.html" data-vi="Đặt bánh" data-ko="케이크 주문">${currentLanguage === 'ko' ? '케이크 주문' : 'Đặt bánh'}</a>
          <button class="lang-button" type="button" data-language-toggle aria-label="Switch language">${currentLanguage === 'vi' ? '한국어' : 'VI'}</button>
          <a class="icon-button cart-link" href="cart.html" aria-label="Shopping cart">
            <span class="cart-label" data-vi="Bag / Giỏ" data-ko="Bag / 장바구니">${currentLanguage === 'ko' ? 'Bag / 장바구니' : 'Bag / Giỏ'}</span>
            <span class="cart-count" data-cart-count>0</span>
          </a>
          <button class="menu-button" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu"><span aria-hidden="true">☰</span></button>
        </div>
      </div>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html"><span class="brand__name">Hlime</span><span class="brand__sub">Bakery & Pâtisserie</span></a>
            <p class="small" style="max-width:310px;margin-top:1.2rem" data-vi="Everyday sweetness, beautifully made. Dữ liệu liên hệ bên dưới là demo cho prototype." data-ko="Everyday sweetness, beautifully made. 아래 연락처는 프로토타입용 데모입니다.">Everyday sweetness, beautifully made. Dữ liệu liên hệ bên dưới là demo cho prototype.</p>
          </div>
          <div>
            <h3 data-vi="Khám phá" data-ko="둘러보기">Khám phá</h3>
            <div class="footer-links">
              <a href="menu.html" data-vi="Menu" data-ko="메뉴">Menu</a>
              <a href="celebration.html" data-vi="Celebration" data-ko="셀러브레이션">Celebration</a>
              <a href="about.html" data-vi="Về Hlime" data-ko="브랜드">Về Hlime</a>
            </div>
          </div>
          <div>
            <h3 data-vi="Hỗ trợ" data-ko="도움말">Hỗ trợ</h3>
            <div class="footer-links">
              <a href="contact.html" data-vi="Liên hệ" data-ko="문의">Liên hệ</a>
              <a href="cart.html" data-vi="Giỏ hàng" data-ko="장바구니">Giỏ hàng</a>
              <a href="#" data-vi="Instagram (demo)" data-ko="인스타그램 (데모)">Instagram (demo)</a>
            </div>
          </div>
          <div>
            <h3 data-vi="Cửa hàng demo" data-ko="데모 매장">Cửa hàng demo</h3>
            <p class="small" data-vi="128 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM<br>090 123 4567<br>08:00–21:00 mỗi ngày" data-ko="호치민시 푸뉴언군 응우옌반쪼이 128<br>090 123 4567<br>매일 08:00–21:00">128 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM<br>090 123 4567<br>08:00–21:00 mỗi ngày</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Hlime Prototype</span>
          <span data-vi="DEMO — Không phải dữ liệu production" data-ko="데모 — 실제 운영 데이터가 아닙니다">DEMO — Không phải dữ liệu production</span>
        </div>
      </div>
    </footer>`;
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === 'ko' ? 'ko' : 'vi';
  document.querySelectorAll('[data-vi][data-ko]').forEach((element) => {
    const value = element.dataset[currentLanguage];
    if (value !== undefined) element.innerHTML = value;
  });
  document.querySelectorAll('[data-placeholder-vi][data-placeholder-ko]').forEach((element) => {
    element.placeholder = element.dataset[currentLanguage === 'ko' ? 'placeholderKo' : 'placeholderVi'];
  });
  document.querySelectorAll('[data-alt-vi][data-alt-ko]').forEach((element) => {
    element.alt = element.dataset[currentLanguage === 'ko' ? 'altKo' : 'altVi'];
  });
  document.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.textContent = currentLanguage === 'vi' ? '한국어' : 'VI';
    button.setAttribute('aria-label', currentLanguage === 'vi' ? '한국어로 보기' : 'Xem tiếng Việt');
  });
  renderDynamicContent();
  updateCelebrationImage();
}

function updateCelebrationImage() {
  const flavorSelect = document.querySelector('#cake-flavor');
  const image = document.querySelector('[data-celebration-image]');
  if (!flavorSelect || !image) return;

  const flavor = CELEBRATION_FLAVOR_IMAGES[flavorSelect.value] || CELEBRATION_FLAVOR_IMAGES['vanilla-berry'];
  image.src = flavor.src;
  image.alt = currentLanguage === 'ko' ? flavor.altKo : flavor.altVi;
  image.dataset.altVi = flavor.altVi;
  image.dataset.altKo = flavor.altKo;
  image.dataset.flavor = flavorSelect.value;
}

function productCard(product) {
  const badge = textFor(product, 'badge');
  return `
    <article class="product-card">
      <a class="product-card__image" href="product.html?id=${product.id}" aria-label="${textFor(product, 'name')}">
        <img src="${product.image}" alt="${textFor(product, 'name')} — demo image">
        ${badge ? `<span class="product-card__badge">${badge}</span>` : ''}
      </a>
      <div class="product-card__body">
        <div class="product-card__meta"><span>${textFor(product, 'category')}</span><span>DEMO</span></div>
        <h3><a href="product.html?id=${product.id}">${textFor(product, 'name')}</a></h3>
        <p class="small muted">${textFor(product, 'short')}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${money(product.price)}</span>
          <a class="arrow-link" href="product.html?id=${product.id}" aria-label="${currentLanguage === 'ko' ? '상품 보기' : 'Xem sản phẩm'}">→</a>
        </div>
      </div>
    </article>`;
}

function renderProductCollection(selector, ids) {
  const target = document.querySelector(selector);
  if (!target) return;
  const products = ids ? ids.map((id) => DEMO_PRODUCTS.find((item) => item.id === id)).filter(Boolean) : DEMO_PRODUCTS;
  target.innerHTML = products.map(productCard).join('');
}

function renderMenu() {
  const grid = document.querySelector('[data-menu-grid]');
  const filters = document.querySelector('[data-menu-filters]');
  if (!grid || !filters) return;

  filters.innerHTML = Object.entries(CATEGORY_LABELS).map(([key, label]) => `
    <button class="filter-button ${activeFilter === key ? 'is-active' : ''}" type="button" data-filter="${key}">${label[currentLanguage]}</button>
  `).join('');

  const visible = activeFilter === 'all' ? DEMO_PRODUCTS : DEMO_PRODUCTS.filter((product) => product.category === activeFilter);
  grid.innerHTML = visible.map(productCard).join('');
  const count = document.querySelector('[data-product-count]');
  if (count) count.textContent = currentLanguage === 'ko' ? `${visible.length}개 데모 상품` : `${visible.length} sản phẩm demo`;
}

function renderProductDetail() {
  const target = document.querySelector('[data-product-detail]');
  if (!target) return;
  const requestedId = new URLSearchParams(window.location.search).get('id');
  const product = requestedId
    ? DEMO_PRODUCTS.find((item) => item.id === requestedId)
    : DEMO_PRODUCTS[0];
  const relatedSection = document.querySelector('[data-product-related]');

  if (!product) {
    target.removeAttribute('data-product-id');
    target.classList.add('product-detail--not-found');
    target.innerHTML = `
      <div class="product-not-found">
        <span class="product-not-found__mark" aria-hidden="true">H</span>
        <span class="eyebrow">${currentLanguage === 'ko' ? '상품을 찾을 수 없습니다' : 'Không tìm thấy sản phẩm'}</span>
        <h1>${currentLanguage === 'ko' ? '요청하신 상품이 없거나 더 이상 표시되지 않습니다.' : 'Sản phẩm bạn tìm không tồn tại hoặc không còn hiển thị.'}</h1>
        <p>${currentLanguage === 'ko' ? '현재 메뉴로 돌아가 다른 디저트를 둘러보세요.' : 'Hãy quay lại Menu để khám phá những món bánh đang có.'}</p>
        <a class="button button--primary" href="menu.html">${currentLanguage === 'ko' ? '메뉴로 돌아가기' : 'Về Menu'}</a>
      </div>`;
    if (relatedSection) relatedSection.hidden = true;
    return;
  }

  target.classList.remove('product-detail--not-found');
  if (relatedSection) relatedSection.hidden = false;
  target.dataset.productId = product.id;
  target.innerHTML = `
    <div class="product-detail__image"><img src="${product.image}" alt="${textFor(product, 'name')} — demo image"></div>
    <div class="product-detail__copy">
      <span class="eyebrow">${textFor(product, 'category')} · DEMO</span>
      <h1>${textFor(product, 'name')}</h1>
      <span class="price">${money(product.price)}</span>
      <p class="description">${textFor(product, 'description')}</p>
      <div class="demo-note"><span aria-hidden="true">ⓘ</span><span>${currentLanguage === 'ko' ? '상품명, 설명, 가격, 이미지는 데모이며 추후 Admin에서 관리됩니다.' : 'Tên, mô tả, giá và ảnh là dữ liệu demo; sau này được quản lý qua Admin.'}</span></div>
      <div class="product-points">
        <div class="product-point">${currentLanguage === 'ko' ? '매일 소량으로 정성껏 준비합니다.' : 'Làm mới mỗi ngày với số lượng vừa phải.'}</div>
        <div class="product-point">${currentLanguage === 'ko' ? '결제는 포함되지 않은 프로토타입입니다.' : 'Prototype chưa có thanh toán online.'}</div>
      </div>
      <div class="quantity-row">
        <span class="fieldset-label">${currentLanguage === 'ko' ? '수량' : 'Số lượng'}</span>
        <div class="quantity-control">
          <button type="button" data-quantity-down aria-label="Decrease quantity">−</button>
          <input type="number" min="1" max="20" value="1" data-product-quantity aria-label="Quantity">
          <button type="button" data-quantity-up aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="hero-actions">
        <button class="button button--primary" type="button" data-add-product="${product.id}">${currentLanguage === 'ko' ? '장바구니에 담기' : 'Thêm vào giỏ hàng'}</button>
        <a class="button button--secondary" href="cart.html">${currentLanguage === 'ko' ? '장바구니 보기' : 'Xem giỏ hàng'}</a>
      </div>
    </div>`;
}

function renderCart() {
  const list = document.querySelector('[data-cart-list]');
  const subtotalTargets = document.querySelectorAll('[data-cart-subtotal]');
  const itemCount = document.querySelector('[data-cart-items-label]');
  if (!list || !subtotalTargets.length) return;
  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon" aria-hidden="true">♡</div>
        <h2>${currentLanguage === 'ko' ? '장바구니가 비어 있어요' : 'Giỏ hàng đang trống'}</h2>
        <p class="muted">${currentLanguage === 'ko' ? '오늘의 데모 메뉴에서 마음에 드는 디저트를 골라보세요.' : 'Hãy chọn một món bánh từ menu demo hôm nay.'}</p>
        <a class="button button--primary" href="menu.html">${currentLanguage === 'ko' ? '메뉴 보기' : 'Xem menu'}</a>
      </div>`;
  } else {
    list.innerHTML = cart.map((item, index) => {
      const product = DEMO_PRODUCTS.find((entry) => entry.id === item.productId);
      if (!product) return '';
      const options = item.options || {};
      const optionText = Object.values(options).filter(Boolean).join(' · ');
      return `
        <article class="cart-item">
          <div class="cart-item__image"><img src="${product.image}" alt="${textFor(product, 'name')} — demo image"></div>
          <div>
            <span class="small muted">${textFor(product, 'category')}</span>
            <h3>${textFor(product, 'name')}</h3>
            ${optionText ? `<div class="cart-item__options">${optionText}</div>` : ''}
            <div class="quantity-control">
              <button type="button" data-cart-quantity="${index}" data-change="-1" aria-label="Decrease quantity">−</button>
              <input type="number" value="${item.quantity}" min="1" readonly aria-label="Quantity">
              <button type="button" data-cart-quantity="${index}" data-change="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <div class="cart-item__right">
            <strong>${money(product.price * item.quantity)}</strong>
            <button class="remove-button" type="button" data-remove-item="${index}">${currentLanguage === 'ko' ? '삭제' : 'Xóa'}</button>
          </div>
        </article>`;
    }).join('');
  }

  const subtotal = cart.reduce((sum, item) => {
    const product = DEMO_PRODUCTS.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  subtotalTargets.forEach((target) => { target.textContent = money(subtotal); });
  if (itemCount) itemCount.textContent = currentLanguage === 'ko' ? `${getCartCount()}개 상품` : `${getCartCount()} sản phẩm`;
  const submit = document.querySelector('[data-submit-demo-order]');
  if (submit) submit.disabled = cart.length === 0;
}

function renderDynamicContent() {
  renderProductCollection('[data-home-bestsellers]', ['rose-croissant', 'strawberry-tart', 'chocolate-cake', 'petit-gift']);
  renderProductCollection('[data-everyday-products]', ['milk-bread', 'rose-croissant', 'lemon-choux']);
  renderMenu();
  renderProductDetail();
  renderCart();
}

function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach((element) => {
    element.textContent = getCartCount();
  });
}

function addToCart(productId, quantity = 1, options = {}) {
  const cart = getCart();
  const optionKey = JSON.stringify(options);
  const existing = cart.find((item) => item.productId === productId && JSON.stringify(item.options || {}) === optionKey);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity, options });
  saveCart(cart);
  showToast(currentLanguage === 'ko' ? '장바구니에 담았습니다.' : 'Đã thêm vào giỏ hàng.');
}

let toastTimer;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

function initializeShell() {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  if (header) header.innerHTML = buildHeader();
  if (footer) footer.innerHTML = buildFooter();
  updateCartCount();
}

document.addEventListener('click', (event) => {
  const langButton = event.target.closest('[data-language-toggle]');
  if (langButton) {
    currentLanguage = currentLanguage === 'vi' ? 'ko' : 'vi';
    storageSet(LANGUAGE_KEY, currentLanguage);
    applyLanguage();
    return;
  }

  const menuButton = event.target.closest('.menu-button');
  if (menuButton) {
    const nav = document.querySelector('.site-nav');
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    return;
  }

  const filter = event.target.closest('[data-filter]');
  if (filter) {
    activeFilter = filter.dataset.filter;
    renderMenu();
    return;
  }

  const addButton = event.target.closest('[data-add-product]');
  if (addButton) {
    const quantity = Math.max(1, Number(document.querySelector('[data-product-quantity]')?.value || 1));
    addToCart(addButton.dataset.addProduct, quantity);
    return;
  }

  if (event.target.closest('[data-quantity-down]')) {
    const input = document.querySelector('[data-product-quantity]');
    input.value = Math.max(1, Number(input.value) - 1);
    return;
  }

  if (event.target.closest('[data-quantity-up]')) {
    const input = document.querySelector('[data-product-quantity]');
    input.value = Math.min(20, Number(input.value) + 1);
    return;
  }

  const quantityButton = event.target.closest('[data-cart-quantity]');
  if (quantityButton) {
    const cart = getCart();
    const index = Number(quantityButton.dataset.cartQuantity);
    cart[index].quantity = Math.max(1, cart[index].quantity + Number(quantityButton.dataset.change));
    saveCart(cart);
    renderCart();
    return;
  }

  const removeButton = event.target.closest('[data-remove-item]');
  if (removeButton) {
    const cart = getCart();
    cart.splice(Number(removeButton.dataset.removeItem), 1);
    saveCart(cart);
    renderCart();
  }
});

document.addEventListener('change', (event) => {
  if (event.target.matches('#cake-flavor')) {
    updateCelebrationImage();
  }

  if (event.target.matches('input[name="fulfillment"]')) {
    const deliveryFields = document.querySelector('[data-delivery-fields]');
    if (deliveryFields) {
      const isDelivery = event.target.value === 'delivery';
      deliveryFields.hidden = !isDelivery;
      const address = deliveryFields.querySelector('[name="delivery_address"]');
      if (address) address.required = isDelivery;
    }
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.matches('[data-celebration-form]')) {
    event.preventDefault();
    const form = new FormData(event.target);
    const sizeSelect = event.target.elements.size;
    const flavorSelect = event.target.elements.flavor;
    const options = {
      size: sizeSelect.selectedOptions[0].textContent,
      flavor: flavorSelect.selectedOptions[0].textContent,
      date: form.get('date'),
      note: form.get('note')
    };
    addToCart('celebration-rose', 1, options);
    return;
  }

  if (event.target.matches('[data-order-form]')) {
    event.preventDefault();
    if (!getCart().length) {
      showToast(currentLanguage === 'ko' ? '장바구니가 비어 있습니다.' : 'Giỏ hàng đang trống.');
      return;
    }
    const status = document.querySelector('[data-order-status]');
    status.innerHTML = currentLanguage === 'ko'
      ? '<strong>데모 상태: PENDING</strong><br>실제 주문은 전송되지 않았습니다. 최종 버전에서는 Hlime 확인 후 CONFIRMED로 변경됩니다.'
      : '<strong>Trạng thái demo: PENDING</strong><br>Chưa có đơn thật nào được gửi. Ở bản chính thức, Hlime sẽ xác nhận rồi chuyển sang CONFIRMED.';
    status.classList.add('is-visible');
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (event.target.matches('[data-contact-form]')) {
    event.preventDefault();
    showToast(currentLanguage === 'ko' ? '데모 폼입니다. 메시지는 전송되지 않았습니다.' : 'Form demo — chưa gửi tin nhắn thật.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initializeShell();
  applyLanguage();
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
});
