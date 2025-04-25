import React from 'react';
import { useProvideI18nContext } from '@/hooks/useProvideI18nContext';
import { useParams } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Providers = ({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  const { setLang } = useProvideI18nContext();
  const { lang } = useParams();

  React.useEffect(() => {
    setLang(lang);
  }, [lang, setLang]);

  return (
    <>
      {children}
      <ReactQueryDevtools position="right" />
    </>
  );
};
