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

export const DonationCard = ({ donation }: { donation: DonationDto }) => {
  return (
    <Card className="w-[800px] p-5">
      <div className="flex flex-row h-full">
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {donation.attachements.length === 0 && (
              <CarouselItem>
                <img
                  className="rounded-2xl min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
                  // height="200px"
                  // width="200px"
                  src="https://placehold.co/200x200?text=No+attachements"
                  alt="no_image"
                />
              </CarouselItem>
            )}
            {donation.attachements.map((url) => (
              <CarouselItem
                key={url}
                className="min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
              >
                <img
                  className="rounded-2xl min-w-[200px] max-w-[200px] min-h-[200px] max-h-[200px]"
                  // height="200px"
                  // width="200px"
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
              <div className="flex flex-row gap-5 w-fit">
                <h5 className="text-xl">{donation.category}</h5>
                <h5 className="text-xl">
                  {Object.values(donation.location).join(' ')}
                </h5>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{donation.description}</p>
          </CardContent>
          <CardFooter className="self-end justify-self-end mt-auto">
            <div className="flex flex-row gap-2">
              <button>See details</button>
              <button>Copy</button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};
