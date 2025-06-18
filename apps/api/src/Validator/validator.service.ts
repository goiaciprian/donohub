import { EventType } from '@/Common/Event/event.service';
import { PrismaService } from '@/Prisma/prisma.service';
import { DonationStatus } from '@donohub/shared';
import { validateDonation } from '@donohub/validator';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export type ValidationInput = {
  title: string;
  description: string;
  images: string[];
  donationId: string;
};

@Injectable()
export class ValidatorService {
  constructor(private readonly prismaService: PrismaService) {}

  @OnEvent(EventType.Validation)
  async handleValidation(input: ValidationInput) {
    const verdict = await validateDonation(
      input.title,
      input.description,
      input.images,
    );
    if (verdict === 'ACCEPTED') {
      this.prismaService.donation.update({
        where: {
          id: input.donationId,
        },
        data: {
          status: DonationStatus.Enum.LISTED,
        },
      });
    }
  }
}
