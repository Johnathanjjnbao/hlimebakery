import { useState } from 'react';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function TranslationPanel({ status = 'missing', children }) {
  const [message, setMessage] = useState('');
  const { t } = useAdminLanguage();
  const isStale = status === 'stale';

  return (
    <section className="admin-translation">
      <div className="admin-translation__header">
        <div>
          <strong>{t('translation.title')}</strong>
          <span className={`admin-status admin-status--${status}`}>{t(`translation.${status || 'unknown'}`)}</span>
        </div>
        <button
          className="admin-button admin-button--secondary"
          type="button"
          onClick={() => setMessage(t('translation.unavailable'))}
        >
          {t('translation.auto')}
        </button>
      </div>
      {isStale && <p className="admin-warning">{t('translation.staleWarning')}</p>}
      {message && <p className="admin-warning" role="status">{message}</p>}
      {children}
    </section>
  );
}
