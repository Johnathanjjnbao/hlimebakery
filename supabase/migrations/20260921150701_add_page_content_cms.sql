-- Fixed-page CMS coverage for About, Contact and Celebration, plus the
-- remaining Homepage sections. This is intentionally not a page builder.

alter table public.site_settings
  add column tagline_vi text,
  add column tagline_ko text;

update public.site_settings
set
  tagline_vi = 'Everyday sweetness, beautifully made.',
  tagline_ko = '매일의 달콤함을 아름답게.'
where id = 1
  and tagline_vi is null
  and tagline_ko is null;

create table public.page_content (
  id bigint generated always as identity primary key,
  page_key text not null
    check (page_key in ('about', 'contact', 'celebration')),
  section_key text not null
    check (section_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  eyebrow_vi text,
  eyebrow_ko text,
  title_vi text,
  title_ko text,
  subtitle_vi text,
  subtitle_ko text,
  body_vi text,
  body_ko text,
  image_path text,
  active boolean not null default true,
  display_order integer not null default 0
    check (display_order >= 0),
  vi_content_version bigint not null default 1
    check (vi_content_version > 0),
  ko_translation_status text not null default 'missing'
    check (ko_translation_status in ('missing', 'machine', 'reviewed', 'manual', 'stale')),
  ko_source_vi_version bigint
    check (ko_source_vi_version is null or ko_source_vi_version > 0),
  ko_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint page_content_page_section_unique unique (page_key, section_key),
  constraint page_content_translation_version_check check (
    (ko_translation_status = 'missing' and ko_source_vi_version is null)
    or
    (ko_translation_status <> 'missing'
      and ko_source_vi_version is not null
      and ko_source_vi_version <= vi_content_version)
  )
);

create index page_content_public_order_idx
  on public.page_content (page_key, display_order, id)
  where active;

create trigger page_content_set_updated_at
before update on public.page_content
for each row execute function private.hlime_set_updated_at();

comment on table public.page_content is
  'Fixed V1 content sections for About, Contact and Celebration. Not a general page builder.';

comment on column public.page_content.image_path is
  'Supabase Storage object path or a transitional absolute URL. New Admin uploads use unique Storage paths.';

alter table public.page_content enable row level security;

create policy page_content_public_read
on public.page_content
for select
to anon, authenticated
using (active);

create policy page_content_admin_all
on public.page_content
for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

revoke all on table public.page_content from anon, authenticated;
grant select on table public.page_content to anon, authenticated;
grant insert, update, delete on table public.page_content to authenticated;

revoke all on sequence public.page_content_id_seq from anon, authenticated;
grant usage, select on sequence public.page_content_id_seq to authenticated;

-- Keep upload limits aligned with the browser validation. The bucket stays
-- public-read while object mutations remain protected by Storage RLS.
update storage.buckets
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id = 'hlime-public';

-- Fill the one previously unused hero field so the stamp is Admin-managed.
update public.homepage_settings
set
  body_vi = 'Làm đẹp từng ngày',
  body_ko = '매일 정성스럽게'
where section_key = 'hero'
  and body_vi is null
  and body_ko is null;

insert into public.homepage_settings (
  section_key, eyebrow_vi, eyebrow_ko, title_vi, title_ko,
  subtitle_vi, subtitle_ko, body_vi, body_ko, image_path,
  active, display_order, ko_translation_status, ko_source_vi_version, ko_updated_at
) values
  ('trust-1', null, null, 'Nướng mới mỗi ngày', '매일 새롭게 굽습니다', null, null,
    'Số lượng vừa đủ, ưu tiên độ tươi', '신선함을 위한 소량 생산', null, true, 5, 'manual', 1, now()),
  ('trust-2', null, null, 'Hương vị cân bằng', '균형 잡힌 맛', null, null,
    'Ngọt vừa, nguyên liệu rõ vị', '과하지 않은 단맛과 선명한 재료', null, true, 6, 'manual', 1, now()),
  ('trust-3', null, null, 'Cho ngày thường & dịp vui', '일상과 특별한 날', null, null,
    'Từ bánh lẻ đến Celebration', '한 조각부터 셀러브레이션까지', null, true, 7, 'manual', 1, now()),
  ('category-intro', 'Khám phá theo nhu cầu', '카테고리로 둘러보기',
    'Hôm nay bạn muốn một chiếc bánh thế nào?', '오늘은 어떤 디저트가 생각나나요?', null, null, null, null, null,
    true, 8, 'manual', 1, now()),
  ('best-sellers', 'Được yêu thích', '많이 찾는 메뉴',
    'Best sellers của Hlime', 'Hlime 베스트 셀러',
    'Những lựa chọn dễ bắt đầu khi bạn lần đầu ghé Hlime.', 'Hlime을 처음 만나는 분께 권하는 편안한 선택입니다.',
    null, null, null, true, 9, 'manual', 1, now()),
  ('everyday', 'Everyday Favorites', 'Everyday Favorites',
    'Những niềm vui nhỏ cho ngày thường.', '평범한 하루를 위한 작은 기쁨.', null, null, null, null, null,
    true, 10, 'manual', 1, now()),
  ('why-header', 'Why Hlime', 'Why Hlime',
    'Chỉn chu, nhưng vẫn thật dễ gần.', '섬세하지만 언제나 편안하게.', null, null, null, null, null,
    true, 11, 'manual', 1, now()),
  ('why-1', null, null, 'Ngọt vừa đủ', '기분 좋은 단맛', null, null,
    'Hương vị cân bằng để bạn có thể thưởng thức thường xuyên.', '매일 즐길 수 있도록 단맛의 균형을 맞춥니다.',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85', true, 12, 'manual', 1, now()),
  ('why-2', null, null, 'Đẹp có chủ đích', '의도 있는 아름다움', null, null,
    'Mỗi chi tiết phục vụ cho chiếc bánh, không phô trương.', '화려함보다 디저트 자체를 돋보이게 합니다.',
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1000&q=85', true, 13, 'manual', 1, now()),
  ('why-3', null, null, 'Cho nhiều khoảnh khắc', '다양한 순간을 위해', null, null,
    'Từ bữa sáng nhanh đến một chiếc bánh kỷ niệm.', '가벼운 아침부터 기념일 케이크까지 함께합니다.',
    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85', true, 14, 'manual', 1, now()),
  ('contact-preview', 'Một chi nhánh', '한 곳의 매장',
    'Ghé Hlime hôm nay.', '오늘 Hlime에 들러보세요.', null, null, null, null, null,
    true, 15, 'manual', 1, now())
on conflict (section_key) do nothing;

insert into public.page_content (
  page_key, section_key, eyebrow_vi, eyebrow_ko, title_vi, title_ko,
  subtitle_vi, subtitle_ko, body_vi, body_ko, image_path,
  active, display_order, ko_translation_status, ko_source_vi_version, ko_updated_at
) values
  ('about', 'hero', 'Câu chuyện Hlime', '흘라임 이야기',
    'Một chút ngọt ngào, được làm thật đẹp.', '일상의 달콤함을 아름답게 만듭니다.', null, null,
    'Hlime mang tinh thần pâtisserie Pháp đến gần hơn với những khoảnh khắc thường ngày — tinh tế, chỉn chu nhưng luôn dễ chọn và dễ thưởng thức.',
    '흘라임은 프렌치 파티세리의 섬세함을 일상에 더 가깝게 전합니다. 정성스럽지만 편안하게 고르고 즐길 수 있습니다.',
    null, true, 1, 'manual', 1, now()),
  ('about', 'feature', 'Everyday sweetness', '매일의 달콤함',
    'Đẹp vừa đủ. Ngon mỗi ngày.', '충분히 아름답고, 매일 맛있게.', null, null,
    E'Chúng tôi tin một chiếc bánh ngon không cần phải xa xỉ hay chỉ dành cho dịp đặc biệt. Vì vậy, menu Hlime cân bằng giữa những món quen thuộc dễ mua và các lựa chọn pâtisserie chỉn chu cho ngày đáng nhớ.\n\nTừ lớp croissant giòn nhẹ đến chiếc bánh sinh nhật được hoàn thiện theo lựa chọn riêng, mỗi sản phẩm đều hướng đến cảm giác sạch sẽ, cân bằng và đáng nhớ.',
    E'맛있는 디저트는 사치스럽거나 특별한 날만을 위한 것이 아니라고 믿습니다. 흘라임의 메뉴는 매일 편하게 즐길 빵과 소중한 날을 위한 정교한 파티세리를 함께 담습니다.\n\n가볍고 바삭한 크루아상부터 취향에 맞춰 완성하는 셀러브레이션 케이크까지, 모든 제품은 깔끔한 맛의 균형과 좋은 기억을 지향합니다.',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85', true, 2, 'manual', 1, now()),
  ('about', 'values-header', 'Điều Hlime theo đuổi', '흘라임이 추구하는 것',
    'Tinh tế không đồng nghĩa với xa cách', '섬세함은 어렵거나 멀지 않습니다', null, null, null, null,
    null, true, 3, 'manual', 1, now()),
  ('about', 'value-1', null, null, 'Nguyên liệu có chủ đích', '신중하게 고른 재료', null, null,
    'Ưu tiên hương vị rõ ràng, cân bằng và phù hợp để thưởng thức thường xuyên.',
    '명확하고 균형 잡힌 맛, 그리고 일상에서 편하게 즐길 수 있는 조합을 우선합니다.',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85', true, 4, 'manual', 1, now()),
  ('about', 'value-2', null, null, 'Chỉn chu trong từng lớp bánh', '한 겹 한 겹의 정성', null, null,
    'Kỹ thuật tốt phục vụ trải nghiệm ngon miệng, không phô trương hình thức.',
    '좋은 기술은 과시가 아니라 더 맛있는 경험을 위해 사용합니다.',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=85', true, 5, 'manual', 1, now()),
  ('about', 'value-3', null, null, 'Ấm áp và dễ tiếp cận', '따뜻하고 편안하게', null, null,
    'Từ menu đến cách đặt bánh, mọi điểm chạm đều được thiết kế thật dễ hiểu.',
    '메뉴를 고르는 순간부터 주문까지, 모든 과정이 쉽고 편안하도록 설계합니다.',
    'https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1000&q=85', true, 6, 'manual', 1, now()),
  ('about', 'cta', 'Ghé Hlime hôm nay', '오늘 흘라임에 들러보세요',
    'Chọn một món cho ngày thường — hoặc ngày thật đặc biệt.',
    '평범한 오늘에도, 아주 특별한 날에도 어울리는 디저트를 골라보세요.', null, null, null, null,
    null, true, 7, 'manual', 1, now()),

  ('contact', 'hero', 'Một chi nhánh', '한 곳의 매장',
    'Ghé tiệm hoặc nhắn Hlime', '매장 방문 또는 문의하기', null, null,
    'Xem địa chỉ, giờ mở cửa và chọn kênh liên hệ thuận tiện nhất với bạn.',
    '주소와 영업시간을 확인하고 가장 편한 방법으로 문의해 주세요.',
    null, true, 1, 'manual', 1, now()),
  ('contact', 'atmosphere', 'Một góc Hlime', 'Hlime의 한 장면',
    'Hlime Bakery & Pâtisserie', '흘라임 베이커리 & 파티세리', null, null, null, null,
    'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1300&q=85', true, 2, 'manual', 1, now()),
  ('contact', 'support', 'Cần Hlime tư vấn?', '상담이 필요하신가요?',
    'Liên hệ theo cách thuận tiện nhất', '가장 편한 방법으로 문의해 주세요', null, null,
    'Hlime sẽ hỗ trợ lựa chọn sản phẩm, Celebration và thông tin nhận bánh.',
    '상품 선택, 셀러브레이션 케이크와 수령 정보를 안내해 드립니다.',
    null, true, 3, 'manual', 1, now()),

  ('celebration', 'hero', 'Celebration Cakes', '셀러브레이션 케이크',
    'Dành cho những ngày muốn nhớ thật lâu.', '오래 기억하고 싶은 날을 위해.', null, null,
    'Một mẫu bánh mềm mại, dễ tùy chọn và đủ trang trọng cho sinh nhật hoặc ngày kỷ niệm.',
    '생일과 기념일에 어울리는 우아하고 편안한 디자인의 케이크입니다.',
    null, true, 1, 'manual', 1, now()),
  ('celebration', 'editorial', 'Hoàn thiện thủ công', '수작업으로 완성',
    'Mỗi chi tiết đều được chuẩn bị chỉn chu.', '모든 디테일을 정성스럽게 준비합니다.', null, null, null, null,
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=700&q=84', true, 2, 'manual', 1, now()),
  ('celebration', 'steps-header', 'Cách đặt', '주문 순서',
    'Ba bước rõ ràng.', '세 단계로 간단하게.', null, null, null, null,
    null, true, 3, 'manual', 1, now()),
  ('celebration', 'step-1', null, null, 'Chọn bánh', '케이크 선택', null, null,
    'Chọn size, flavor, ngày và lời nhắn.', '사이즈, 맛, 날짜와 메시지를 선택합니다.', null, true, 4, 'manual', 1, now()),
  ('celebration', 'step-2', null, null, 'Chọn cách nhận', '수령 방법 선택', null, null,
    'Pickup tại cửa hàng hoặc Delivery.', '매장 픽업 또는 배송을 선택합니다.', null, true, 5, 'manual', 1, now()),
  ('celebration', 'step-3', null, null, 'Hlime xác nhận', 'Hlime 확인', null, null,
    'Order ở trạng thái PENDING trước khi Hlime chuyển sang CONFIRMED.',
    '주문은 PENDING 상태 후 Hlime 확인을 거쳐 CONFIRMED로 변경됩니다.',
    null, true, 6, 'manual', 1, now())
on conflict (page_key, section_key) do nothing;
