import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonations } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonationCard } from './DonationCard';
import { t } from 'i18next';
import { Pagination } from './Pagination';

interface QueriedDonationsProps {
  location: string | undefined;
  category: string | undefined;
  q: string | undefined;
  size: string | undefined;
  page: string | undefined;
  updatePage: (page: number) => void;
}

export const QueriedDonations = ({
  location,
  category,
  q,
  size,
  page,
  updatePage,
}: QueriedDonationsProps) => {
  const getDonationsFn = useAuthRequest(getDonations);
  const donationsQuery = useSuspenseQuery({
    queryKey: ['queriedDonations', location, category, q, size, page],
    queryFn: () =>
      getDonationsFn({ params: { location, category, q, page, size } }),
  });

  const donationsData = donationsQuery.data;

  if (donationsData.totalItems === 0) {
    return (
      <section>
        <h2 className="text-4xl">{t('internal.notFoundAnything')}</h2>
      </section>
    );
  }

  return (
    <section>
      <div className="flex gap-20 flex-wrap pb-20 justify-center pt-15">
        {donationsData.items.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>
      <div>
        <div className="pb-10">
          <Pagination
            hasNext={donationsData.hasNext}
            hasPrev={donationsData.hasPrev}
            page={donationsData.page}
            totalPages={donationsData.totalPages}
            update={updatePage}
          />
        </div>
      </div>
    </section>
  );
};
