import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

export const InitialRedirect = () => {
  const {
    i18n: { resolvedLanguage },
  } = useTranslation();
  return <Navigate to={`/${resolvedLanguage}`} replace />;
};
