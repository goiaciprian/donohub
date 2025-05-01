import { useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { DonationDto } from '@donohub/shared';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationById } from '@/support';
import { displayLocation, getCategoryIcon } from '@/lib/utils';
import {
  CalendarPlus,
  MapPin,
  CalendarClock,
  Hash,
  PhoneCall,
  ArrowLeft,
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Separator } from './ui/separator';
import { useTranslation } from 'react-i18next';
import { DonationUserInfo } from './DonationUserInfo.Donation';
import { DonationComments } from './DonationComments.Donation';
import { DATE_FORMAT } from '@/utils';
import { CopyButton } from './buttons/CopyButton';
import { Button } from './ui/button';
import { NavLink } from 'react-router-dom';

interface DetailedDonationProps {
  donationId: string;
}

export const DetailedDonation = ({ donationId }: DetailedDonationProps) => {
  const { t } = useTranslation();

  const donationDateFn = useAuthRequest(getDonationById);
  const donationData = useSuspenseQuery<DonationDto>({
    queryKey: ['donation', donationId],
    queryFn: () =>
      donationDateFn({ pathParams: [{ key: ':id', value: donationId }] }),
  });

  const donation = donationData.data;
  const createdAt = moment(donation.createdAt);
  const updatedAt = moment(donation.updatedAt);

  return (
    <div>
      <div className="flex items-center gap-4">
        <NavLink to='..' viewTransition  >
          <Button size="icon" className="cursor-pointer" >
            <ArrowLeft />
          </Button>
        </NavLink>
        <CopyButton url={window.location.href} />
        <h1 className="text-4xl font-bold align-middle">{donation.title}</h1>
      </div>
      <div className="pt-5 flex">
        <div className="flex-1 pr-20">
          <div>
            <h4 className="text-2xl flex items-center gap-5">
              {getCategoryIcon(donation.category)}{' '}
              {t(`categories.${donation.category}`)}
            </h4>
            <h4 className="text-2xl flex items-center gap-5">
              <MapPin /> {displayLocation(donation.location)}
            </h4>
            <h4 className="text-2xl flex items-center gap-5">
              <Hash /> {donation.quantity ?? 0}
            </h4>
            <h4 className="text-2xl flex items-center gap-5">
              <PhoneCall />
              {donation.phone || t('internal.validations.noPhone')}
            </h4>
          </div>
          <div className="mt-5">
            <h4 className="text-2xl flex items-center gap-5">
              <CalendarClock /> {updatedAt.fromNow()} ({' '}
              {createdAt.format(DATE_FORMAT)} )
            </h4>

            <h4 className="text-2xl flex items-center gap-5">
              <CalendarPlus /> {createdAt.fromNow()} ({' '}
              {createdAt.format(DATE_FORMAT)} )
            </h4>
          </div>
          <div className="py-8">
            <Separator className="w-full" />
          </div>
          <div>
            <h2 className="font-semibold text-2xl">{donation.description}</h2>
          </div>
          <div className="pt-28 py-8">
            <h2 className="font-semibold text-4xl">{t('donation.user')}</h2>
            <div className="py-3">
              <Separator className="w-full" />
            </div>
            <DonationUserInfo clerkUserId={donationData.data.clerkUserId} />
          </div>
          <div></div>
        </div>
        <div>
          <Carousel opts={{ loop: true }} className="max-w-[500px]">
            <CarouselContent>
              {donation.attachements.length === 0 && (
                <CarouselItem>
                  <img
                    className="rounded-2xl min-w-[500px] max-w-[500px] min-h-[500px] max-h-[500px]"
                    src="https://placehold.co/500x500?text=No+attachements"
                    alt="no_image"
                  />
                </CarouselItem>
              )}
              {donation.attachements.map((url) => (
                <CarouselItem key={url}>
                  <img
                    className="rounded-2xl min-w-[500px] max-w-[500px] min-h-[500px] max-h-[500px]"
                    src={url}
                    alt={donation.title}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
      <div className="pt-10">
        <h1 className="text-4xl font-semibold">{t('donation.comments')}</h1>
        <div className="py-3">
          <Separator className="w-full" />
        </div>
        <DonationComments donationId={donationData.data.id} />
      </div>
    </div>
  );
};
