/* Hlime V1 demo business data seed.
 * DEMO — NOT PRODUCTION DATA.
 * Idempotency rule: existing rows win, so rerunning never overwrites Admin edits.
 */
import { createClient } from '@supabase/supabase-js';
import { celebrationFlavors, celebrationSizes } from '../src/data/celebration.js';
import { categories } from '../src/data/categories.js';
import { products } from '../src/data/products.js';
import { homeContent, siteContent } from '../src/data/siteContent.js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.HLIME_SEED_ADMIN_EMAIL;
const adminPassword = process.env.HLIME_SEED_ADMIN_PASSWORD;
if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.');
if (!adminEmail || !adminPassword) throw new Error('Missing HLIME_SEED_ADMIN_EMAIL or HLIME_SEED_ADMIN_PASSWORD.');

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error: signInError } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
if (signInError) throw new Error(`Admin sign-in: ${signInError.message}`);
const translated = { vi_content_version: 1, ko_translation_status: 'manual', ko_source_vi_version: 1, ko_updated_at: new Date().toISOString() };

function fail(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
}

const categoryRows = categories.filter((category) => category.id !== 'all').map((category, index) => ({
  slug: category.id,
  name_vi: category.name.vi,
  name_ko: category.name.ko,
  image_path: category.image,
  active: true,
  display_order: index + 1,
  ...translated,
}));
fail(await supabase.from('categories').upsert(categoryRows, { onConflict: 'slug', ignoreDuplicates: true }), 'categories');

const savedCategories = fail(await supabase.from('categories').select('id,slug'), 'category lookup');
const categoryIds = new Map(savedCategories.map((category) => [category.slug, category.id]));
const productRows = products.map((product, index) => ({
  slug: product.id,
  category_id: categoryIds.get(product.category),
  name_vi: product.name.vi,
  name_ko: product.name.ko,
  short_description_vi: product.short.vi,
  short_description_ko: product.short.ko,
  description_vi: product.description.vi,
  description_ko: product.description.ko,
  price_amount: product.price,
  image_path: product.image,
  active: product.active,
  available: product.available,
  featured: false,
  best_seller: product.bestSeller,
  display_order: index + 1,
  ...translated,
}));
fail(await supabase.from('products').upsert(productRows, { onConflict: 'slug', ignoreDuplicates: true }), 'products');

const savedProducts = fail(await supabase.from('products').select('id,slug'), 'product lookup');
const productIds = new Map(savedProducts.map((product) => [product.slug, product.id]));
const celebrationId = productIds.get('celebration-rose');
if (!celebrationId) throw new Error('Seed product celebration-rose is missing.');

fail(await supabase.from('product_size_options').upsert(celebrationSizes.map((size, index) => ({
  product_id: celebrationId,
  option_key: size.id,
  label_vi: size.label.vi,
  label_ko: size.label.ko,
  active: true,
  display_order: index + 1,
  ...translated,
})), { onConflict: 'product_id,option_key', ignoreDuplicates: true }), 'size options');

fail(await supabase.from('product_flavor_options').upsert(celebrationFlavors.map((flavor, index) => ({
  product_id: celebrationId,
  option_key: flavor.id,
  label_vi: flavor.label.vi,
  label_ko: flavor.label.ko,
  image_path: flavor.image,
  active: true,
  display_order: index + 1,
  ...translated,
})), { onConflict: 'product_id,option_key', ignoreDuplicates: true }), 'flavor options');

