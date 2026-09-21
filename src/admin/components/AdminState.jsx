import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export function AdminLoading({ label }) {
  const { t } = useAdminLanguage();
  return <div className="admin-state" role="status"><span className="admin-spinner" aria-hidden="true" />{label || t('common.loading')}</div>;
}

export function AdminError({ error, retry }) {
  const { t } = useAdminLanguage();
  return (
    <div className="admin-state admin-state--error" role="alert">
      <strong>{t('common.errorTitle')}</strong>
      <span>{typeof error === 'string' ? error : error?.message || t('common.errorFallback')}</span>
      {retry && <button className="admin-button admin-button--secondary" type="button" onClick={retry}>{t('common.retry')}</button>}
    </div>
  );
}

export function AdminEmpty({ title, text, action }) {
  return <div className="admin-state"><strong>{title}</strong>{text && <span>{text}</span>}{action}</div>;
}

export function SaveNotice({ status }) {
  if (!status?.message) return null;
  return <div className={`admin-save-notice admin-save-notice--${status.type || 'info'}`} role="status">{status.message}</div>;
}
