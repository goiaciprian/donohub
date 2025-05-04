import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-gray-800 text-white text-center *:first:mb-10 *:not-last:mb-3 *:last:align-bottom mt-auto select-none py-5">
      <h1
        className="text-3xl font-bold select-none cursor-pointer"
        onClick={() => navigate(`/${lang}`, { viewTransition: true })}
      >
        DonoHUB
      </h1>
      <h3>{t('footer.terms')}</h3>
      <h3>&copy; Copyright DonoHUB. All rights reserved</h3>
    </footer>
  );
};
