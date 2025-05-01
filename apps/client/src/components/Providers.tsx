import React from 'react';
import { useProvideI18nContext } from '@/hooks/useProvideI18nContext';
import { Navigate, useParams } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePrefetchQuery } from '@tanstack/react-query';
import { getCategories, getLocationsDropdown } from '@/support';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { Toaster } from './ui/sonner';
import moment from 'moment';
import { PostHogPageView } from '@/app/PostHogPageView';
import { useUser } from '@clerk/clerk-react';
import { AppSidebar } from './AppSidebar';

export const Providers = ({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  const { setLang, languages, resolvedLanguage } = useProvideI18nContext();
  const { lang } = useParams();
  const userStatus = useUser();

  const userId = userStatus.user?.id;
  const isUserLoaded = userStatus.isLoaded;

  React.useEffect(() => {
    setLang(lang);
    moment.locale(lang);
  }, [lang, setLang]);

  const requestNotificationPerission = async () => {
    let permission = 'denied';
    if (Notification.permission === 'default') {
      permission = await Notification.requestPermission();
    }

    return permission === 'granted';
  };

  React.useEffect(() => {
    const setup = async () => {
      if (isUserLoaded && userId) {
        if (!requestNotificationPerission()) {
          return;
        }
        navigator.serviceWorker.ready.then((r) =>
          r.active?.postMessage({
            type: 'SETUP',
            payload: { url: import.meta.env.VITE_API_URL, userId },
          }),
        );
      } else if (isUserLoaded && !userId) {
        navigator.serviceWorker.ready.then((r) =>
          r.active?.postMessage({
            type: 'TERMINATE',
            payload: { url: import.meta.env.VITE_API_URL, userId },
          }),
        );
      }
    };

    setup();
  }, [userId, isUserLoaded]);

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

  if (lang && !languages.includes(lang)) {
    return <Navigate to={`/${resolvedLanguage}`} replace />;
  }

  return (
    <>
      <AppSidebar />
      <main className="w-full">{children}</main>
      <ReactQueryDevtools position="right" />
      <Toaster />
      <PostHogPageView />
    </>
  );
};
