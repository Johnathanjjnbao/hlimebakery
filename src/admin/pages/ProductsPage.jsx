import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../lib/images';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminState';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function ProductsPage() {
  const { locale, t } = useAdminLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('all');
  const [category, setCategory] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const client = requireSupabase();
    const [productResult, categoryResult] = await Promise.all([
      client.from('products').select('*, categories(id,name_vi)').order('display_order').order('id'),
      client.from('categories').select('id,name_vi').order('display_order').order('id'),
    ]);
    const failure = productResult.error || categoryResult.error;
    if (failure) setError(failure.message);
    else {
      setProducts(productResult.data);
      setCategories(categoryResult.data);
      setError('');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => products.filter((product) => {
    const matchesSearch = product.name_vi.toLowerCase().includes(search.trim().toLowerCase());
    const matchesActive = active === 'all' || String(product.active) === active;
    const matchesCategory = category === 'all' || String(product.category_id) === category;
    return matchesSearch && matchesActive && matchesCategory;
  }), [active, category, products, search]);

  return (
    <AdminPage
      title={t('products.title')}
      description={t('products.description')}
      action={<Link className="admin-button admin-button--primary" to="/admin/products/new">{t('products.add')}</Link>}
    >
      <div className="admin-toolbar">
        <label className="admin-field"><span>{t('products.searchVi')}</span><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" /></label>
        <label className="admin-field"><span>{t('common.status')}</span><select value={active} onChange={(event) => setActive(event.target.value)}><option value="all">{t('common.all')}</option><option value="true">{t('common.active')}</option><option value="false">{t('common.inactive')}</option></select></label>
        <label className="admin-field"><span>{t('common.category')}</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">{t('common.all')}</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name_vi}</option>)}</select></label>
      </div>
      {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !visible.length ? <AdminEmpty title={t('products.noMatch')} text={t('products.noMatchText')} /> : (
        <div className="admin-table-wrap"><table className="admin-table admin-table--products"><thead><tr><th>{t('common.image')}</th><th>{t('products.nameVi')}</th><th>{t('common.category')}</th><th>{t('common.price')}</th><th>{t('common.flags')}</th><th>{t('common.displayOrder')}</th><th /></tr></thead><tbody>
          {visible.map((product) => (
            <tr key={product.id}>
              <td>{product.image_path ? <img className="admin-thumb" src={resolveImageUrl(product.image_path)} alt="" /> : <span className="admin-thumb admin-thumb--empty">—</span>}</td>
              <td><strong>{product.name_vi}</strong><small>{product.slug}</small></td>
              <td>{product.categories?.name_vi || '—'}</td>
              <td>{money(product.price_amount, locale)}</td>
              <td><div className="admin-tag-list"><span className={product.active ? 'is-on' : ''}>{t('common.active')}</span><span className={product.available ? 'is-on' : ''}>{t('common.available')}</span><span className={product.featured ? 'is-on' : ''}>{t('common.featured')}</span><span className={product.best_seller ? 'is-on' : ''}>{t('common.bestSeller')}</span></div></td>
              <td>{product.display_order}</td>
              <td><Link to={`/admin/products/${product.id}`}>{t('common.edit')}</Link></td>
            </tr>
          ))}
        </tbody></table></div>
      )}
    </AdminPage>
  );
}
