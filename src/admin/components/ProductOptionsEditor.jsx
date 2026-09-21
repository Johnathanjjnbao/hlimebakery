import { useEffect, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave, translationStatusLabel } from '../../lib/translation';
import ImageUploadField from './ImageUploadField';
import { AdminEmpty, SaveNotice } from './AdminState';

const emptyOption = { option_key: '', label_vi: '', label_ko: '', image_path: '', active: true, display_order: 0, ko_translation_status: 'missing' };

export default function ProductOptionsEditor({ productId, kind, initialOptions, onRefresh }) {
  const table = kind === 'size' ? 'product_size_options' : 'product_flavor_options';
  const title = kind === 'size' ? 'Size options' : 'Flavor options';
  const [draft, setDraft] = useState(emptyOption);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(editing ? { ...editing } : emptyOption);
  }, [editing]);

  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.option_key) || !draft.label_vi.trim()) {
      setStatus({ type: 'error', message: 'option_key dạng kebab-case và label VI là bắt buộc.' });
      return;
    }
    setSaving(true);
    const payload = {
      product_id: productId,
      option_key: draft.option_key.trim(),
      label_vi: draft.label_vi.trim(),
      label_ko: draft.label_ko.trim() || null,
      active: Boolean(draft.active),
      display_order: Math.max(0, Number(draft.display_order) || 0),
      ...translationMetaForSave(editing, draft, ['label_vi'], ['label_ko']),
    };
    if (kind === 'flavor') payload.image_path = draft.image_path || null;
    const query = editing
      ? requireSupabase().from(table).update(payload).eq('id', editing.id)
      : requireSupabase().from(table).insert(payload);
    const { error } = await query;
    if (error) setStatus({ type: 'error', message: error.message });
    else {
      setStatus({ type: 'success', message: `${title} đã được lưu.` });
      setEditing(null);
      setDraft(emptyOption);
      await onRefresh();
    }
    setSaving(false);
  };

  const deactivate = async (option) => {
    if (!window.confirm(`Vô hiệu hóa “${option.label_vi}”?`)) return;
    const { error } = await requireSupabase().from(table).update({ active: false }).eq('id', option.id);
    if (error) setStatus({ type: 'error', message: error.message });
    else onRefresh();
  };

  const saveImagePath = async (path) => {
    if (!editing) throw new Error('Hãy lưu Flavor trước khi upload ảnh.');
    const { error } = await requireSupabase().from(table).update({ image_path: path }).eq('id', editing.id);
    if (error) throw error;
    setEditing((current) => ({ ...current, image_path: path }));
    setDraft((current) => ({ ...current, image_path: path }));
    await onRefresh();
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header"><div><h2>{title}</h2><p>Sắp xếp theo display_order; nội dung KO không bị tự ghi đè.</p></div></div>
      {!initialOptions.length ? <AdminEmpty title={`Chưa có ${title}`} /> : (
        <div className="admin-option-list">
          {initialOptions.map((option) => (
            <div className="admin-option-row" key={option.id}>
              <div><strong>{option.label_vi}</strong><span>{option.option_key} · {option.label_ko || 'Chưa có KO'} · #{option.display_order}</span></div>
              <span className={`admin-status admin-status--${option.ko_translation_status}`}>{translationStatusLabel(option.ko_translation_status)}</span>
              <span className={option.active ? 'admin-chip admin-chip--success' : 'admin-chip'}>{option.active ? 'Active' : 'Inactive'}</span>
              <div className="admin-inline-actions"><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(option)}>Edit</button>{option.active && <button className="admin-button admin-button--danger" type="button" onClick={() => deactivate(option)}>Deactivate</button>}</div>
            </div>
          ))}
        </div>
      )}
      <form className="admin-form admin-form--compact" onSubmit={save}>
        <h3>{editing ? `Edit ${title}` : `Thêm ${title}`}</h3>
        <div className="admin-form-grid">
          <label className="admin-field"><span>option_key</span><input value={draft.option_key} onChange={(event) => change('option_key', event.target.value)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
          <label className="admin-field"><span>display_order</span><input type="number" min="0" value={draft.display_order} onChange={(event) => change('display_order', event.target.value)} /></label>
          <label className="admin-field"><span>Label VI</span><input value={draft.label_vi} onChange={(event) => change('label_vi', event.target.value)} required /></label>
          <label className="admin-field"><span>Label KO</span><input value={draft.label_ko || ''} onChange={(event) => change('label_ko', event.target.value)} /></label>
          <label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(event) => change('active', event.target.checked)} /><span>Active</span></label>
        </div>
        {kind === 'flavor' && (
          <ImageUploadField label="Ảnh flavor" path={draft.image_path} folder={`products/${productId}/flavors`} disabled={!editing} onUploaded={saveImagePath} />
        )}
        <SaveNotice status={status} />
        <div className="admin-inline-actions"><button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu option'}</button>{editing && <button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)}>Hủy edit</button>}</div>
      </form>
    </section>
  );
}
