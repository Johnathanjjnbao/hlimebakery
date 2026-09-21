import { useAdminLanguage } from '../i18n/AdminLanguageContext';

export default function AdminLanguageSwitcher() {
  const { locale, setLocale, t } = useAdminLanguage();

  return (
    <div className="admin-language-switcher" role="group" aria-label={t('language.label')}>
      <button type="button" className={locale === 'vi' ? 'is-active' : ''} onClick={() => setLocale('vi')} aria-pressed={locale === 'vi'}>{t('language.vi')}</button>
      <span aria-hidden="true">|</span>
      <button type="button" className={locale === 'ko' ? 'is-active' : ''} onClick={() => setLocale('ko')} aria-pressed={locale === 'ko'}>{t('language.ko')}</button>
    </div>
  );
}
