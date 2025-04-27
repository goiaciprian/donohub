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
import { toast } from 'sonner';
import { MapPin, Clipboard } from 'lucide-react';
import { displayLocation, getCategoryIcon } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const DonationCard = ({
  donation,
}: {
  donation: Omit<DonationDto, 'clerkUserId'>;
}) => {
  const { lang } = useParams();
  const { t } = useTranslation();
  return (
    <Card className="w-[800px] p-5">
      <div className="flex flex-row h-full">
        <Carousel opts={{ loop: true }} className="w-full max-w-[200px]">
          <CarouselContent>
            {donation.attachements.length === 0 && (
              <CarouselItem>
                <img
                  className="rounded-2xl min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
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
                  className="rounded-2xl min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
                  src={url}
                  alt={donation.title}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex flex-col w-full">
          <CardHeader>
            <CardTitle className="text-3xl">{donation.title}</CardTitle>
            <CardDescription className="w-max">
              <div className="flex flex-row gap-5 w-fit flex-wrap overflow-hidden whitespace-nowrap ">
                <h5 className="text-xl flex items=-center gap-2">
                  {getCategoryIcon(donation.category)}
                  {t(`categories.${donation.category}`)}
                </h5>
                <h5 className="text-xl flex items-center gap-2 text-ellipsis">
                  <MapPin />
                  {displayLocation(donation.location)}
                </h5>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{donation.description}</p>
          </CardContent>
          <CardFooter className="self-end justify-self-end mt-auto">
            <div className="flex flex-row gap-2">
              <Button
                className="cursor-pointer text-xl"
                size="icon"
                variant="secondary"
                onClick={() =>
                  navigator.clipboard
                    .writeText(
                      `${window.location.origin}/${lang}/donations/${donation.id}`,
                    )
                    .then(() => toast.success('Linked copied'))
                    .catch(() => toast.error('Error copying the link'))
                }
              >
                <Clipboard />
              </Button>
              <NavLink to={`/${lang}/donations/${donation.id}`} viewTransition>
                <Button className="cursor-pointer text-xl">
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
