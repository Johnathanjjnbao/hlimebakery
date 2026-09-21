import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../lib/images';
import { requireSupabase } from '../../lib/supabase';
import { money } from '../../utils/i18n';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading } from '../components/AdminState';

export default function ProductsPage() {
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
      title="Products"
      description="Quản lý sản phẩm, trạng thái bán và options VI/KO."
      action={<Link className="admin-button admin-button--primary" to="/admin/products/new">Thêm Product</Link>}
    >
      <div className="admin-toolbar">
        <label className="admin-field"><span>Tìm theo tên VI</span><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" /></label>
        <label className="admin-field"><span>Trạng thái</span><select value={active} onChange={(event) => setActive(event.target.value)}><option value="all">Tất cả</option><option value="true">Active</option><option value="false">Inactive</option></select></label>
        <label className="admin-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Tất cả</option>{categories.map((item) => <option value={item.id} key={item.id}>{item.name_vi}</option>)}</select></label>
      </div>
      {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !visible.length ? <AdminEmpty title="Không có Product phù hợp" text="Thử đổi bộ lọc hoặc tạo Product mới." /> : (
        <div className="admin-table-wrap"><table className="admin-table admin-table--products"><thead><tr><th>Ảnh</th><th>Tên VI</th><th>Category</th><th>Giá</th><th>Flags</th><th>Thứ tự</th><th /></tr></thead><tbody>
          {visible.map((product) => (
            <tr key={product.id}>
              <td>{product.image_path ? <img className="admin-thumb" src={resolveImageUrl(product.image_path)} alt="" /> : <span className="admin-thumb admin-thumb--empty">—</span>}</td>
              <td><strong>{product.name_vi}</strong><small>{product.slug}</small></td>
              <td>{product.categories?.name_vi || '—'}</td>
              <td>{money(product.price_amount)}</td>
              <td><div className="admin-tag-list"><span className={product.active ? 'is-on' : ''}>Active</span><span className={product.available ? 'is-on' : ''}>Available</span><span className={product.featured ? 'is-on' : ''}>Featured</span><span className={product.best_seller ? 'is-on' : ''}>Best seller</span></div></td>
              <td>{product.display_order}</td>
              <td><Link to={`/admin/products/${product.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody></table></div>
      )}
    </AdminPage>
  );
}
