/* HLIME FRONTEND DEMO — NOT PRODUCTION DATA.
 * Business content in this module is intentionally separate from page components so it can
 * later be replaced by Homepage, Site and Order Settings without redesigning the UI.
 */
export const siteContent = {
  brand: 'Hlime',
  brandSub: 'Bakery & Pâtisserie',
  tagline: 'Everyday sweetness, beautifully made.',
  phone: '090 123 4567',
  phoneHref: 'tel:+84901234567',
  email: 'hello@hlime.vn',
  address: {
    vi: '128 Nguyễn Văn Trỗi, Phường 8, Phú Nhuận, TP.HCM',
    ko: '호치민시 푸뉴언군 응우옌반쪼이 128',
  },
  addressShort: {
    vi: '128 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM',
    ko: '호치민시 푸뉴언군 응우옌반쪼이 128',
  },
  hours: { vi: '08:00–21:00, mỗi ngày', ko: '매일 08:00–21:00' },
  mapUrl: 'https://maps.google.com',
  navigation: [
    { id: 'home', path: '/', label: { vi: 'Trang chủ', ko: '홈' } },
    { id: 'menu', path: '/menu', label: { vi: 'Menu', ko: '메뉴' } },
    { id: 'celebration', path: '/celebration', label: { vi: 'Celebration', ko: '셀러브레이션' } },
    { id: 'about', path: '/about', label: { vi: 'Về Hlime', ko: '브랜드' } },
    { id: 'contact', path: '/contact', label: { vi: 'Liên hệ', ko: '문의' } },
  ],
};

export const homeContent = {
  hero: {
    eyebrow: { vi: 'Bakery & Pâtisserie · Sài Gòn', ko: '베이커리 & 파티세리 · 사이공' },
    title: { vi: 'Một chút ngọt ngào, được làm thật đẹp.', ko: '일상의 달콤함을 아름답게 만듭니다.' },
    lead: {
      vi: 'Từ chiếc croissant mỗi sáng đến chiếc bánh cho ngày đặc biệt — Hlime làm mọi thứ với sự dịu dàng và vừa đủ.',
      ko: '매일 아침의 크루아상부터 특별한 날의 케이크까지, Hlime은 섬세하고 편안한 달콤함을 만듭니다.',
    },
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=88',
    imageAlt: { vi: 'Bánh kem Hlime — ảnh demo', ko: 'Hlime 케이크 — 데모 이미지' },
    stamp: { vi: 'Làm đẹp từng ngày', ko: '매일 정성스럽게' },
  },
  trust: [
    { title: { vi: 'Nướng mới mỗi ngày', ko: '매일 새롭게 굽습니다' }, text: { vi: 'Số lượng vừa đủ, ưu tiên độ tươi', ko: '신선함을 위한 소량 생산' } },
    { title: { vi: 'Hương vị cân bằng', ko: '균형 잡힌 맛' }, text: { vi: 'Ngọt vừa, nguyên liệu rõ vị', ko: '과하지 않은 단맛과 선명한 재료' } },
    { title: { vi: 'Cho ngày thường & dịp vui', ko: '일상과 특별한 날' }, text: { vi: 'Từ bánh lẻ đến Celebration', ko: '한 조각부터 셀러브레이션까지' } },
  ],
  editorialMedia: {
    frenchSignature: {
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1300&q=88',
      alt: { vi: 'Tuyển chọn pâtisserie Pháp — ảnh demo', ko: '프렌치 파티세리 셀렉션 — 데모 이미지' },
    },
    celebration: {
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1300&q=88',
      alt: { vi: 'Bánh Celebration — ảnh demo', ko: '셀러브레이션 케이크 — 데모 이미지' },
    },
    story: {
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85',
      alt: { vi: 'Mẻ croissant mới nướng — ảnh demo', ko: '갓 구운 크루아상 — 데모 이미지' },
    },
  },
  why: [
    {
      number: '01',
      title: { vi: 'Ngọt vừa đủ', ko: '기분 좋은 단맛' },
      text: { vi: 'Hương vị cân bằng để bạn có thể thưởng thức thường xuyên.', ko: '매일 즐길 수 있도록 단맛의 균형을 맞춥니다.' },
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Croissant mới nướng cho khoảnh khắc hằng ngày — ảnh demo', ko: '일상의 순간을 위한 갓 구운 크루아상 — 데모 이미지' },
    },
    {
      number: '02',
      title: { vi: 'Đẹp có chủ đích', ko: '의도 있는 아름다움' },
      text: { vi: 'Mỗi chi tiết phục vụ cho chiếc bánh, không phô trương.', ko: '화려함보다 디저트 자체를 돋보이게 합니다.' },
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Bánh pâtisserie được hoàn thiện tinh tế — ảnh demo', ko: '섬세하게 완성한 파티세리 — 데모 이미지' },
    },
    {
      number: '03',
      title: { vi: 'Cho nhiều khoảnh khắc', ko: '다양한 순간을 위해' },
      text: { vi: 'Từ bữa sáng nhanh đến một chiếc bánh kỷ niệm.', ko: '가벼운 아침부터 기념일 케이크까지 함께합니다.' },
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Bánh Celebration cho một ngày đáng nhớ — ảnh demo', ko: '기억에 남는 날을 위한 셀러브레이션 케이크 — 데모 이미지' },
    },
  ],
};

