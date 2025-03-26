import { PrismaService } from '@/Prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PostLocationDto } from '@donohub/shared';

@Injectable()
export class LocationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLocations() {
    return this.prismaService.location.findMany();
  }

  async createLocation({ postalCode, ...rest }: PostLocationDto) {
    return this.prismaService.location.create({
      data: {
        ...rest,
        postal_code: postalCode,
      },
    });
  }

  async getLocationById(id: string) {
    return this.prismaService.location.findFirst({
      where: {
        id,
      },
    });
  }
}
