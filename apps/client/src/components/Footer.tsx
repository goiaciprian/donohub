import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlagRomania from './../assets/flag-romania.svg';
import FlagUk from './../assets/flag-united-kingdom.svg';
import { Button } from './ui/button';

export const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const { i18n } = useTranslation();

  const handleLanguageChange = (newLang: string) => {
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.substring(3) || '';
    const queryString = location.search;

    navigate(`/${newLang}${pathWithoutLang}${queryString}`, { replace: true });

    i18n.changeLanguage(newLang);
  };

  return (
    <footer className="w-full bg-gray-800 text-white text-center  *:nth-[2]:mb-6 *:not-last:mb-3 *:last:align-bottom mt-auto select-none py-5">
      <h1
        className="text-3xl font-bold select-none cursor-pointer"
        onClick={() => navigate(`/${lang}`, { viewTransition: true })}
      >
        DonoHUB
      </h1>
      <div>
        <Button
          variant="link"
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLanguageChange('en');
          }}
        >
          <img src={FlagUk} alt="language-english" className="size-5" />
        </Button>
        <Button
          variant="link"
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLanguageChange('ro');
          }}
        >
          <img src={FlagRomania} alt="language-romanian" className="size-5" />
        </Button>
      </div>
      <h3>{t('footer.terms')}</h3>
      <h3>&copy; Copyright DonoHUB. All rights reserved</h3>
    </footer>
  );
};