const homepageRows = [
  {
    section_key: 'hero', eyebrow_vi: homeContent.hero.eyebrow.vi, eyebrow_ko: homeContent.hero.eyebrow.ko,
    title_vi: homeContent.hero.title.vi, title_ko: homeContent.hero.title.ko,
    subtitle_vi: homeContent.hero.lead.vi, subtitle_ko: homeContent.hero.lead.ko,
    body_vi: homeContent.hero.stamp.vi, body_ko: homeContent.hero.stamp.ko,
    image_path: homeContent.hero.image, active: true, display_order: 1,
  },
  {
    section_key: 'french-signature', eyebrow_vi: 'French Signature', eyebrow_ko: '프렌치 시그니처',
    title_vi: 'Kỹ thuật Pháp, cảm giác thật gần.', title_ko: '프렌치 테크닉을 편안하게 즐기세요.',
    body_vi: 'Những lớp bánh, kem và trái cây được cân chỉnh để tinh tế nhưng không xa cách — đúng tinh thần soft premium của Hlime.',
    body_ko: '섬세한 레이어와 크림, 과일의 균형을 살리되 어렵지 않게 즐길 수 있는 Hlime의 소프트 프리미엄입니다.',
    image_path: homeContent.editorialMedia.frenchSignature.image, active: true, display_order: 2,
  },
  {
    section_key: 'celebration', eyebrow_vi: 'Celebration', eyebrow_ko: '셀러브레이션',
    title_vi: 'Cho một ngày đáng nhớ hơn một chút.', title_ko: '소중한 날을 조금 더 특별하게.',
    body_vi: 'Chọn size, flavor, ngày cần bánh và lời nhắn.', body_ko: '사이즈, 맛, 필요한 날짜와 메시지를 선택하세요.',
    image_path: homeContent.editorialMedia.celebration.image, active: true, display_order: 3,
  },
  {
    section_key: 'about-preview', eyebrow_vi: 'Câu chuyện Hlime', eyebrow_ko: 'Hlime 이야기',
    title_vi: 'Bắt đầu từ niềm tin rằng bánh ngon không cần tạo khoảng cách.', title_ko: '좋은 디저트는 어렵거나 멀게 느껴질 필요가 없다는 믿음에서 시작했습니다.',
    body_vi: 'Chúng tôi theo đuổi những chiếc bánh đẹp, rõ vị và vừa vặn với nhịp sống hằng ngày.',
    body_ko: '아름답고 맛이 선명하며 일상의 리듬에 자연스럽게 어울리는 디저트를 지향합니다.',
    image_path: homeContent.editorialMedia.story.image, active: true, display_order: 4,
  },
].map((row) => ({ ...row, ...translated }));
fail(await supabase.from('homepage_settings').upsert(homepageRows, { onConflict: 'section_key', ignoreDuplicates: true }), 'homepage settings');

fail(await supabase.from('site_settings').upsert({
  id: 1,
  phone: siteContent.phone,
  email: siteContent.email,
  tagline_vi: siteContent.tagline,
  tagline_ko: '매일의 달콤함을 아름답게.',
  address_vi: siteContent.address.vi,
  address_ko: siteContent.address.ko,
  opening_hours_vi: siteContent.hours.vi,
  opening_hours_ko: siteContent.hours.ko,
  social_links: { instagram: '#instagram-demo' },
  map_url: siteContent.mapUrl,
  preferred_contact_channel: 'phone',
  ...translated,
}, { onConflict: 'id', ignoreDuplicates: true }), 'site settings');

fail(await supabase.from('order_settings').upsert({
  id: 1,
  pickup_help_vi: 'Nhận bánh tại cửa hàng trong khung giờ đã chọn.',
  pickup_help_ko: '선택한 시간에 매장에서 픽업해 주세요.',
  delivery_help_vi: 'Phí giao hàng sẽ được Hlime xác nhận.',
  delivery_help_ko: '배송비는 Hlime 확인 후 안내됩니다.',
  submit_help_vi: 'Đơn được gửi ở trạng thái PENDING để Hlime kiểm tra và xác nhận.',
  submit_help_ko: '주문은 PENDING 상태로 전송되며 Hlime이 확인합니다.',
  pending_help_vi: 'Đơn mới đang chờ Hlime xác nhận.',
  pending_help_ko: '새 주문이 Hlime 확인을 기다리고 있습니다.',
  confirmed_help_vi: 'Hlime đã xác nhận đơn hàng.',
  confirmed_help_ko: 'Hlime이 주문을 확인했습니다.',
  ...translated,
}, { onConflict: 'id', ignoreDuplicates: true }), 'order settings');

await supabase.auth.signOut();
process.stdout.write('Hlime demo seed: PASS\n');
