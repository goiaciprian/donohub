import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { DonationCard } from './DonationCard';
import { DonationDto, UserInfoDto } from '@donohub/shared';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationById, getUserInfoByClerkId } from '@/support';
import { getCategoryIcon } from '@/lib/utils';
import {
  CalendarPlus,
  MapPin,
  CalendarClock,
  UserRound,
  Mail,
  Star,
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

interface DetailedDonationProps {
  donationId: string;
}

const format = 'MMMM DD, yyyy HH:MM';

export const DetailedDonation = ({ donationId }: DetailedDonationProps) => {
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
      <h1 className="text-4xl font-bold">{donation.title}</h1>
      <div className="pt-5 flex">
        <div className="flex-1 pr-20">
          <div>
            <h4 className="text-2xl flex items-center gap-5">
              {getCategoryIcon(donation.category)} {donation.category}
            </h4>
            <h4 className="text-2xl flex items-center gap-5">
              <MapPin />{' '}
              {Object.values(donation.location)
                .filter((item) => !!item)
                .join(', ')}
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
            <h2 className="font-semibold text-4xl">User</h2>
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
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {donation.attachements.length === 0 && (
                <CarouselItem>
                  <img
                    className="rounded-2xl min-w-[500px] max-w-[500px] min-h-[500px] max-h-[500px]"
                    // height="200px"
                    // width="200px"
                    src="https://placehold.co/500x500?text=No+attachements"
                    alt="no_image"
                  />
                </CarouselItem>
              )}
              {donation.attachements.map((url) => (
                <CarouselItem
                  key={url}
                  className="min-w-[500px] max-w-[500px] min-h-[500px] max-h-[500px]"
                >
                  <img
                    className="rounded-2xl min-w-[500px] max-w-[500px] min-h-[500px] max-h-[500px]"
                    // height="200px"
                    // width="200px"
                    src={url}
                    alt={donation.title}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div>
        <h1 className="text-4xl font-semibold">Comments</h1>
        <div className="py-3">
          <Separator className="w-full" />
        </div>
      </div>
    </div>
  );
};
