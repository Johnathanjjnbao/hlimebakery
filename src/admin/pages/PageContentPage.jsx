import { useCallback, useEffect, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminEmpty, AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import ImageUploadField from '../components/ImageUploadField';
import TranslationPanel from '../components/TranslationPanel';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

const PAGES = ['about', 'contact', 'celebration'];
const VI_FIELDS = ['eyebrow_vi', 'title_vi', 'subtitle_vi', 'body_vi'];
const KO_FIELDS = ['eyebrow_ko', 'title_ko', 'subtitle_ko', 'body_ko'];
const TRANSLATION_FIELDS = VI_FIELDS.map((field, index) => [field, KO_FIELDS[index]]);

function ContentSectionForm({ section, onSaved }) {
  const { t } = useAdminLanguage();
  const [draft, setDraft] = useState(section);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const change = (field, value) => setDraft((current) => ({
    ...current,
    [field]: value,
    ...(field.endsWith('_ko') ? { ko_translation_status: 'manual' } : {}),
  }));

  useEffect(() => setDraft(section), [section]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      image_path: draft.image_path || null,
      active: Boolean(draft.active),
      display_order: Math.max(0, Number(draft.display_order) || 0),
      ...Object.fromEntries([...VI_FIELDS, ...KO_FIELDS].map((field) => [field, draft[field]?.trim() || null])),
      ...translationMetaForSave(section, draft, VI_FIELDS, KO_FIELDS),
    };
    const { data, error } = await requireSupabase().from('page_content').update(payload).eq('id', section.id).select('*').single();
    if (error) setStatus({ type: 'error', message: error.message });
    else {
      setDraft(data);
      setStatus({ type: 'success', message: t('pageContent.saved') });
      await onSaved();
    }
    setSaving(false);
  };

  const saveImagePath = async (path) => {
    const { data, error } = await requireSupabase().from('page_content').update({ image_path: path }).eq('id', section.id).select('*').single();
    if (error) throw error;
    setDraft(data);
    await onSaved();
  };

  return (
    <form className="admin-card admin-form" onSubmit={save}>
      <div className="admin-card__header">
        <div><h2>{draft.section_key}</h2><p>{t(`pageContent.${draft.page_key}`)} · {t('pageContent.fixedSection')} · #{draft.display_order}</p></div>
        <label className="admin-check"><input type="checkbox" checked={Boolean(draft.active)} onChange={(event) => change('active', event.target.checked)} /><span>{t('common.visible')}</span></label>
      </div>
      <div className="admin-form-grid">
        {VI_FIELDS.map((field) => <label className={`admin-field${field === 'body_vi' ? ' admin-field--wide' : ''}`} key={field}><span>{t(`content.${field.replace('_vi', '')}Vi`)}</span>{field === 'body_vi' || field === 'subtitle_vi' ? <textarea rows={field === 'body_vi' ? 5 : 2} value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} /> : <input value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} />}</label>)}
        <label className="admin-field"><span>{t('common.displayOrder')}</span><input type="number" min="0" value={draft.display_order} onChange={(event) => change('display_order', event.target.value)} /></label>
      </div>
      <TranslationPanel status={draft.ko_translation_status} values={draft} fieldPairs={TRANSLATION_FIELDS} onApply={(updates) => setDraft((current) => ({ ...current, ...updates }))}><div className="admin-form-grid">
        {KO_FIELDS.map((field) => <label className={`admin-field${field === 'body_ko' ? ' admin-field--wide' : ''}`} key={field}><span>{t(`content.${field.replace('_ko', '')}Ko`)}</span>{field === 'body_ko' || field === 'subtitle_ko' ? <textarea rows={field === 'body_ko' ? 5 : 2} value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} /> : <input value={draft[field] || ''} onChange={(event) => change(field, event.target.value)} />}</label>)}
      </div></TranslationPanel>
      <ImageUploadField label={t('pageContent.image')} path={draft.image_path} folder={`site/${draft.page_key}/${draft.section_key}`} onUploaded={saveImagePath} />
      <SaveNotice status={status} />
      <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? t('common.saving') : t('pageContent.save')}</button>
    </form>
  );
}

export default function PageContentPage() {
  const { t } = useAdminLanguage();
  const [page, setPage] = useState('about');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await requireSupabase().from('page_content').select('*').order('page_key').order('display_order').order('id');
    if (loadError) setError(loadError.message);
    else { setSections(data); setError(''); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  const visibleSections = sections.filter((section) => section.page_key === page);

  return <AdminPage title={t('pageContent.title')} description={t('pageContent.description')}>
    <div className="filter-bar" aria-label={t('pageContent.selectPage')}>
      {PAGES.map((item) => <button key={item} className={`filter-button${page === item ? ' is-active' : ''}`} type="button" onClick={() => setPage(item)} aria-pressed={page === item}>{t(`pageContent.${item}`)}</button>)}
    </div>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : !visibleSections.length ? <AdminEmpty title={t('pageContent.noSections')} /> : <div className="admin-stack">{visibleSections.map((section) => <ContentSectionForm key={section.id} section={section} onSaved={load} />)}</div>}
  </AdminPage>;
}