export const aboutContent = {
  hero: {
    eyebrow: { vi: 'Câu chuyện Hlime', ko: '흘라임 이야기' },
    title: { vi: 'Một chút ngọt ngào, được làm thật đẹp.', ko: '일상의 달콤함을 아름답게 만듭니다.' },
    text: {
      vi: 'Hlime mang tinh thần pâtisserie Pháp đến gần hơn với những khoảnh khắc thường ngày — tinh tế, chỉn chu nhưng luôn dễ chọn và dễ thưởng thức.',
      ko: '흘라임은 프렌치 파티세리의 섬세함을 일상에 더 가깝게 전합니다. 정성스럽지만 편안하게 고르고 즐길 수 있습니다.',
    },
  },
  feature: {
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85',
    alt: { vi: 'Mẻ croissant mới nướng trong bếp — ảnh demo', ko: '주방에서 갓 구운 크루아상 — 데모 이미지' },
    eyebrow: { vi: 'Everyday sweetness', ko: '매일의 달콤함' },
    title: { vi: 'Đẹp vừa đủ. Ngon mỗi ngày.', ko: '충분히 아름답고, 매일 맛있게.' },
    paragraphs: [
      {
        vi: 'Chúng tôi tin một chiếc bánh ngon không cần phải xa xỉ hay chỉ dành cho dịp đặc biệt. Vì vậy, menu Hlime cân bằng giữa những món quen thuộc dễ mua và các lựa chọn pâtisserie chỉn chu cho ngày đáng nhớ.',
        ko: '맛있는 디저트는 사치스럽거나 특별한 날만을 위한 것이 아니라고 믿습니다. 흘라임의 메뉴는 매일 편하게 즐길 빵과 소중한 날을 위한 정교한 파티세리를 함께 담습니다.',
      },
      {
        vi: 'Từ lớp croissant giòn nhẹ đến chiếc bánh sinh nhật được hoàn thiện theo lựa chọn riêng, mỗi sản phẩm đều hướng đến cảm giác sạch sẽ, cân bằng và đáng nhớ.',
        ko: '가볍고 바삭한 크루아상부터 취향에 맞춰 완성하는 셀러브레이션 케이크까지, 모든 제품은 깔끔한 맛의 균형과 좋은 기억을 지향합니다.',
      },
    ],
  },
  stories: [
    {
      number: '01',
      title: { vi: 'Nguyên liệu có chủ đích', ko: '신중하게 고른 재료' },
      text: { vi: 'Ưu tiên hương vị rõ ràng, cân bằng và phù hợp để thưởng thức thường xuyên.', ko: '명확하고 균형 잡힌 맛, 그리고 일상에서 편하게 즐길 수 있는 조합을 우선합니다.' },
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Bánh mì và nguyên liệu được chuẩn bị trong bếp — ảnh demo', ko: '주방에서 준비한 빵과 재료 — 데모 이미지' },
    },
    {
      number: '02',
      title: { vi: 'Chỉn chu trong từng lớp bánh', ko: '한 겹 한 겹의 정성' },
      text: { vi: 'Kỹ thuật tốt phục vụ trải nghiệm ngon miệng, không phô trương hình thức.', ko: '좋은 기술은 과시가 아니라 더 맛있는 경험을 위해 사용합니다.' },
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Những lớp croissant được hoàn thiện cẩn thận — ảnh demo', ko: '정성스럽게 완성한 크루아상 레이어 — 데모 이미지' },
    },
    {
      number: '03',
      title: { vi: 'Ấm áp và dễ tiếp cận', ko: '따뜻하고 편안하게' },
      text: { vi: 'Từ menu đến cách đặt bánh, mọi điểm chạm đều được thiết kế thật dễ hiểu.', ko: '메뉴를 고르는 순간부터 주문까지, 모든 과정이 쉽고 편안하도록 설계합니다.' },
      image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=85',
      alt: { vi: 'Bánh thành phẩm cho trải nghiệm Hlime — ảnh demo', ko: 'Hlime의 완성된 디저트 경험 — 데모 이미지' },
    },
  ],
};

export const contactContent = {
  hero: {
    eyebrow: { vi: 'Một chi nhánh · V1', ko: '한 곳의 매장 · V1' },
    title: { vi: 'Ghé tiệm hoặc nhắn Hlime', ko: '매장 방문 또는 문의하기' },
    text: {
      vi: 'Thông tin bên dưới là dữ liệu demo để owner duyệt giao diện. Địa chỉ, liên hệ và giờ mở cửa thật sẽ được quản lý trong Admin.',
      ko: '아래 정보는 화면 검토를 위한 데모 데이터입니다. 실제 주소, 연락처, 영업시간은 추후 관리자 화면에서 관리합니다.',
    },
  },
  atmosphereImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1300&q=85',
  atmosphereAlt: { vi: 'Không gian bàn bánh Hlime — ảnh demo', ko: 'Hlime 베이커리 테이블 분위기 — 데모 이미지' },
};
