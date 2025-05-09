import { useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { DonationDto } from '@donohub/shared';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationById } from '@/support';
import {
  displayLocation,
  getCategoryIcon,
  LocaleCategoriesHeleper,
} from '@/lib/utils';
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
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetailedDonationProps {
  donationId: string;
}

export const DetailedDonation = ({ donationId }: DetailedDonationProps) => {
  const { t } = useTranslation(['translation', 'categories']);
  const navigate = useNavigate();
  const onMobile = useIsMobile();

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
        <Button
          size="icon"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
        </Button>
        <CopyButton url={window.location.href} />
        <h1 className="text-2xl font-bold align-middle">{donation.title}</h1>
      </div>
      <div className="pt-5 flex flex-col-reverse md:flex-row gap-6 justify-center w-full">
        <div className="flex-1 pr-20">
          <div>
            <h4 className="text-md flex items-center gap-3">
              {getCategoryIcon(donation.category)}{' '}
              {t(`categories:${donation.category}` as LocaleCategoriesHeleper)}
            </h4>
            <h4 className="text-md flex items-center gap-3">
              <MapPin size={18} /> {displayLocation(donation.location)}
            </h4>
            <h4 className="text-md flex items-center gap-3">
              <Hash size={18} /> {donation.quantity ?? 0}
            </h4>
            <h4 className="text-md flex items-center gap-3">
              <PhoneCall size={18} />
              {donation.phone || t('internal.validations.noPhone')}
            </h4>
          </div>
          <div className="mt-5">
            <h4 className="text-md flex items-center gap-3">
              <CalendarClock size={18} /> {updatedAt.fromNow()} ({' '}
              {createdAt.format(DATE_FORMAT)} )
            </h4>

            <h4 className="text-md flex items-center gap-3">
              <CalendarPlus size={18} /> {createdAt.fromNow()} ({' '}
              {createdAt.format(DATE_FORMAT)} )
            </h4>
          </div>
          <div className="pt-8 pb-3">
            <Separator className="w-full" />
          </div>
          <div>
            <h2 className="font-semibold text-md">{donation.description}</h2>
          </div>
          <div className="pt-5 py-8">
            <h2 className="font-bold text-xl">{t('donation.user')}</h2>
            <div className="py-3">
              <Separator className="w-full" />
            </div>
            <DonationUserInfo clerkUserId={donationData.data.clerkUserId} />
          </div>
          <div></div>
        </div>
        <div className="self-center">
          <Carousel opts={{ loop: true }} className="max-w-[300px]">
            <CarouselContent>
              {donation.attachements.length === 0 && (
                <CarouselItem>
                  <img
                    className="rounded-2xl min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]"
                    src="https://placehold.co/300x300?text=No+attachements"
                    alt="no_image"
                  />
                </CarouselItem>
              )}
              {donation.attachements.map((url) => (
                <CarouselItem key={url}>
                  <img
                    className="rounded-2xl min-w-[300px] max-w-[300px] min-h-[300px] max-h-[300px]"
                    src={url}
                    alt={donation.title}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {!onMobile && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </div>
      <div>
        <h1 className="text-xl font-bold">{t('donation.comments')}</h1>
        <div className="py-3">
          <Separator className="w-full" />
        </div>
        <DonationComments donationId={donationData.data.id} />
      </div>
    </div>
  );
};
