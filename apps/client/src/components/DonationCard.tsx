import { DonationDto } from '@donohub/shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { NavLink, useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { displayLocation, getCategoryIcon } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CopyButton } from './buttons/CopyButton';

export const DonationCard = ({
  donation,
}: {
  donation: Omit<DonationDto, 'clerkUserId'>;
}) => {
  const { lang } = useParams();
  const { t } = useTranslation();
  return (
    <Card className="w-[800px] p-5 select-none">
      <div className="flex flex-row h-full">
        <Carousel opts={{ loop: true }} className="w-full max-w-[200px]">
          <CarouselContent>
            {donation.attachements.length === 0 && (
              <CarouselItem>
                <img
                  className="rounded-2xl min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px]"
                  src="https://placehold.co/200x200?text=No+attachements"
                  alt="no_image"
                />
              </CarouselItem>
            )}
            {donation.attachements.map((url) => (
              <CarouselItem
                key={url}
                // className="min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
              >
                <img
                  className="rounded-2xl min-w-[150px] max-w-[150px] min-h-[150px] max-h-[150px]"
                  src={url}
                  alt={donation.title}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex flex-col w-full">
          <CardHeader>
            <CardTitle className="text-2xl">{donation.title}</CardTitle>
            <CardDescription className="w-max">
              <div className="flex flex-row gap-5 w-fit flex-wrap overflow-hidden whitespace-nowrap ">
                <h5 className="flex items=-center gap-2">
                  {getCategoryIcon(donation.category)}
                  {t(`categories.${donation.category}`)}
                </h5>
                <h5 className="flex items-center gap-2 text-ellipsis">
                  <MapPin size={18} />
                  {displayLocation(donation.location)}
                </h5>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl">{donation.description}</p>
          </CardContent>
          <CardFooter className="self-end justify-self-end mt-auto">
            <div className="flex flex-row gap-2">
              <CopyButton
                url={`${window.location.origin}/${lang}/donations/${donation.id}`}
              />
              <NavLink to={`/${lang}/donations/${donation.id}`} viewTransition>
                <Button className="cursor-pointer">
                  {t('donationCard.details')}
                </Button>
              </NavLink>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
