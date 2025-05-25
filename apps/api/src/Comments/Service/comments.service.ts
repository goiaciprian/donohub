import { UserType } from '@/Auth/clerk.strategy';
import { PaginationQueryDto } from '@/Common/Dtos/pagination.dto';
import { SseService } from '@/Common/SSE/sse.service';
import { PrismaService } from '@/Prisma/prisma.service';
import {
  CommentDto,
  CommentPaginatedDto,
  CommentPostDto,
  PaginatedUserCommentsDto,
} from '@donohub/shared';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sseService: SseService,
  ) {}

  async createComment(donationId: string, dto: CommentPostDto, user: UserType) {
    const name = `${user.firstName} ${user.lastName}`;

    const donationPromise = this.prismaService.donation.findFirstOrThrow({
      where: { id: donationId },
      select: { clerkUserId: true, id: true },
    });

    const comment = await this.prismaService.comment.create({
      data: {
        clerkUserId: user.id,
        full_name: name,
        text: dto.message,
        userImage: user.imageUrl,
        Donation: {
          connect: {
            id: donationId,
          },
        },
      },
    });

    const d = await donationPromise;

    this.sseService.push$({
      title: 'Comment',
      message: `Received a comment from ${name}`,
      clerkId: d.clerkUserId,
      donationId: d.id,
      type: 'comment',
    });

    return this.map(comment);
  }

  async getCommentsByDonation(
    donationId: string,
    { page, size }: PaginationQueryDto,
  ): Promise<CommentPaginatedDto> {
    const take = size;
    const skip = (page - 1) * size;
    const [comments, count] = await this.prismaService.$transaction(
      async (tx) => {
        return await Promise.all([
          tx.comment.findMany({
            where: { donationId },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
          }),
          tx.comment.count({ where: { donationId } }),
        ]);
      },
    );
    const totalPages = Math.ceil(count / size);
    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalPages,
      totalItems: count,
      items: comments.map((comment) => this.map(comment)),
    };
  }

  async getUserComments(
    pagination: PaginationQueryDto,
    user: UserType,
  ): Promise<PaginatedUserCommentsDto> {
    const { page, size } = pagination;
    const take = size;
    const skip = (page - 1) * size;

    const [count, items] = await this.prismaService.$transaction(async (tx) => {
      return await Promise.all([
        tx.donation.count({
          where: {
            comments: {
              some: {
                clerkUserId: user.id,
              },
            },
          },
        }),
        tx.donation.findMany({
          take,
          skip,
          where: {
            comments: {
              some: {
                clerkUserId: user.id,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            comments: {
              where: {
                clerkUserId: user.id,
              },
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                id: true,
                full_name: true,
                text: true,
                createdAt: true,
                userImage: true,
              },
            },
          },
        }),
      ]);
    });

    const totalPages = Math.ceil(count / size);

    return {
      hasNext: page < totalPages,
      hasPrev: page > 1,
      page,
      size,
      totalItems: count,
      totalPages,
      items,
    };
  }

  private map(entity: Prisma.CommentGetPayload<object>): CommentDto {
    return {
      createdAt: entity.createdAt.toISOString(),
      fullName: entity.full_name,
      id: entity.id,
      text: entity.text,
      userImage: entity.userImage,
    };
  }
}
