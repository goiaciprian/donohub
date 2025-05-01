import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getUserInfoByClerkId } from '@/support';
import { UserInfoDto } from '@donohub/shared';
import { useQuery } from '@tanstack/react-query';
import { UserRound, Mail, Star } from 'lucide-react';
import { Spinner } from './spinner/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTranslation } from 'react-i18next';

export const DonationUserInfo = ({ clerkUserId }: { clerkUserId: string }) => {
  const { t } = useTranslation();
  const getUserInfoFn = useAuthRequest(getUserInfoByClerkId);
  const userInfoQuery = useQuery<UserInfoDto>({
    queryKey: ['userInfo', clerkUserId],
    queryFn: () =>
      getUserInfoFn({
        pathParams: [{ key: ':id', value: clerkUserId }],
      }),
  });

  if (userInfoQuery.isLoading) {
    return (
      <div className="p-10">
        <Spinner />
      </div>
    );
  }

  if (userInfoQuery.isError || !userInfoQuery.data) {
    return <div className="text-red-600 p-3">{t('internal.smtWrong')}</div>;
  }

  const userInfo = userInfoQuery.data;
  const ratingArr = [0].fill(1, 0, Math.floor(userInfo.rating ?? 0));

  return (
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
  );
};
