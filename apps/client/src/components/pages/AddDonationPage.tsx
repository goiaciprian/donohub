import { useTranslation } from 'react-i18next';
import { Page } from './Page';
import { AddDonationForm } from '../DonationForm.AddDonation';

export const AddDonationPage = () => {
  const { t } = useTranslation();

  return (
    <Page
      className="lg:md:mx-[5%] select-none"
      staticFirst={
        <h1 className="font-bold pt-5 text-4xl">{t('navigation.create')}</h1>
      }
      dynamicComponent={<AddDonationForm />}
    />
  );
};
