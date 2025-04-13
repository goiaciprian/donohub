import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Providers } from '../components/Providers';
import { ErrorPage } from '../components/ErrorPage';
import { Navigation } from '../components/Navigation';
import { InitialRedirect } from '../components/InitialRedirect';
import { Protect } from '@clerk/clerk-react';
import { HomePage } from '@/components/pages/HomePage';
import { Footer } from '@/components/Footer';

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
            <Navigation />
            <Outlet />
            <Footer />
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
            element: (
              <Protect fallback={<ErrorPage status={401} />}>
                <h1 className="text-5xl">Donations</h1>
              </Protect>
            ),
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
