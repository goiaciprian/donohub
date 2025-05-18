import { useAuthRequest } from '@/hooks/useAuthRequest';
import { Page } from '../pages/Page';
import { getSelfDonationRequests } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { DATE_FORMAT } from '@/utils';
import moment from 'moment';
import { Separator } from '../ui/separator';
import { DonationUserInfo } from '../DonationUserInfo.Donation';
import { useNavigate, useParams } from 'react-router-dom';
import { displayEnum } from '@/lib/utils';

export const ListSelfRequests = () => {
  const { t } = useTranslation();
  const [{ page, size }, setPagination] = useState({ page: 1, size: 20 });
  const { lang } = useParams();
  const navigate = useNavigate();

  const getSelfRequestsFn = useAuthRequest(getSelfDonationRequests);
  const getSelfRequestsQuery = useSuspenseQuery({
    queryKey: ['sefDonationRequests'],
    queryFn: () => getSelfRequestsFn({ params: { page, size } }),
  });

  const selfDonations = getSelfRequestsQuery.data;

  if (selfDonations.totalItems === 0) {
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
        {selfDonations.items.map((r) => {
          return (
            <AccordionItem
              value={r.id}
              key={r.id}
              className="border-2 px-8 rounded-xl border-b-4 last:border-b-4"
            >
              <AccordionTrigger className="cursor-pointer">
                <div>
                  <h3
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${lang}/donations/${r.donationId}`);
                    }}
                    className="md:text-xl underline"
                  >
                    {r.donationTitle}
                  </h3>
                  <h4 className="text-muted-foreground">
                    {moment(r.createdAt).format(DATE_FORMAT)}
                  </h4>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <h3>
                    <span>{displayEnum(r.status)}</span>
                  </h3>
                  <h3 className="py-2">{r.comment ?? 'No comment left'}</h3>
                </div>
                <Separator className="my-5" />
                <Suspense>
                  <DonationUserInfo
                    clerkUserId={r.donationUserId}
                    avatarSize="size-12"
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};