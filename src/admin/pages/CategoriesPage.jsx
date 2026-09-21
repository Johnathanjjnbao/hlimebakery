import { useCallback, useEffect, useState } from 'react';
import { resolveImageUrl } from '../../lib/images';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave, translationStatusLabel } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import ImageUploadField from '../components/ImageUploadField';
import TranslationPanel from '../components/TranslationPanel';

const emptyCategory = { slug: '', name_vi: '', name_ko: '', short_description_vi: '', short_description_ko: '', image_path: '', active: true, display_order: 0, ko_translation_status: 'missing' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await requireSupabase().from('categories').select('*, products(count)').order('display_order').order('id');
    if (loadError) setError(loadError.message);
    else { setCategories(data); setError(''); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setDraft(editing ? { ...editing } : emptyCategory); setStatus(null); }, [editing]);

  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    if (!draft.name_vi.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) {
      setStatus({ type: 'error', message: 'Tên VI và slug kebab-case là bắt buộc.' });
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim(),
      name_vi: draft.name_vi.trim(),
      name_ko: draft.name_ko?.trim() || null,
      short_description_vi: draft.short_description_vi?.trim() || null,
      short_description_ko: draft.short_description_ko?.trim() || null,
      image_path: draft.image_path?.trim() || null,
      active: Boolean(draft.active),
      display_order: Math.max(0, Number(draft.display_order) || 0),
      ...translationMetaForSave(editing, draft, ['name_vi', 'short_description_vi'], ['name_ko', 'short_description_ko']),
    };
    const result = editing
      ? await requireSupabase().from('categories').update(payload).eq('id', editing.id).select('*').single()
      : await requireSupabase().from('categories').insert(payload).select('*').single();
    if (result.error) setStatus({ type: 'error', message: result.error.message });
    else {
      setStatus({ type: 'success', message: 'Category đã được lưu.' });
      setEditing(result.data);
      setDraft(result.data);
      await load();
    }
    setSaving(false);
  };

  const deactivate = async (category) => {
    const productCount = category.products?.[0]?.count || 0;
    const message = productCount
      ? `Category này đang được ${productCount} Product tham chiếu. Chuyển inactive thay vì xóa?`
      : 'Chuyển Category này sang inactive?';
    if (!window.confirm(message)) return;
    const { error: updateError } = await requireSupabase().from('categories').update({ active: false }).eq('id', category.id);
    if (updateError) setStatus({ type: 'error', message: updateError.message });
    else load();
  };

  const saveImagePath = async (path) => {
    if (!editing) throw new Error('Hãy lưu Category trước khi upload ảnh.');
    const { data, error: updateError } = await requireSupabase().from('categories').update({ image_path: path }).eq('id', editing.id).select('*').single();
    if (updateError) throw updateError;
    setEditing(data);
    setDraft(data);
    await load();
  };

  return (
    <AdminPage title="Categories" description="Quản lý category VI/KO; ưu tiên inactive thay vì hard-delete.">
      <div className="admin-two-column">
        <section className="admin-card">
          <div className="admin-card__header"><h2>Danh sách</h2><button className="admin-button admin-button--primary" type="button" onClick={() => setEditing(null)}>Thêm Category</button></div>
          {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !categories.length ? <AdminEmpty title="Chưa có Category" /> : (
            <div className="admin-list">
              {categories.map((category) => <button className={`admin-list-row${editing?.id === category.id ? ' is-active' : ''}`} type="button" key={category.id} onClick={() => setEditing(category)}>
                {category.image_path ? <img className="admin-thumb" src={resolveImageUrl(category.image_path)} alt="" /> : <span className="admin-thumb admin-thumb--empty">—</span>}
                <span><strong>{category.name_vi}</strong><small>{category.slug} · #{category.display_order}</small></span>
                <span className={`admin-status admin-status--${category.ko_translation_status}`}>{translationStatusLabel(category.ko_translation_status)}</span>
                <span className={category.active ? 'admin-chip admin-chip--success' : 'admin-chip'}>{category.active ? 'Active' : 'Inactive'}</span>
              </button>)}
            </div>
          )}
        </section>
        <form className="admin-card admin-form" onSubmit={save}>
          <h2>{editing ? `Edit Category #${editing.id}` : 'Thêm Category'}</h2>
          <div className="admin-form-grid">
            <label className="admin-field"><span>Slug *</span><input value={draft.slug} onChange={(event) => change('slug', event.target.value)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
            <label className="admin-field"><span>Display order</span><input type="number" min="0" value={draft.display_order} onChange={(event) => change('display_order', event.target.value)} /></label>
            <label className="admin-field admin-field--wide"><span>Tên VI *</span><input value={draft.name_vi} onChange={(event) => change('name_vi', event.target.value)} required /></label>
            <label className="admin-field admin-field--wide"><span>Mô tả ngắn VI</span><textarea rows="3" value={draft.short_description_vi || ''} onChange={(event) => change('short_description_vi', event.target.value)} /></label>
          </div>
          <TranslationPanel status={draft.ko_translation_status}><div className="admin-form-grid">
            <label className="admin-field admin-field--wide"><span>Tên KO</span><input value={draft.name_ko || ''} onChange={(event) => change('name_ko', event.target.value)} /></label>
            <label className="admin-field admin-field--wide"><span>Mô tả ngắn KO</span><textarea rows="3" value={draft.short_description_ko || ''} onChange={(event) => change('short_description_ko', event.target.value)} /></label>
          </div></TranslationPanel>
          <label className="admin-check"><input type="checkbox" checked={Boolean(draft.active)} onChange={(event) => change('active', event.target.checked)} /><span>Active</span></label>
          <ImageUploadField label="Ảnh Category" path={draft.image_path} folder={`categories/${editing?.id || 'new'}`} disabled={!editing} onUploaded={saveImagePath} />
          <SaveNotice status={status} />
          <div className="admin-inline-actions"><button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu Category'}</button>{editing?.active && <button className="admin-button admin-button--danger" type="button" onClick={() => deactivate(editing)}>Deactivate</button>}</div>
        </form>
      </div>
    </AdminPage>
  );
}
