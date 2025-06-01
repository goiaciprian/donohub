import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Page } from './Page';
import { UserDonations } from '../profile/Donations.Profile';
import { DonationRequests } from '../profile/DonationRequest.Profile';
import { ListSelfRequests } from '../profile/UserRequests.Profile';
import { UnderDelivryProfileDonations } from '../profile/DeliveryDonations.Profile';
import { useTranslation } from 'react-i18next';

export const DonationsProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  return (
    <Tabs
      value={searchParams.get('t') || 'myDonations'}
      onValueChange={(t) =>
        setSearchParams((prev) => {
          prev.delete('i');
          prev.set('t', t);
          return prev;
        })
      }
    >
      <Page
        className="select-none"
        staticFirst={
          <TabsList className="bg-white my-8 flex flex-wrap ">
            <TabsTrigger
              className="md:text-xl cursor-pointer data-[state=active]:underline"
              value="myDonations"
            >
              {t('tabs.userDonations')}
            </TabsTrigger>
            <TabsTrigger
              className="md:text-xl cursor-pointer data-[state=active]:underline"
              value="donationRequests"
            >
              {t('tabs.donationRequests')}
            </TabsTrigger>
            <TabsTrigger
              className="md:text-xl cursor-pointer data-[state=active]:underline"
              value="userRequests"
            >
              {t('tabs.myRequests')}
            </TabsTrigger>
            <TabsTrigger
              className="md:text-xl cursor-pointer data-[state=active]:underline"
              value="delivery"
            >
              {t('tabs.underDelivery')}
            </TabsTrigger>
          </TabsList>
        }
        dynamicComponent={
          <>
            <TabsContent value="myDonations">
              <UserDonations />
            </TabsContent>
            <TabsContent value="donationRequests">
              <DonationRequests />
            </TabsContent>
            <TabsContent value="userRequests">
              <ListSelfRequests />
            </TabsContent>
            <TabsContent value="delivery">
              <UnderDelivryProfileDonations />
            </TabsContent>
          </>
        }
      />
    </Tabs>
  );
};
