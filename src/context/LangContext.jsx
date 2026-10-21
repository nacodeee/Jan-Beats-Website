import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LangContext = createContext(null);

const STORAGE_KEY = 'jan-lang';

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'es' ? saved : 'es';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = translations[lang];

  const value = { lang, setLang, toggle, t };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
