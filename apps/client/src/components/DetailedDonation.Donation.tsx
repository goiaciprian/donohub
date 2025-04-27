import { useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { DonationDto, UserInfoDto } from '@donohub/shared';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationById, getUserInfoByClerkId } from '@/support';
import { displayLocation, getCategoryIcon } from '@/lib/utils';
import {
  CalendarPlus,
  MapPin,
  CalendarClock,
  UserRound,
  Mail,
  Star,
  Clipboard,
  Hash,
  PhoneCall,
} from 'lucide-react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Textarea } from './ui/textarea';
import { useAppForm } from '@/support/form';
import { Label } from './ui/label';
import { SignedIn } from '@clerk/clerk-react';
import React from 'react';

interface DetailedDonationProps {
  donationId: string;
}

const format = 'MMMM DD, yyyy HH:MM';

export const DetailedDonation = ({ donationId }: DetailedDonationProps) => {
  const { t } = useTranslation();

  // const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();

  // React.useEffect(() => {
  //   if(!carouselApi) {
  //     return;
  //   }

  //   carouselApi.on('slidesChanged')
  // }, [carouselApi])

  const form = useAppForm({
    defaultValues: {
      comment: '',
    },
  });

  const donationDateFn = useAuthRequest(getDonationById);
  const donationData = useSuspenseQuery<DonationDto>({
    queryKey: ['donation', donationId],
    queryFn: () =>
      donationDateFn({ pathParams: [{ key: ':id', value: donationId }] }),
  });

  const getUserInfoFn = useAuthRequest(getUserInfoByClerkId);
  const userInfoQuery = useSuspenseQuery<UserInfoDto>({
    queryKey: ['userInfo', donationData.data.clerkUserId],
    queryFn: () =>
      getUserInfoFn({
        pathParams: [{ key: ':id', value: donationData.data.clerkUserId }],
      }),
  });

  const donation = donationData.data;
  const createdAt = moment(donation.createdAt);
  const updatedAt = moment(donation.updatedAt);

  const userInfo = userInfoQuery.data;
  const ratingArr = [0].fill(1, 0, Math.floor(userInfo.rating));

  return (
    <div>
      <div className="flex items-center gap-4">
        <Button
          className="cursor-pointer text-xl"
          size="icon"
          variant="secondary"
          onClick={() =>
            navigator.clipboard
              .writeText(`${window.location.href}`)
              .then(() => toast.success(t('toast.copyLink.success')))
              .catch(() => toast.error(t('toast.copyLink.error')))
          }
        >
          <Clipboard />
        </Button>
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
              <PhoneCall /> {donation.phone || 'NO PHONE'}
            </h4>
          </div>
          <div className="mt-5">
            <h4 className="text-2xl flex items-center gap-5">
              <CalendarClock /> {updatedAt.fromNow()} ({' '}
              {createdAt.format(format)} )
            </h4>

            <h4 className="text-2xl flex items-center gap-5">
              <CalendarPlus /> {createdAt.fromNow()} ({' '}
              {createdAt.format(format)} )
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
            <div className="flex flex-row gap-5 items-center">
              <div>
                <Avatar className="size-20">
                  <AvatarImage src={userInfo.avatar} />
                  <AvatarFallback>{userInfo.fullName}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h4 className="text-2xl flex items-center gap-5">
                  <UserRound /> {userInfo.fullName}
                </h4>
                <h4 className="text-2xl flex items-center gap-5">
                  <Mail /> {userInfo.email}
                </h4>
                <h4 className="text-2xl flex items-center gap-5">
                  {ratingArr.map((value, index) => (
                    <Star key={index} fill={value ? 'yellow' : 'white'} />
                  ))}
                </h4>
              </div>
            </div>
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
        <SignedIn>
          <div>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <form.AppField
                name="comment"
                children={(field) => (
                  <>
                    <Label htmlFor={field.name}>
                      {t(`donation.${field.name}`)}
                    </Label>
                    <field.Textarea id={field.name} maxLength={150} />
                  </>
                )}
              />
              <form.AppForm>
                <form.Button className="w-min" type="submit">
                  {t('donation.post')}
                </form.Button>
              </form.AppForm>
            </form>
          </div>
        </SignedIn>
      </div>
    </div>
  );
};
