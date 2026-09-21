import { useCallback, useEffect, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import ImageUploadField from '../components/ImageUploadField';
import TranslationPanel from '../components/TranslationPanel';

const VI_FIELDS = ['eyebrow_vi', 'title_vi', 'subtitle_vi', 'body_vi'];
const KO_FIELDS = ['eyebrow_ko', 'title_ko', 'subtitle_ko', 'body_ko'];

function HomepageSectionForm({ section, onSaved }) {
  const [draft, setDraft] = useState(section);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      section_key: draft.section_key,
      image_path: draft.image_path || null,
      active: Boolean(draft.active),
      display_order: Math.max(0, Number(draft.display_order) || 0),
      ...Object.fromEntries([...VI_FIELDS, ...KO_FIELDS].map((field) => [field, draft[field]?.trim() || null])),
      ...translationMetaForSave(section, draft, VI_FIELDS, KO_FIELDS),
    };
    const { data, error } = await requireSupabase().from('homepage_settings').update(payload).eq('id', section.id).select('*').single();
    if (error) setStatus({ type: 'error', message: error.message });
    else {
      setDraft(data);
      setStatus({ type: 'success', message: 'Section đã được lưu. Public site sẽ thấy thay đổi sau khi refresh.' });
      onSaved();
    }
    setSaving(false);
  };

  const saveImagePath = async (path) => {
    const { data, error } = await requireSupabase().from('homepage_settings').update({ image_path: path }).eq('id', section.id).select('*').single();
    if (error) throw error;
    setDraft(data);
    await onSaved();
  };

  return (
    <form className="admin-card admin-form" onSubmit={save}>
      <div className="admin-card__header"><div><h2>{draft.section_key}</h2><p>Section schema hiện có · #{draft.display_order}</p></div><label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(event) => change('active', event.target.checked)} /><span>Visible</span></label></div>
      <div className="admin-form-grid">
        {VI_FIELDS.map((field) => <label className={`admin-field${field === 'body_vi' ? ' admin-field--wide' : ''}`} key={field}><span>{field}</span>{field === 'body_vi' || field === 'subtitle_vi' ? <textarea rows={field === 'body_vi' ? 4 : 2} value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} /> : <input value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} />}</label>)}
        <label className="admin-field"><span>display_order</span><input type="number" min="0" value={draft.display_order} onChange={(event) => change('display_order', event.target.value)} /></label>
      </div>
      <TranslationPanel status={draft.ko_translation_status}><div className="admin-form-grid">
        {KO_FIELDS.map((field) => <label className={`admin-field${field === 'body_ko' ? ' admin-field--wide' : ''}`} key={field}><span>{field}</span>{field === 'body_ko' || field === 'subtitle_ko' ? <textarea rows={field === 'body_ko' ? 4 : 2} value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} /> : <input value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} />}</label>)}
      </div></TranslationPanel>
      <ImageUploadField label="Ảnh section" path={draft.image_path} folder="site/home" onUploaded={saveImagePath} />
      <SaveNotice status={status} />
      <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu section'}</button>
    </form>
  );
}

export default function HomepagePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    const { data, error: loadError } = await requireSupabase().from('homepage_settings').select('*').order('display_order').order('id');
    if (loadError) setError(loadError.message); else { setSections(data); setError(''); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  return <AdminPage title="Homepage Settings" description="CMS tối thiểu theo đúng các field schema; không phải page builder.">
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !sections.length ? <AdminEmpty title="Chưa có Homepage section" /> : <div className="admin-stack">{sections.map((section) => <HomepageSectionForm key={section.id} section={section} onSaved={load} />)}</div>}
  </AdminPage>;
}
