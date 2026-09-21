import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import ImageUploadField from '../components/ImageUploadField';
import ProductOptionsEditor from '../components/ProductOptionsEditor';
import TranslationPanel from '../components/TranslationPanel';

const emptyProduct = {
  slug: '', category_id: '', name_vi: '', name_ko: '', short_description_vi: '', short_description_ko: '',
  description_vi: '', description_ko: '', price_amount: 0, image_path: '', active: false, available: true,
  featured: false, best_seller: false, display_order: 0, ko_translation_status: 'missing',
};

export default function ProductFormPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const client = requireSupabase();
    const categoryResult = await client.from('categories').select('id,name_vi,active').order('display_order').order('id');
    if (categoryResult.error) {
      setError(categoryResult.error.message);
      setLoading(false);
      return;
    }
    setCategories(categoryResult.data);
    if (isNew) {
      setDraft((current) => ({ ...current, category_id: categoryResult.data[0]?.id || '' }));
      setLoading(false);
      return;
    }
    const [productResult, sizeResult, flavorResult] = await Promise.all([
      client.from('products').select('*').eq('id', id).single(),
      client.from('product_size_options').select('*').eq('product_id', id).order('display_order').order('id'),
      client.from('product_flavor_options').select('*').eq('product_id', id).order('display_order').order('id'),
    ]);
    const failure = productResult.error || sizeResult.error || flavorResult.error;
    if (failure) setError(failure.message);
    else {
      setOriginal(productResult.data);
      setDraft(productResult.data);
      setSizes(sizeResult.data);
      setFlavors(flavorResult.data);
      setError('');
    }
    setLoading(false);
  }, [id, isNew]);

  useEffect(() => { load(); }, [load]);

  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setStatus(null);
    if (!draft.name_vi.trim()) return setStatus({ type: 'error', message: 'Tên VI là bắt buộc.' });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) return setStatus({ type: 'error', message: 'Slug phải ở dạng kebab-case.' });
    if (!draft.category_id) return setStatus({ type: 'error', message: 'Vui lòng chọn Category.' });
    if (Number(draft.price_amount) < 0) return setStatus({ type: 'error', message: 'Giá phải lớn hơn hoặc bằng 0.' });
    if (draft.active && !draft.image_path?.trim()) return setStatus({ type: 'error', message: 'Product active phải có ảnh. Hãy lưu inactive, upload ảnh rồi bật active.' });

    setSaving(true);
    const payload = {
      slug: draft.slug.trim(),
      category_id: Number(draft.category_id),
      name_vi: draft.name_vi.trim(),
      name_ko: draft.name_ko?.trim() || null,
      short_description_vi: draft.short_description_vi?.trim() || null,
      short_description_ko: draft.short_description_ko?.trim() || null,
      description_vi: draft.description_vi?.trim() || null,
      description_ko: draft.description_ko?.trim() || null,
      price_amount: Math.round(Number(draft.price_amount) || 0),
      image_path: draft.image_path?.trim() || null,
      active: Boolean(draft.active),
      available: Boolean(draft.available),
      featured: Boolean(draft.featured),
      best_seller: Boolean(draft.best_seller),
      display_order: Math.max(0, Number(draft.display_order) || 0),
      ...translationMetaForSave(original, draft,
        ['name_vi', 'short_description_vi', 'description_vi'],
        ['name_ko', 'short_description_ko', 'description_ko']),
    };
    const result = isNew
      ? await requireSupabase().from('products').insert(payload).select('*').single()
      : await requireSupabase().from('products').update(payload).eq('id', id).select('*').single();
    if (result.error) setStatus({ type: 'error', message: result.error.message });
    else if (isNew) navigate(`/admin/products/${result.data.id}`, { replace: true });
    else {
      setOriginal(result.data);
      setDraft(result.data);
      setStatus({ type: 'success', message: 'Product đã được lưu.' });
    }
    setSaving(false);
  };

  const saveImagePath = async (path) => {
    const { data, error: updateError } = await requireSupabase().from('products').update({ image_path: path }).eq('id', id).select('*').single();
    if (updateError) throw updateError;
    setOriginal(data);
    setDraft(data);
  };

  return (
    <AdminPage title={isNew ? 'Thêm Product' : `Edit Product #${id}`} description="Các field khớp trực tiếp schema hiện tại." action={<Link className="admin-button admin-button--secondary" to="/admin/products">Quay lại list</Link>}>
      {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : (
        <>
          <form className="admin-card admin-form" onSubmit={save}>
            <div className="admin-form-section"><h2>Thông tin chung</h2><div className="admin-form-grid">
              <label className="admin-field"><span>Slug *</span><input value={draft.slug} onChange={(event) => change('slug', event.target.value)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
              <label className="admin-field"><span>Category *</span><select value={draft.category_id} onChange={(event) => change('category_id', event.target.value)} required><option value="">Chọn category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name_vi}{category.active ? '' : ' (inactive)'}</option>)}</select></label>
              <label className="admin-field"><span>Tên VI *</span><input value={draft.name_vi} onChange={(event) => change('name_vi', event.target.value)} required /></label>
              <label className="admin-field"><span>Giá (VND) *</span><input type="number" min="0" step="1000" value={draft.price_amount} onChange={(event) => change('price_amount', event.target.value)} required /></label>
              <label className="admin-field admin-field--wide"><span>Mô tả ngắn VI</span><textarea rows="2" value={draft.short_description_vi || ''} onChange={(event) => change('short_description_vi', event.target.value)} /></label>
              <label className="admin-field admin-field--wide"><span>Mô tả VI</span><textarea rows="5" value={draft.description_vi || ''} onChange={(event) => change('description_vi', event.target.value)} /></label>
              <label className="admin-field"><span>Display order</span><input type="number" min="0" value={draft.display_order} onChange={(event) => change('display_order', event.target.value)} /></label>
            </div></div>

            <TranslationPanel status={draft.ko_translation_status}>
              <div className="admin-form-grid">
                <label className="admin-field"><span>Tên KO</span><input value={draft.name_ko || ''} onChange={(event) => change('name_ko', event.target.value)} /></label>
                <label className="admin-field admin-field--wide"><span>Mô tả ngắn KO</span><textarea rows="2" value={draft.short_description_ko || ''} onChange={(event) => change('short_description_ko', event.target.value)} /></label>
                <label className="admin-field admin-field--wide"><span>Mô tả KO</span><textarea rows="5" value={draft.description_ko || ''} onChange={(event) => change('description_ko', event.target.value)} /></label>
              </div>
            </TranslationPanel>

            <div className="admin-check-grid">
              {[['active', 'Active'], ['available', 'Available'], ['featured', 'Featured'], ['best_seller', 'Best seller']].map(([field, label]) => <label className="admin-check" key={field}><input type="checkbox" checked={Boolean(draft[field])} onChange={(event) => change(field, event.target.checked)} /><span>{label}</span></label>)}
            </div>
            <ImageUploadField label="Ảnh Product" path={draft.image_path} folder={`products/${id}`} disabled={isNew} onUploaded={saveImagePath} />
            <SaveNotice status={status} />
            <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu Product'}</button>
          </form>
          {!isNew && <ProductOptionsEditor productId={Number(id)} kind="size" initialOptions={sizes} onRefresh={load} />}
          {!isNew && <ProductOptionsEditor productId={Number(id)} kind="flavor" initialOptions={flavors} onRefresh={load} />}
        </>
      )}
    </AdminPage>
  );
}
