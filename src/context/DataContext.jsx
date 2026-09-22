import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { celebrationFlavors, celebrationSizes } from '../data/celebration';
import { categories as demoCategories } from '../data/categories';
import { products as demoProducts } from '../data/products';
import { homeContent as demoHome, siteContent as demoSite } from '../data/siteContent';
import { resolveImageUrl } from '../lib/images';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const DataContext = createContext(null);

const defaultOrderSettings = {
  pickup_help: {
    vi: 'Nhận bánh tại cửa hàng trong khung giờ đã chọn.',
    ko: '선택한 시간에 매장에서 픽업해 주세요.',
  },
  delivery_help: {
    vi: 'Phí giao hàng sẽ được Hlime xác nhận.',
    ko: '배송비는 Hlime 확인 후 안내됩니다.',
  },
  submit_help: {
    vi: 'Đơn được gửi ở trạng thái PENDING để Hlime kiểm tra và xác nhận.',
    ko: '주문은 PENDING 상태로 전송되며 Hlime이 확인합니다.',
  },
  pending_help: { vi: 'Đơn mới đang chờ Hlime xác nhận.', ko: '새 주문이 Hlime 확인을 기다리고 있습니다.' },
  confirmed_help: { vi: 'Hlime đã xác nhận đơn hàng.', ko: 'Hlime이 주문을 확인했습니다.' },
};

const demoOptions = {
  sizes: celebrationSizes.map((item, index) => ({ ...item, optionKey: item.id, displayOrder: index + 1, active: true })),
  flavors: celebrationFlavors.map((item, index) => ({ ...item, optionKey: item.id, displayOrder: index + 1, active: true })),
};

function mapCategory(row) {
  return {
    id: row.slug,
    databaseId: row.id,
    name: { vi: row.name_vi, ko: row.name_ko || row.name_vi },
    short: { vi: row.short_description_vi || '', ko: row.short_description_ko || row.short_description_vi || '' },
    image: resolveImageUrl(row.image_path),
    active: row.active,
    displayOrder: row.display_order,
  };
}

function mapProduct(row) {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.slug,
    databaseId: row.id,
    category: category?.slug || '',
    categoryId: row.category_id,
    categoryName: { vi: category?.name_vi || '', ko: category?.name_ko || category?.name_vi || '' },
    name: { vi: row.name_vi, ko: row.name_ko || row.name_vi },
    short: { vi: row.short_description_vi || '', ko: row.short_description_ko || row.short_description_vi || '' },
    description: { vi: row.description_vi || '', ko: row.description_ko || row.description_vi || '' },
    price: Number(row.price_amount || 0),
    image: resolveImageUrl(row.image_path),
    imagePath: row.image_path,
    badge: row.best_seller ? { vi: 'Bán chạy', ko: '베스트' } : { vi: '', ko: '' },
    active: row.active,
    available: row.available,
    featured: row.featured,
    bestSeller: row.best_seller,
    displayOrder: row.display_order,
  };
}

function mapHome(rows) {
  return Object.fromEntries(rows.map((row) => [row.section_key, {
    id: row.id,
    eyebrow: { vi: row.eyebrow_vi || '', ko: row.eyebrow_ko || row.eyebrow_vi || '' },
    title: { vi: row.title_vi || '', ko: row.title_ko || row.title_vi || '' },
    subtitle: { vi: row.subtitle_vi || '', ko: row.subtitle_ko || row.subtitle_vi || '' },
    body: { vi: row.body_vi || '', ko: row.body_ko || row.body_vi || '' },
    image: resolveImageUrl(row.image_path),
  }]));
}

function mapPageContent(rows) {
  return rows.reduce((pages, row) => {
    pages[row.page_key] ||= {};
    pages[row.page_key][row.section_key] = {
      id: row.id,
      eyebrow: { vi: row.eyebrow_vi || '', ko: row.eyebrow_ko || row.eyebrow_vi || '' },
      title: { vi: row.title_vi || '', ko: row.title_ko || row.title_vi || '' },
      subtitle: { vi: row.subtitle_vi || '', ko: row.subtitle_ko || row.subtitle_vi || '' },
      body: { vi: row.body_vi || '', ko: row.body_ko || row.body_vi || '' },
      image: resolveImageUrl(row.image_path),
    };
    return pages;
  }, {});
}

