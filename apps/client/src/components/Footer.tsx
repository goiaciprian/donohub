import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-gray-800 text-white pt-20 h-60 text-center *:first:mb-10 *:not-last:mb-3 *:last:align-bottom mt-auto select-none">
      <h1 className="text-3xl font-bold select-none">DonoHUB</h1>
      <h3>{t('footer.terms')}</h3>
      <h3>&copy; Copyright DonoHUB. All rights reserved</h3>
    </footer>
  );
};
