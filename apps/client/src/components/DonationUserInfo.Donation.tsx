import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getUserInfoByClerkId } from '@/support';
import { UserInfoDto } from '@donohub/shared';
import { useQuery } from '@tanstack/react-query';
import { UserRound, Mail, Star } from 'lucide-react';
import { Spinner } from './spinner/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent } from './ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

export const DonationUserInfo = ({
  clerkUserId,
  avatarSize,
}: {
  clerkUserId: string;
  avatarSize?: string;
}) => {
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
  const ratingArr = [0, 0, 0, 0, 0].fill(
    1,
    0,
    Math.floor(userInfo.rating ?? 0),
  );

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center">
      <div>
        <Avatar className={avatarSize || 'size-15'}>
          <AvatarImage src={userInfo.avatar} />
          <AvatarFallback>{userInfo.fullName}</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full">
        <h4 className="text-md flex items-center gap-3">
          <UserRound size={18} /> <span>{userInfo.fullName}</span>
        </h4>
        <h4 className="text-md flex items-center gap-3 ">
          <Mail size={18} />{' '}
          <span className="working-break-[2]">{userInfo.email}</span>
        </h4>
        <h4>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex gap-1">
                {ratingArr.map((value, index) => (
                  <Star
                    size={18}
                    key={index}
                    fill={value ? 'yellow' : 'white'}
                  />
                ))}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{userInfo.rating} rating</p>
            </TooltipContent>
          </Tooltip>
        </h4>
      </div>
    </div>
  );
};