function mapSite(row) {
  if (!row) return {
    ...demoSite,
    tagline: { vi: '', ko: '' },
    phone: '',
    phoneHref: '',
    email: '',
    address: { vi: '', ko: '' },
    addressShort: { vi: '', ko: '' },
    hours: { vi: '', ko: '' },
    mapUrl: '',
    socialLinks: {},
    preferredContactChannel: '',
  };
  const phoneHref = `tel:${String(row.phone || '').replace(/[^+\d]/g, '')}`;
  return {
    ...demoSite,
    tagline: { vi: row.tagline_vi || '', ko: row.tagline_ko || row.tagline_vi || '' },
    phone: row.phone || '',
    phoneHref,
    email: row.email || '',
    address: { vi: row.address_vi || '', ko: row.address_ko || row.address_vi || '' },
    addressShort: { vi: row.address_vi || '', ko: row.address_ko || row.address_vi || '' },
    hours: { vi: row.opening_hours_vi || '', ko: row.opening_hours_ko || row.opening_hours_vi || '' },
    mapUrl: row.map_url || '',
    socialLinks: row.social_links || {},
    preferredContactChannel: row.preferred_contact_channel || '',
  };
}

function mapOrderSettings(row) {
  if (!row) return Object.fromEntries(Object.keys(defaultOrderSettings).map((key) => [key, { vi: '', ko: '' }]));
  return Object.fromEntries(['pickup_help', 'delivery_help', 'submit_help', 'pending_help', 'confirmed_help'].map((key) => [key, {
    vi: row[`${key}_vi`] || '',
    ko: row[`${key}_ko`] || row[`${key}_vi`] || '',
  }]));
}

function mapOption(row, productById, kind) {
  return {
    id: row.option_key,
    databaseId: row.id,
    productId: productById.get(row.product_id)?.id || '',
    productDatabaseId: row.product_id,
    optionKey: row.option_key,
    label: { vi: row.label_vi, ko: row.label_ko || row.label_vi },
    image: kind === 'flavor' ? resolveImageUrl(row.image_path) : undefined,
    imagePath: kind === 'flavor' ? row.image_path : undefined,
    alt: kind === 'flavor' ? { vi: `${row.label_vi} — Hlime`, ko: `${row.label_ko || row.label_vi} — Hlime` } : undefined,
    active: row.active,
    displayOrder: row.display_order,
  };
}

const fallbackState = {
  categories: demoCategories,
  products: demoProducts,
  home: demoHome,
  homeSections: {},
  pageContent: {},
  site: demoSite,
  orderSettings: defaultOrderSettings,
  sizeOptions: demoOptions.sizes.map((item) => ({ ...item, productId: 'celebration-rose' })),
  flavorOptions: demoOptions.flavors.map((item) => ({ ...item, productId: 'celebration-rose' })),
};

export function DataProvider({ children }) {
  const [data, setData] = useState(fallbackState);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(false);
  const [source, setSource] = useState('demo');

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [categoryResult, productResult, sizeResult, flavorResult, homeResult, pageResult, siteResult, orderResult] = await Promise.all([
      supabase.from('categories').select('*').eq('active', true).order('display_order').order('id'),
      supabase.from('products').select('*, categories(slug,name_vi,name_ko)').eq('active', true).order('display_order').order('id'),
      supabase.from('product_size_options').select('*').eq('active', true).order('display_order').order('id'),
      supabase.from('product_flavor_options').select('*').eq('active', true).order('display_order').order('id'),
      supabase.from('homepage_settings').select('*').eq('active', true).order('display_order').order('id'),
      supabase.from('page_content').select('*').eq('active', true).order('page_key').order('display_order').order('id'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('order_settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    const failure = [categoryResult, productResult, sizeResult, flavorResult, homeResult, pageResult, siteResult, orderResult].find((result) => result.error);
    if (failure) {
      console.error('Unable to load public data from Supabase.', failure.error);
      setError(true);
      setData(fallbackState);
      setSource('demo');
      setLoading(false);
      return;
    }

    const mappedCategories = categoryResult.data.map(mapCategory);
    const mappedProducts = productResult.data.map(mapProduct);
    const productById = new Map(mappedProducts.map((product) => [product.databaseId, product]));
    const mappedSizes = sizeResult.data.map((row) => mapOption(row, productById, 'size'));
    const mappedFlavors = flavorResult.data.map((row) => mapOption(row, productById, 'flavor'));
    setData({
      categories: [{ id: 'all', name: { vi: 'Tất cả', ko: '전체' } }, ...mappedCategories],
      products: mappedProducts,
      home: demoHome,
      homeSections: mapHome(homeResult.data),
      pageContent: mapPageContent(pageResult.data),
      site: mapSite(siteResult.data),
      orderSettings: mapOrderSettings(orderResult.data),
      sizeOptions: mappedSizes,
      flavorOptions: mappedFlavors,
    });
    setError(false);
    setSource('supabase');
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({
    ...data,
    loading,
    error,
    source,
    refresh,
    getProduct: (slug) => data.products.find((product) => product.id === slug && product.active),
    getOptions: (slug) => ({
      sizes: data.sizeOptions.filter((option) => option.productId === slug && option.active),
      flavors: data.flavorOptions.filter((option) => option.productId === slug && option.active),
    }),
  }), [data, error, loading, refresh, source]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used inside DataProvider');
  return context;
}
