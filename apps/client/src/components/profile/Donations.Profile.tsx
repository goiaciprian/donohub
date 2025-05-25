import { useAuthRequest } from '@/hooks/useAuthRequest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { selfDonations } from '@/support';
import { useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { cn, getCategoryIcon } from '@/lib/utils';
import { Hash, MapPin, PhoneCall } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EditDonationDialog } from '../dialogs/EditDonationDialog';
import { useState } from 'react';
import { PaginatedEvaluatedDonationDto } from '@donohub/shared';
import { Pagination } from '../Pagination';

export const UserDonations = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['translation', 'categories']);
  const [searchParams, setSerachParams] = useSearchParams();

  const [openedTabs, setOpenedTabs] = useState<string[]>(
    searchParams.get('i')?.split(',') || [],
  );

  const [pagination, setPagination] = useState({ page: 1, size: 10 });

  const [donation, setDonation] = useState<
    PaginatedEvaluatedDonationDto['items'][number] | null
  >(null);

  const selfDonationsFn = useAuthRequest(selfDonations);
  const selfDonationsQuery = useSuspenseQuery({
    queryKey: ['selfDonations', pagination],
    queryFn: () =>
      selfDonationsFn({
        params: { page: pagination.page, size: pagination.size },
      }),
  });

  const donationsData = selfDonationsQuery.data;

  if (donationsData.totalItems === 0) {
    return (
      <div className="h-full">
        <h1 className="font-bold md:text-xl py-20 text-center">
          {t('internal.notFoundAnything')}
        </h1>
      </div>
    );
  }

  return (
    <>
      <Accordion
        type="multiple"
        className="flex flex-col gap-3 pb-10"
        onValueChange={(e) =>
          setSerachParams((prev) => {
            if (e.length === 0) {
              prev.delete('i');
            } else {
              prev.set('i', e.join(','));
            }
            setOpenedTabs(e);
            return prev;
          })
        }
        value={openedTabs}
      >
        {donationsData.items.map((d) => {
          const titleColor =
            d.status === 'NEEDS_WORK'
              ? 'text-yellow-500'
              : d.status === 'RESOLVED'
                ? 'text-green-500'
                : undefined;
          return (
            <AccordionItem
              key={d.id}
              value={d.id}
              className="border-2 px-8 rounded-lg border-b-4 last:border-b-4"
            >
              <div className="w-full flex items-baseline">
                <div className="flex-3/4">
                  <AccordionTrigger className="cursor-pointer pr-4 md:pr-0">
                    <div>
                      <h3 className={cn(titleColor, 'font-bold')}>
                        {d.status}
                      </h3>
                      <h3 className={'font-semibold text-muted-foreground'}>
                        {d.title} ({moment(d.createdAt).format(DATE_FORMAT)})
                      </h3>
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="flex-1 flex gap-2 justify-end">
                  {d.status === 'NEEDS_WORK' && (
                    <Button
                      className="cursor-pointer bg-yellow-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDonation(d);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/${lang}/donations/${d.id}`);
                    }}
                  >
                    {t('donationCard.details')}
                  </Button>
                </div>
              </div>
              <AccordionContent>
                <div className="flex flex-col gap-3 px-4">
                  <p className="font-semibold max-w-[80%]">{d.description}</p>
                  <div className="flex flex-row">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(d.category)}
                        <p>{d.category}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={18} />
                        <p>{`${d.location.county}, ${d.location.city}, ${d.location.street || '-'}, ${d.location.number || '-'}, ${d.location.postalCode || '-'}`}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash size={18} />
                        <p>{d.quantity || '-'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <PhoneCall size={18} />
                        <p>{d.phone || '-'}</p>
                      </div>
                    </div>
                    <div>
                      <Carousel
                        opts={{ loop: true }}
                        className="w-full max-w-[200px]"
                      >
                        <CarouselContent>
                          {d.attachements.length === 0 && (
                            <CarouselItem>
                              <img
                                className="rounded-2xl min-w-[200] max-w-[200] min-h-[200px] max-h-[200px]"
                                src="https://placehold.co/200x200?text=No+attachements"
                                alt="no_image"
                              />
                            </CarouselItem>
                          )}
                          {d.attachements.map((url) => (
                            <CarouselItem key={url}>
                              <img
                                className="rounded-2xl min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
                                src={url}
                                alt={d.title}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  </div>
                  <div>
                    <div className="pt-3 flex flex-col gap-3">
                      {d.evaluations.map((e) => {
                        return (
                          <div key={e.id}>
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage src={e.userImage} />
                                <AvatarFallback>{e.userName}</AvatarFallback>
                              </Avatar>
                              <p>
                                {e.userName} (
                                {moment(e.createdAt).format(DATE_FORMAT)}) -{' '}
                                <span
                                  className={
                                    e.approved
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                  }
                                >
                                  {e.approved ? 'APPROVED' : 'DENIED'}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p>{e.comment}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <Pagination
        hasNext={donationsData.hasNext}
        hasPrev={donationsData.hasPrev}
        page={donationsData.page}
        totalPages={donationsData.totalPages}
        update={(page) => setPagination((prev) => ({ ...prev, page }))}
        className="mb-5"
      />
      <EditDonationDialog
        donation={donation}
        onClose={() => setDonation(null)}
      />
    </>
  );
};

