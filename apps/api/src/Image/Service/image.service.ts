import { PrismaService } from '@/Prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

@Injectable()
export class ImageService {
  constructor(private readonly prismaService: PrismaService) {}

  async uploadImages(images: Express.Multer.File[], clerkUserId: string) {
    return await Promise.all(
      images.map((img) => this.getOrCreate(img, clerkUserId)),
    );
  }

  calculateMd5Hash(bufferString: string) {
    return crypto.createHash('md5').update(bufferString).digest('hex');
  }

  private async getOrCreate(image: Express.Multer.File, clerkUserId: string) {
    const hash = this.calculateMd5Hash(image.buffer.toString());

    let imageEntity = await this.prismaService.image.findFirst({
      where: {
        hash,
      },
      select: {
        filename: true,
      },
    });
    if (!imageEntity) {
      imageEntity = await this.prismaService.image.create({
        data: {
          clerkUserId,
          contentType: image.mimetype,
          filename: image.originalname,
          hash,
          size: image.size,
        },
        select: { filename: true },
      });
    }
    return {
      filename: imageEntity.filename,
      hash,
    };
  }
}
