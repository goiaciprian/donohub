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
import {
  displayLocation,
  getCategoryIcon,
  LocaleCategoriesHeleper,
} from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { CopyButton } from './buttons/CopyButton';

export const DonationCard = ({
  donation,
}: {
  donation: Omit<DonationDto, 'clerkUserId'>;
}) => {
  const { lang } = useParams();
  const { t } = useTranslation(['translation', 'categories']);
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
              <CarouselItem key={url}>
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
              <div className="flex flex-wrap gap-1 md:gap-5 whitespace-nowrap ">
                <h5 className="flex items-center gap-2">
                  {getCategoryIcon(donation.category)}
                  {t(
                    `categories:${donation.category}` as LocaleCategoriesHeleper,
                  )}
                </h5>
                <h5 className="flex items-center gap-2 w-full md:w-auto">
                  <MapPin size={18} />
                  <div className="md:w-auto w-[150px] overflow-hidden text-ellipsis whitespace-nowrap inline-block">
                    {displayLocation(donation.location)}
                  </div>
                </h5>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl truncate text-ellipsis ">
              {donation.description}
            </p>
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
