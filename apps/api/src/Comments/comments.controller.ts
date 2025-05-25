import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CommentsService } from "./Service/comments.service";
import { EndpointResponse } from "@/Common/Decorators/endpointResponse.decorator";
import { CommentPaginatedDto, CommentPostDto, PaginatedUserCommentsDto } from "@donohub/shared";
import { HasAuth } from "@/Common/Decorators/hasAuth.decorator";
import { CurrentUser } from "@/Common/Decorators/user.decorator";
import { type UserType } from "@/Auth/clerk.strategy";
import { ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "@/Common/Dtos/pagination.dto";

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(":donationId")
  @EndpointResponse({
    type: CommentPaginatedDto,
  })
  async getCommentsByDonation(@Param("donationId") donationId: string, @Query() pagination: PaginationQueryDto) {
    return this.commentsService.getCommentsByDonation(donationId, pagination);
  }

  @Get('user/self')
  @HasAuth()
  @EndpointResponse({
    type: PaginatedUserCommentsDto
  })
  async getUserComments(@Query() pagination: PaginationQueryDto, @CurrentUser() user: UserType) {
    return this.commentsService.getUserComments(pagination, user);
  }

  @Post(":donationId")
  @HasAuth()
  async createDonation(@Param('donationId') donationId: string, @Body() comment: CommentPostDto, @CurrentUser() user: UserType) {
    return this.commentsService.createComment(donationId, comment, user);
  }
}