import React from 'react';
import { useProvideI18nContext } from '@/hooks/useProvideI18nContext';
import { useParams } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePrefetchQuery } from '@tanstack/react-query';
import { getCategories, getLocationsDropdown } from '@/support';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { Toaster } from './ui/sonner';

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

  const getCategoriesFn = useAuthRequest(getCategories);
  const getLocationsDropdownFn = useAuthRequest(getLocationsDropdown);

  usePrefetchQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn({}),
  });

  usePrefetchQuery({
    queryKey: ['locationsDropdown'],
    queryFn: () => getLocationsDropdownFn({}),
  });

  return (
    <>
      {children}
      <ReactQueryDevtools position="right" />
      <Toaster />
    </>
  );
};
