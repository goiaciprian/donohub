import moment from 'moment';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

export function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (lang && ['en', 'ro'].includes(lang) && lang !== i18n.language) {
      i18n.changeLanguage(lang);
      moment.locale(lang);
    } else if (!['en', 'ro'].includes(lang || '')) {
      moment.locale('en');

      const pathWithoutLang = window.location.pathname.substring(3);
      const queryString = location.search;

      navigate(`/en${pathWithoutLang}${queryString}`, {
        replace: true,
      });
    }
  }, [lang, i18n, navigate, location]);

  return <Outlet />;
}
