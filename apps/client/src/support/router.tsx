import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Providers } from '../components/Providers';
import { ErrorPage } from '../components/ErrorPage';
import { Navigation } from '../components/Navigation';
import { InitialRedirect } from '../components/InitialRedirect';
import { Protect } from '@clerk/clerk-react';
import { HomePage } from '@/components/pages/HomePage';
import { Footer } from '@/components/Footer';
import { DonationsPage } from '@/components/pages/DonationsPage';
import { DonationPage } from '@/components/pages/DonationPage';

export const router = createBrowserRouter([
  {
    path: '',
    element: <InitialRedirect />,
  },
  {
    path: ':lang',
    children: [
      {
        path: '',
        element: (
          <Providers>
            <div className="flex flex-col min-h-screen ">
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
              <Protect fallback={<ErrorPage status={401} />}>
                <h1 className="text-5xl">Donor</h1>
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
        ],
      },
      {
        path: '*',
        element: <ErrorPage status={404} />,
      },
    ],
  },
]);
