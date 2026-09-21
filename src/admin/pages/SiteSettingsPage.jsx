import { useCallback, useEffect, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import TranslationPanel from '../components/TranslationPanel';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

const emptySettings = {
  id: 1, tagline_vi: '', tagline_ko: '', phone: '', email: '', address_vi: '', address_ko: '', opening_hours_vi: '', opening_hours_ko: '',
  social_links: {}, map_url: '', preferred_contact_channel: '', ko_translation_status: 'missing',
};

export default function SiteSettingsPage() {
  const { t } = useAdminLanguage();
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState(emptySettings);
  const [socialJson, setSocialJson] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);

  const load = useCallback(async () => {
    const { data, error: loadError } = await requireSupabase().from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (loadError) setError(loadError.message);
    else {
      const row = data || emptySettings;
      setOriginal(data);
      setDraft(row);
      setSocialJson(JSON.stringify(row.social_links || {}, null, 2));
      setError('');
    }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    let socialLinks;
    try {
      socialLinks = JSON.parse(socialJson || '{}');
      if (!socialLinks || Array.isArray(socialLinks) || typeof socialLinks !== 'object') throw new Error();
    } catch {
      setStatus({ type: 'error', message: t('siteSettings.socialValidation') });
      return;
    }
    setSaving(true);
    const payload = {
      id: 1,
      tagline_vi: draft.tagline_vi?.trim() || null,
      tagline_ko: draft.tagline_ko?.trim() || null,
      phone: draft.phone?.trim() || null,
      email: draft.email?.trim() || null,
      address_vi: draft.address_vi?.trim() || null,
      address_ko: draft.address_ko?.trim() || null,
      opening_hours_vi: draft.opening_hours_vi?.trim() || null,
      opening_hours_ko: draft.opening_hours_ko?.trim() || null,
      social_links: socialLinks,
      map_url: draft.map_url?.trim() || null,
      preferred_contact_channel: draft.preferred_contact_channel?.trim() || null,
      ...translationMetaForSave(original, draft, ['tagline_vi', 'address_vi', 'opening_hours_vi'], ['tagline_ko', 'address_ko', 'opening_hours_ko']),
    };
    const { data, error: saveError } = await requireSupabase().from('site_settings').upsert(payload).select('*').single();
    if (saveError) setStatus({ type: 'error', message: saveError.message });
    else {
      setOriginal(data); setDraft(data); setStatus({ type: 'success', message: t('siteSettings.saved') });
    }
    setSaving(false);
  };

  return <AdminPage title={t('siteSettings.title')} description={t('siteSettings.description')}>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : <form className="admin-card admin-form" onSubmit={save}>
      <div className="admin-form-grid">
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.taglineVi')}</span><input value={draft.tagline_vi || ''} onChange={(event) => change('tagline_vi', event.target.value)} /></label>
        <label className="admin-field"><span>{t('common.phone')}</span><input type="tel" value={draft.phone || ''} onChange={(event) => change('phone', event.target.value)} /></label>
        <label className="admin-field"><span>{t('common.email')}</span><input type="email" value={draft.email || ''} onChange={(event) => change('email', event.target.value)} /></label>
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.addressVi')}</span><textarea rows="3" value={draft.address_vi || ''} onChange={(event) => change('address_vi', event.target.value)} /></label>
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.hoursVi')}</span><input value={draft.opening_hours_vi || ''} onChange={(event) => change('opening_hours_vi', event.target.value)} /></label>
        <label className="admin-field"><span>{t('siteSettings.mapUrl')}</span><input type="url" value={draft.map_url || ''} onChange={(event) => change('map_url', event.target.value)} /></label>
        <label className="admin-field"><span>{t('siteSettings.preferredContact')}</span><input value={draft.preferred_contact_channel || ''} onChange={(event) => change('preferred_contact_channel', event.target.value)} /></label>
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.socialLinks')}</span><textarea rows="5" value={socialJson} onChange={(event) => setSocialJson(event.target.value)} spellCheck="false" /></label>
      </div>
      <TranslationPanel status={draft.ko_translation_status}><div className="admin-form-grid">
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.taglineKo')}</span><input value={draft.tagline_ko || ''} onChange={(event) => change('tagline_ko', event.target.value)} /></label>
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.addressKo')}</span><textarea rows="3" value={draft.address_ko || ''} onChange={(event) => change('address_ko', event.target.value)} /></label>
        <label className="admin-field admin-field--wide"><span>{t('siteSettings.hoursKo')}</span><input value={draft.opening_hours_ko || ''} onChange={(event) => change('opening_hours_ko', event.target.value)} /></label>
      </div></TranslationPanel>
      <SaveNotice status={status} />
      <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? t('common.saving') : t('siteSettings.save')}</button>
    </form>}
  </AdminPage>;
}
