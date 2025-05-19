import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';

export const InitialRedirect = () => {
  const { lang } = useParams();

  const {
    i18n: { resolvedLanguage },
  } = useTranslation();
  return <Navigate to={`/${lang || resolvedLanguage}`} replace />;
};
