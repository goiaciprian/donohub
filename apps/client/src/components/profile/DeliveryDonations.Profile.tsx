import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDeliveryDonationsRequest } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import { useNavigate, useParams } from 'react-router-dom';
import { DonationUserInfo } from '../DonationUserInfo.Donation';
import { useUser } from '@clerk/clerk-react';
import { Pagination } from '../Pagination';
import { Timeline, TimelineItem } from '../Timeline';
import { Car, Home } from 'lucide-react';
import { ReviewDialog } from '../dialogs/ReviewDialog';
import { Button } from '../ui/button';

export const UnderDelivryProfileDonations = () => {
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const { lang } = useParams();
  const { user } = useUser();
  const userId = user?.id ?? '';

  const [selectedId, setSelectedId] = useState('');

  const navigate = useNavigate();
  const { t } = useTranslation();

  const getDeliveryDonationFn = useAuthRequest(getDeliveryDonationsRequest);
  const deliveryDonationsQuery = useSuspenseQuery({
    queryKey: ['deliveryDonations'],
    queryFn: () =>
      getDeliveryDonationFn({
        params: { page: pagination.page, size: pagination.size },
      }),
  });

  const deliveryDonations = deliveryDonationsQuery.data;

  if (deliveryDonations.totalItems === 0) {
    return (
      <div className="w-full">
        <h2 className="text-center pt-20 font-bold md:text-xl">
          {t('internal.notFoundAnything')}
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Accordion type="multiple" className="flex flex-col gap-3 pb-10">
        {deliveryDonations.items.map((dr) => {
          const isRequester = dr.requestUserId === userId;
          const isResolved = dr.status === 'RESOLVED';

          return (
            <AccordionItem
              value={dr.id}
              key={dr.id}
              className="border-2 px-8 rounded-xl border-b-4 last:border-b-4"
            >
              <AccordionTrigger className="cursor-pointer">
                <div>
                  <h3
                    className="font-semibold md:text-xl underline"
                    onClick={() =>
                      navigate(`/${lang}/donations/${dr.id}`, {
                        viewTransition: true,
                      })
                    }
                  >
                    {dr.title}
                  </h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row items-center">
                  <div>
                    <DonationUserInfo
                      clerkUserId={
                        isRequester ? dr.clerkUserId : dr.requestUserId
                      }
                      avatarSize={'size-12'}
                    />
                    {!isRequester && (
                      <p>{dr.requestComment || 'Comment not available'}</p>
                    )}
                  </div>
                  <div className="ml-auto">
                    {isRequester && !isResolved && (
                      <Button
                        className="cursor-pointer"
                        onClick={() => setSelectedId(dr.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
                <div className="pl-4 pt-3">
                  <Timeline>
                    <TimelineItem
                      className="pb-15"
                      title="Delivery"
                      icon={<Car />}
                      isStepResolved
                    />
                    <TimelineItem
                      title="Delivered"
                      icon={<Home />}
                      isStepResolved={isResolved}
                    />
                  </Timeline>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Pagination
        hasNext={deliveryDonations.hasNext}
        hasPrev={deliveryDonations.hasPrev}
        page={deliveryDonations.page}
        totalPages={deliveryDonations.totalPages}
        update={(page) => setPagination((prev) => ({ ...prev, page }))}
        className={'mb-5'}
      />
      <ReviewDialog donationId={selectedId} onClose={() => setSelectedId('')} />
    </div>
  );
};
