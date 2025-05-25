import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { PostHogProvider } from 'posthog-js/react';
import { router } from './support';
import './support/i18n.config';
import 'moment/dist/locale/ro';
import { SidebarProvider } from './components/ui/sidebar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
    },
  },
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: '/ph', // import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        debug: false, // import.meta.env.MODE === 'development',
        capture_pageview: false,
      }}
    >
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        afterSignOutUrl={`/${localStorage.getItem('i18nextLng') || 'en'}`}
      >
        <QueryClientProvider client={queryClient}>
          <SidebarProvider defaultOpen={false}>
            <RouterProvider router={router} />
          </SidebarProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </PostHogProvider>
  </StrictMode>,
);
