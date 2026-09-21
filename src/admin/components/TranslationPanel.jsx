import { useState } from 'react';
import { translateText } from '../../lib/translation';
import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function TranslationPanel({ status = 'missing', values, fieldPairs, onApply, children }) {
  const [message, setMessage] = useState(null);
  const [translating, setTranslating] = useState(false);
  const { t } = useAdminLanguage();
  const isStale = status === 'stale';

  const translate = async (sourceLanguage, targetLanguage) => {
    const pairs = fieldPairs
      .map(([viField, koField]) => ({
        sourceField: sourceLanguage === 'vi' ? viField : koField,
        targetField: targetLanguage === 'vi' ? viField : koField,
      }))
      .filter(({ sourceField }) => String(values[sourceField] ?? '').trim());

    if (!pairs.length) {
      setMessage({ type: 'error', text: t('translation.emptySource', { language: sourceLanguage.toUpperCase() }) });
      return;
    }

    const hasExistingTarget = pairs.some(({ targetField }) => String(values[targetField] ?? '').trim());
    if (hasExistingTarget && !window.confirm(t('translation.confirmOverwrite', {
      source: sourceLanguage.toUpperCase(),
      target: targetLanguage.toUpperCase(),
    }))) return;

    setTranslating(true);
    setMessage({ type: 'info', text: t('translation.translating') });
    try {
      const updates = {};
      for (const { sourceField, targetField } of pairs) {
        updates[targetField] = await translateText({
          text: values[sourceField],
          sourceLanguage,
          targetLanguage,
        });
      }
      if (targetLanguage === 'ko') updates.ko_translation_status = 'machine';
      onApply(updates);
      setMessage({ type: 'success', text: t('translation.success') });
    } catch (error) {
      setMessage({
        type: 'error',
        text: t(error?.code === 'rate_limit' ? 'translation.rateLimit' : 'translation.failed'),
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <section className="admin-translation">
      <div className="admin-translation__header">
        <div>
          <strong>{t('translation.title')}</strong>
          <span className={`admin-status admin-status--${status}`}>{t(`translation.${status || 'unknown'}`)}</span>
        </div>
        <div className="admin-inline-actions">
          <button className="admin-button admin-button--secondary" type="button" disabled={translating} onClick={() => translate('vi', 'ko')}>
            {t('translation.autoViKo')}
          </button>
          <button className="admin-button admin-button--secondary" type="button" disabled={translating} onClick={() => translate('ko', 'vi')}>
            {t('translation.autoKoVi')}
          </button>
        </div>
      </div>
      {isStale && <p className="admin-warning">{t('translation.staleWarning')}</p>}
      {message && <p className={message.type === 'error' ? 'admin-warning' : undefined} role="status">{message.text}</p>}
      {children}
    </section>
  );
}
