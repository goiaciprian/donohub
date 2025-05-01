import { useParams } from 'react-router-dom';
import { Page } from './Page';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getDonationById } from '@/support';
import { usePrefetchQuery } from '@tanstack/react-query';
import { DetailedDonation } from '../DetailedDonation.Donation';

export const DonationPage = () => {
  const { donationId } = useParams();

  const getDonationByIdFn = useAuthRequest(getDonationById);
  usePrefetchQuery({
    queryKey: ['donation', donationId],
    queryFn: () =>
      getDonationByIdFn({
        pathParams: [{ key: ':id', value: donationId ?? '' }],
      }),
  });

  return (
    <Page
      className="lg:md:mx-[5%] py-5 select-none"
      dynamicComponent={<DetailedDonation donationId={donationId ?? ''} />}
    />
  );
};
