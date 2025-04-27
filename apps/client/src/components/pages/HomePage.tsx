import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonations } from '@/support';
import { usePrefetchQuery } from '@tanstack/react-query';
import { Page } from './Page';
import { SignInButton } from '../buttons/SignInButton';
import { SignUpButton } from '../buttons/SignUpButton';
import LatestDonationsHome from '../LatestDonations.Home';
import { useTranslation } from 'react-i18next';
import { SignedOut } from '@clerk/clerk-react';

export const HomePage = () => {
  const { t } = useTranslation();

  const getLatestDonationsFn = useAuthRequest(getDonations);
  usePrefetchQuery({
    queryKey: ['home', 'latest-donations'],
    queryFn: () => getLatestDonationsFn({ params: { page: 1, size: 5 } }),
  });

  return (
    <Page
      staticFirst={
        <section className="relative w-full h-[90vh] bg-[url(/assets/home1.jpg)] bg-cover bg-top-left bg-blend-overlay bg-gray-700">
          <div className="absolute text-white h-[90vh] w-full pt-5">
            <h1 className="text-4xl text-center font-bold">
              {t('home.banner1')}
            </h1>
            <h2 className="text-4xl max-w-3xl text-center pt-20 ml-20 font-bold">
              {t('home.banner2')}
            </h2>
            <div className="absolute bottom-80 left-[80%]">
              <h2 className="text-4xl font-bold pb-3">{t('home.banner3')}</h2>
              <SignedOut>
                <div className="flex flex-row w-full justify-between">
                  <SignInButton className="text-4xl font-bold cursor-pointer text-white" />
                  <p className="text-4xl font-bold">{t('home.or')}</p>
                  <SignUpButton className="text-4xl font-bold cursor-pointer text-white" />
                </div>
              </SignedOut>
            </div>
          </div>
        </section>
      }
      dynamicComponent={<LatestDonationsHome />}
      staticSecond={
        <>
          <section className="bg-gray-800 text-white mt-30 pb-20">
            <div className="py-20">
              <h3 className="text-4xl font-bold text-center pb-5">
                {t('home.4steps.title')}
              </h3>
              <h5 className="font-bold italic text-3xl text-center">
                {t('home.4steps.subtitle')}
              </h5>
            </div>
            <div className="text-3xl text-white text-center">
              <ol className="list-inside list-decimal italic *:not-last:mb-10">
                <li>{t('home.4steps.step1')}</li>
                <li>{t('home.4steps.step2')}</li>
                <li>{t('home.4steps.step3')}</li>
                <li>{t('home.4steps.step4')}</li>
              </ol>
            </div>
          </section>
          <section className="mt-20 text-center w-fit m-auto pb-20">
            <h3 className="text-4xl font-bold text-center py-10">
              {t('home.cta.title')}
            </h3>
            <SignedOut>
              <div className="flex flex-row w-full justify-evenly">
                <SignInButton className="text-4xl font-bold cursor-pointer" />
                <p className="text-4xl font-bold">{t('home.or')}</p>
                <SignUpButton className="text-4xl font-bold cursor-pointer" />
              </div>
            </SignedOut>
          </section>
        </>
      }
    />
  );
};
