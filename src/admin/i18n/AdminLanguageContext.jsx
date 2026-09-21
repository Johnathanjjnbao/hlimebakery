import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translateAdmin } from './adminTranslations';

const STORAGE_KEY = 'hlime-admin-locale';
const AdminLanguageContext = createContext(null);

function readStoredLocale() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'ko' ? 'ko' : 'vi';
  } catch {
    return 'vi';
  }
}

export function AdminLanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale);

  const setLocale = useCallback((nextLocale) => {
    const normalized = nextLocale === 'ko' ? 'ko' : 'vi';
    setLocaleState(normalized);
    try {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // Admin locale still changes for this session when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previousLanguage; };
  }, [locale]);

  const t = useCallback((key, variables) => translateAdmin(locale, key, variables), [locale]);
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>;
}

export function useAdminLanguage() {
  const value = useContext(AdminLanguageContext);
  if (!value) throw new Error('useAdminLanguage must be used inside AdminLanguageProvider');
  return value;
}
