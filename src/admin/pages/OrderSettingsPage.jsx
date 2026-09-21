import { useCallback, useEffect, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import TranslationPanel from '../components/TranslationPanel';

const KEYS = ['pickup_help', 'delivery_help', 'submit_help', 'pending_help', 'confirmed_help'];
const labels = { pickup_help: 'Pickup help', delivery_help: 'Delivery help', submit_help: 'Submit help', pending_help: 'Pending help', confirmed_help: 'Confirmed help' };
const emptySettings = Object.assign({ id: 1, ko_translation_status: 'missing' }, ...KEYS.flatMap((key) => [{ [`${key}_vi`]: '' }, { [`${key}_ko`]: '' }]));

export default function OrderSettingsPage() {
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const viFields = KEYS.map((key) => `${key}_vi`);
  const koFields = KEYS.map((key) => `${key}_ko`);

  const load = useCallback(async () => {
    const { data, error: loadError } = await requireSupabase().from('order_settings').select('*').eq('id', 1).maybeSingle();
    if (loadError) setError(loadError.message); else { setOriginal(data); setDraft(data || emptySettings); setError(''); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      id: 1,
      ...Object.fromEntries([...viFields, ...koFields].map((field) => [field, draft[field]?.trim() || null])),
      ...translationMetaForSave(original, draft, viFields, koFields),
    };
    const { data, error: saveError } = await requireSupabase().from('order_settings').upsert(payload).select('*').single();
    if (saveError) setStatus({ type: 'error', message: saveError.message });
    else { setOriginal(data); setDraft(data); setStatus({ type: 'success', message: 'Order Settings đã được lưu.' }); }
    setSaving(false);
  };

  return <AdminPage title="Order Settings" description="Chỉ expose help text hiện có trong schema; không có fee engine hoặc payment logic.">
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : <form className="admin-card admin-form" onSubmit={save}>
      <div className="admin-form-grid">{KEYS.map((key) => <label className="admin-field admin-field--wide" key={key}><span>{labels[key]} VI</span><textarea rows="3" value={draft[`${key}_vi`] || ''} onChange={(event) => change(`${key}_vi`, event.target.value)} /></label>)}</div>
      <TranslationPanel status={draft.ko_translation_status}><div className="admin-form-grid">{KEYS.map((key) => <label className="admin-field admin-field--wide" key={key}><span>{labels[key]} KO</span><textarea rows="3" value={draft[`${key}_ko`] || ''} onChange={(event) => change(`${key}_ko`, event.target.value)} /></label>)}</div></TranslationPanel>
      <SaveNotice status={status} />
      <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu Order Settings'}</button>
    </form>}
  </AdminPage>;
}
