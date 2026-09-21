import { useApp } from '../context/AppContext';

export default function LanguageSwitcher() {
  const { locale, switchLocale } = useApp();
  return (
    <button
      className="lang-button"
      type="button"
      onClick={switchLocale}
      aria-label={locale === 'vi' ? '한국어로 보기' : 'Xem tiếng Việt'}
    >
      {locale === 'vi' ? '한국어' : 'VI'}
    </button>
  );
}

