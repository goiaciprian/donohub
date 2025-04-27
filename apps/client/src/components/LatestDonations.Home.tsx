import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonations } from '@/support';
import { PaginatedDonationDto } from '@donohub/shared';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonationCard } from './DonationCard';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LatestDonationsHome = () => {
  const { t } = useTranslation();
  const getLatestDonationsFn = useAuthRequest(getDonations);
  const latestDonationsQuery = useSuspenseQuery<PaginatedDonationDto>({
    queryKey: ['home', 'latest-donations'],
    queryFn: () => getLatestDonationsFn({ params: { size: 5, page: 1 } }),
  });

  if (latestDonationsQuery.isError) {
    return <div>{t('home.latestDonation.error')}</div>;
  }

  if (!latestDonationsQuery.data) {
    return <div>{t('home.latestDonations.noData')}</div>;
  }

  const { items: donations } = latestDonationsQuery.data;

  return (
    <section className="w-full px-[15%]">
      <h3 className="text-center py-20 text-4xl font-bold italic">
        {t('home.latestDonation.title')}
      </h3>
      <div className="flex flex-wrap gap-10 justify-center">
        {donations.map((donation, index) => (
          <DonationCard key={index} donation={donation} />
        ))}
      </div>
      <div className="w-full text-center pt-30">
        <NavLink to="donations" viewTransition>
          <button className="text-4xl rounded-2xl border-gray-800 bg-gray-800 text-white border-1 px-8 py-4 cursor-pointer hover:text-black hover:bg-white">
            {t('home.latestDonation.seeAll')}
          </button>
        </NavLink>
      </div>
    </section>
  );
};

export default LatestDonationsHome;
