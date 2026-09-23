import { useCallback, useEffect, useRef, useState } from 'react';
import { requireSupabase } from '../../lib/supabase';
import { translationMetaForSave } from '../../lib/translation';
import AdminPage from '../components/AdminPage';
import { AdminError, AdminLoading, SaveNotice } from '../components/AdminState';
import TranslationPanel from '../components/TranslationPanel';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

const KEYS = ['pickup_help', 'delivery_help', 'submit_help', 'pending_help', 'confirmed_help', 'payment_instruction'];
const labelKeys = { pickup_help: 'orderSettings.pickupHelp', delivery_help: 'orderSettings.deliveryHelp', submit_help: 'orderSettings.submitHelp', pending_help: 'orderSettings.pendingHelp', confirmed_help: 'orderSettings.confirmedHelp', payment_instruction: 'orderSettings.paymentInstruction' };
const emptySettings = Object.assign({
  id: 1,
  ko_translation_status: 'missing',
  bank_transfer_enabled: false,
  cash_enabled: true,
  bank_id: '',
  bank_name: '',
  bank_account_no: '',
  bank_account_name: '',
}, ...KEYS.flatMap((key) => [{ [`${key}_vi`]: '' }, { [`${key}_ko`]: '' }]));
const TRANSLATION_FIELDS = KEYS.map((key) => [`${key}_vi`, `${key}_ko`]);

export default function OrderSettingsPage() {
  const { t } = useAdminLanguage();
  const [original, setOriginal] = useState(null);
  const [draft, setDraft] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const loadSequence = useRef(0);
  const viFields = KEYS.map((key) => `${key}_vi`);
  const koFields = KEYS.map((key) => `${key}_ko`);

  const load = useCallback(async () => {
    const requestId = ++loadSequence.current;
    setLoading(true);
    const { data, error: loadError } = await requireSupabase().from('order_settings').select('*').eq('id', 1).maybeSingle();
    if (requestId !== loadSequence.current) return;
    if (loadError) setError(loadError.message); else { setOriginal(data); setDraft(data || emptySettings); setError(''); }
    setLoading(false);
  }, []);
  useEffect(() => {
    load();
    return () => { loadSequence.current += 1; };
  }, [load]);
  const change = (field, value) => setDraft((current) => ({
    ...current,
    [field]: value,
    ...(field.endsWith('_ko') ? { ko_translation_status: 'manual' } : {}),
  }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    if (!draft.bank_transfer_enabled && !draft.cash_enabled) {
      setStatus({ type: 'error', message: t('orderSettings.validationMethod') });
      setSaving(false);
      return;
    }
    if (draft.bank_transfer_enabled) {
      const validBankId = /^[A-Za-z0-9_-]{2,20}$/.test(draft.bank_id?.trim() || '');
      const validAccountNo = /^[A-Za-z0-9.-]{3,34}$/.test(draft.bank_account_no?.trim() || '');
      if (!validBankId || !validAccountNo || !draft.bank_name?.trim() || !draft.bank_account_name?.trim()) {
        setStatus({ type: 'error', message: t('orderSettings.validationBank') });
        setSaving(false);
        return;
      }
    }
    const payload = {
      id: 1,
      ...Object.fromEntries([...viFields, ...koFields].map((field) => [field, draft[field]?.trim() || null])),
      bank_transfer_enabled: Boolean(draft.bank_transfer_enabled),
      cash_enabled: Boolean(draft.cash_enabled),
      bank_id: draft.bank_id?.trim() || null,
      bank_name: draft.bank_name?.trim() || null,
      bank_account_no: draft.bank_account_no?.trim() || null,
      bank_account_name: draft.bank_account_name?.trim() || null,
      ...translationMetaForSave(original, draft, viFields, koFields),
    };
    const { data, error: saveError } = await requireSupabase().from('order_settings').upsert(payload).select('*').single();
    if (saveError) setStatus({ type: 'error', message: saveError.message });
    else { setOriginal(data); setDraft(data); setStatus({ type: 'success', message: t('orderSettings.saved') }); }
    setSaving(false);
  };

  return <AdminPage title={t('orderSettings.title')} description={t('orderSettings.description')}>
    {loading ? <AdminLoading /> : error ? <AdminError error={error} retry={load} /> : <form className="admin-card admin-form" onSubmit={save}>
      <section className="admin-form-section">
        <h2>{t('orderSettings.paymentSection')}</h2>
        <div className="admin-check-grid">
          <label className="admin-check"><input type="checkbox" checked={Boolean(draft.bank_transfer_enabled)} onChange={(event) => change('bank_transfer_enabled', event.target.checked)} />{t('orderSettings.bankTransferEnabled')}</label>
          <label className="admin-check"><input type="checkbox" checked={Boolean(draft.cash_enabled)} onChange={(event) => change('cash_enabled', event.target.checked)} />{t('orderSettings.cashEnabled')}</label>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field"><span>{t('orderSettings.bankId')}</span><input value={draft.bank_id || ''} onChange={(event) => change('bank_id', event.target.value)} required={draft.bank_transfer_enabled} maxLength="20" /></label>
          <label className="admin-field"><span>{t('orderSettings.bankName')}</span><input value={draft.bank_name || ''} onChange={(event) => change('bank_name', event.target.value)} required={draft.bank_transfer_enabled} maxLength="160" /></label>
          <label className="admin-field"><span>{t('orderSettings.accountNo')}</span><input value={draft.bank_account_no || ''} onChange={(event) => change('bank_account_no', event.target.value)} required={draft.bank_transfer_enabled} maxLength="34" inputMode="numeric" /></label>
          <label className="admin-field"><span>{t('orderSettings.accountName')}</span><input value={draft.bank_account_name || ''} onChange={(event) => change('bank_account_name', event.target.value)} required={draft.bank_transfer_enabled} maxLength="160" /></label>
        </div>
      </section>
      <section className="admin-form-section"><h2>{t('orderSettings.helpSection')}</h2><div className="admin-form-grid">{KEYS.map((key) => <label className="admin-field admin-field--wide" key={key}><span>{t(labelKeys[key])} · {t('languageName.vi')}</span><textarea rows="3" value={draft[`${key}_vi`] || ''} onChange={(event) => change(`${key}_vi`, event.target.value)} /></label>)}</div></section>
      <TranslationPanel status={draft.ko_translation_status} values={draft} fieldPairs={TRANSLATION_FIELDS} onApply={(updates) => setDraft((current) => ({ ...current, ...updates }))}><div className="admin-form-grid">{KEYS.map((key) => <label className="admin-field admin-field--wide" key={key}><span>{t(labelKeys[key])} · {t('languageName.ko')}</span><textarea rows="3" value={draft[`${key}_ko`] || ''} onChange={(event) => change(`${key}_ko`, event.target.value)} /></label>)}</div></TranslationPanel>
      <SaveNotice status={status} />
      <button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? t('common.saving') : t('orderSettings.save')}</button>
    </form>}
  </AdminPage>;
}
