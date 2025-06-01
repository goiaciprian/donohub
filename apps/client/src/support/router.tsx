import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Providers } from '../components/Providers';
import { ErrorPage } from '../components/ErrorPage';
import { Navigation } from '../components/Navigation';
import { HomePage } from '@/components/pages/HomePage';
import { Footer } from '@/components/Footer';
import { DonationsPage } from '@/components/pages/DonationsPage';
import { DonationPage } from '@/components/pages/DonationPage';
import { AddDonationPage } from '@/components/pages/AddDonationPage';
import { AdminProvider } from '@/components/AdminProvider';
import { EvaluateDonations } from '@/components/pages/EvaluateDonations';
import { CommentsProfile } from '@/components/profile/Comments.Profile';
import { Protect } from '@/components/Protect';
import { EvaluatedDonations } from '@/components/pages/EvaluatedDonation';
import { DonationsProfile } from '@/components/pages/ProfilePage';
import i18n from 'i18next';
import { LanguageWrapper } from '@/components/LanguageWrapper';
import { PushNotificationManager } from '@/app/Notifications';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/${i18n.language || 'en'}`} replace />,
  },
  {
    path: ':lang',
    element: <LanguageWrapper />,
    children: [
      {
        path: '',
        element: (
          <Providers>
            <PushNotificationManager />
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <Outlet />
              <Footer />
            </div>
          </Providers>
        ),
        children: [
          {
            path: '',
            element: <HomePage />,
          },
          {
            path: 'donor',
            element: (
              <Protect>
                <AddDonationPage />
              </Protect>
            ),
          },
          {
            path: 'donations',
            element: <Outlet />,
            errorElement: <ErrorPage status={404} />,
            children: [
              {
                path: '',
                element: <DonationsPage />,
              },
              {
                path: ':donationId',
                element: <DonationPage />,
              },
            ],
          },
          {
            path: 'admin',
            ErrorBoundary: () => <ErrorPage />,
            children: [
              {
                path: 'evaluate',
                children: [
                  {
                    path: 'donations',
                    element: (
                      <AdminProvider permission={'donation:evaluate'}>
                        <EvaluateDonations />
                      </AdminProvider>
                    ),
                  },
                  // {
                  //   path: 'comments',
                  //   element: (
                  //     <AdminProvider permission={'comments:evaluate'}>
                  //       <h1>Evaluate comments</h1>
                  //     </AdminProvider>
                  //   ),
                  // },
                ],
              },
              {
                path: 'evaluated',
                children: [
                  {
                    path: 'donations',
                    element: (
                      <AdminProvider permission={'donation:evaluate'}>
                        <EvaluatedDonations />
                      </AdminProvider>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'user',
            element: (
              <Protect>
                <Outlet />
              </Protect>
            ),
            children: [
              {
                path: 'donations',
                children: [
                  {
                    path: '',
                    element: <DonationsProfile />,
                  },
                ],
              },
              {
                path: 'comments',
                element: <CommentsProfile />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <ErrorPage status={404} />,
      },
    ],
  },
]);
