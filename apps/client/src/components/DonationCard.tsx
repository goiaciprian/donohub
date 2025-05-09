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
    <Card className="w-full md:max-w-[500px] p-5 select-none">
      <div className="flex items-center gap-2 md:gap-0 flex-col md:flex-row h-full w-full">
        <Carousel opts={{ loop: true }} className="w-full max-w-[150px]">
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
        <div className="flex flex-col gap-5 md:gap-0 w-full">
          <CardHeader className="">
            <CardTitle className="text-2xl w-fit m-auto md:m-0 working-break-1">
              {donation.title}
            </CardTitle>
            <CardDescription className="w-full">
              <div className="flex flex-col gap-1 md:gap-0">
                <h5 className="flex items-center gap-2 m-auto md:m-0">
                  {getCategoryIcon(donation.category)}
                  {t(
                    `categories:${donation.category}` as LocaleCategoriesHeleper,
                  )}
                </h5>
                <h5 className="flex items-center gap-2 w-fit m-auto md:m-0">
                  <MapPin size={18} />
                  <div className="w-full">
                    <p className="working-break-[2]">
                      {displayLocation(donation.location)}
                    </p>
                  </div>
                </h5>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl m-auto md:m-0 w-fit working-break-[2] ">
              {donation.description}
            </p>
          </CardContent>
          <CardFooter className="self-center md:self-end md:justify-self-end mt-auto">
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
