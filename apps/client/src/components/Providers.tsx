import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePrefetchQuery } from '@tanstack/react-query';
import { getCategories, getLocationsDropdown } from '@/support';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { Toaster } from './ui/sonner';
import { PostHogPageView } from '@/app/PostHogPageView';
import { AppSidebar } from './AppSidebar';
import { AuthContextProvider } from '@/context/AuthContext';
import { CookiesProvider } from 'react-cookie';

export const Providers = ({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
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
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <AuthContextProvider>
        <AppSidebar />
        <main className="w-full">{children}</main>
        <ReactQueryDevtools position="right" />
        <Toaster />
        <PostHogPageView />
      </AuthContextProvider>
    </CookiesProvider>
  );
};
