import { useTranslation } from 'react-i18next';
import { Page } from './Page';
import { UnlistedDonations } from '@/admin/UnlistedDonation.EvaluateDonation';

export const EvaluateDonations = () => {
  const { t } = useTranslation();

  return (
    <Page
      className={'select-none lg:md:mx-[5%]'}
      staticFirst={
        <div className="">
          <h1 className="font-bold text-4xl py-5">
            {t('internal.evaluation.donation.title')}
          </h1>
        </div>
      }
      dynamicComponent={<UnlistedDonations />}
    />
  );
};
