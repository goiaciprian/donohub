import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonations } from '@/support';
import { PaginatedDonationDto } from '@donohub/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonationCard } from './DonationCard';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LatestDonationsHome = () => {
  const { t } = useTranslation();
  const getLatestDonationsFn = useAuthRequest(getDonations);
  const latestDonationsQuery = useSuspenseQuery<PaginatedDonationDto>({
    queryKey: ['home', 'latest-donations'],
    queryFn: () => getLatestDonationsFn({ params: { size: 6, page: 1 } }),
  });

  if (latestDonationsQuery.isError) {
    return (
      <div className="flex w-full justify-center items-center h-[150px]">
        <h1 className="font-bold md:text-lg">
          {t('home.latestDonation.error')}
        </h1>
      </div>
    );
  }

  if (!latestDonationsQuery.data) {
    return (
      <div className="flex w-full justify-center items-center h-[150px]">
        <h1 className="font-bold md:text-lg">
          {t('internal.notFoundAnything')}
        </h1>
      </div>
    );
  }

  const { items: donations } = latestDonationsQuery.data;

  return (
    <section className="w-full px-[5%]">
      <h3 className="text-center py-20 text-2xl font-bold italic">
        {t('home.latestDonation.title')}
      </h3>
      <div className="flex flex-wrap gap-10 items-stretch justify-center">
        {donations.map((donation, index) => (
          <DonationCard
            key={index}
            donation={{ ...donation, requestedUser: [] }}
          />
        ))}
      </div>
      <div className="w-full text-center pt-30">
        <NavLink to="donations" viewTransition>
          <Button className="cursor-pointer text-xl px-6 py-5">
            {t('home.latestDonation.seeAll')}
          </Button>
        </NavLink>
      </div>
    </section>
  );
};

export default LatestDonationsHome;
