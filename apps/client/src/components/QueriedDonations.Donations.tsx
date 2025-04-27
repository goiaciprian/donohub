import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonations } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import { DonationCard } from './DonationCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

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
        <h2 className="text-4xl">No donations found</h2>
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
          <Pagination>
            <PaginationContent className="gap-15">
              {donationsData.hasPrev && (
                <PaginationItem
                  onClick={() => updatePage(donationsData.page - 1)}
                >
                  <PaginationPrevious className="text-2xl" />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink className="text-2xl" isActive>
                  {donationsData.page}
                </PaginationLink>
              </PaginationItem>
              {donationsData.hasNext && (
                <PaginationItem
                  onClick={() => updatePage(donationsData.page + 1)}
                >
                  <PaginationNext className="text-2xl" />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
};
