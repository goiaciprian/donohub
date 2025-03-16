import React from 'react';
import { useTranslation } from 'react-i18next';

export const useProvideI18nContext = () => {
  const {
    i18n: { resolvedLanguage, changeLanguage },
    t,
  } = useTranslation();

  const setLang = React.useCallback(
    (lang?: string) => {
      changeLanguage(lang);
    },
    [changeLanguage],
  );

  React.useEffect(() => {
    setLang(resolvedLanguage);
    document.title = t('appTitle.normal');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedLanguage]);

  return {
    setLang,
  };
};
