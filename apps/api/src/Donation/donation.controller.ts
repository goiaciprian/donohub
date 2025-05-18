import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { DonationService } from './Service/donation.service';
import { CurrentUser } from '@/Common/Decorators/user.decorator';
import { PaginationQueryDto } from '@/Common/Dtos/pagination.dto';
import { EndpointResponse } from '@/Common/Decorators/endpointResponse.decorator';
import {
  DonationDto,
  type DonationEvaluationType,
  PaginatedDonationDto,
  PaginatedDonationRequestByUserDto,
  PaginatedDonationUserRequestsDto,
  PaginatedEvaluatedDonationDto,
  PostDonationDto,
  PutDonationEvaluationDto,
  PutDonationRequestDto,
  UpdateDonationDto,
} from '@donohub/shared';
import { type UserType } from '@/Auth/clerk.strategy';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DonationFilterSortDto } from './Dtos/donation-filter-sort.dto';
import { HasAuth } from '@/Common/Decorators/hasAuth.decorator';

const acceptMimeType = ['image/png', 'image/jpg', 'image/jpeg'];

@Controller('donations')
@ApiTags('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Get('self')
  @EndpointResponse({
    type: PaginatedEvaluatedDonationDto,
  })
  @HasAuth()
  async getDonationsByUser(
    @CurrentUser() user: UserType,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.donationService.getDonationsByUser(
      user.id,
      pagination.page,
      pagination.size,
    );
  }

  @Get('by/:id')
  @EndpointResponse({
    type: DonationDto,
  })
  async getDonationById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.donationService.getDonationById(id);
  }

  @Post()
  @EndpointResponse(
    {
      type: DonationDto,
    },
    true,
  )
  @ApiConsumes('multipart/form-data')
  @HasAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachements', maxCount: 4 }], {
      limits: {
        fileSize: 1000 * 1000 * 5, //5 mb
      },
      fileFilter: (_, file, cb) => {
        if (acceptMimeType.includes(file.mimetype)) {
          cb(null, true);
          return;
        }
        cb(
          new UnprocessableEntityException(
            `type should be one of ${acceptMimeType.join(', ')}`,
          ),
          false,
        );
      },
    }),
  )
  async createDonation(
    @Body() donation: PostDonationDto,
    @UploadedFiles()
    { attachements }: { attachements: Express.Multer.File[] | undefined },
    @CurrentUser() user: UserType,
  ): Promise<DonationDto> {
    if (!attachements || attachements.length === 0 || attachements.length > 4) {
      throw new BadRequestException();
    }
    return await this.donationService.createDonation(
      donation,
      user.id,
      user.userInfo.id,
      attachements,
    );
  }

  @Put('/update/:id')
  @EndpointResponse({
    type: DonationDto,
  })
  @ApiConsumes('multipart/form-data')
  @HasAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachements', maxCount: 4 }], {
      limits: {
        fileSize: 1000 * 1000 * 5, //5 mb
      },
      fileFilter: (_, file, cb) => {
        if (acceptMimeType.includes(file.mimetype)) {
          cb(null, true);
          return;
        }
        cb(
          new UnprocessableEntityException(
            `type should be one of ${acceptMimeType.join(', ')}`,
          ),
          false,
        );
      },
    }),
  )
  async updateDonation(
    @Param('id') donationId: string,
    @Body() partialObject: UpdateDonationDto,
    @UploadedFiles()
    { attachements }: { attachements: Express.Multer.File[] | undefined },
    @CurrentUser() user: UserType,
  ) {
    if (Object.keys(partialObject).length === 0 && !attachements) {
      throw new BadRequestException();
    }
    return await this.donationService.updateDonation(
      donationId,
      partialObject,
      attachements,
      user,
    );
  }

  @Get()
  @EndpointResponse({
    type: DonationDto,
  })
  async getDonations(
    @Query() pagination: PaginationQueryDto,
    @Query() filterSort: DonationFilterSortDto,
  ) {
    return await this.donationService.listDonation(
      pagination.page,
      pagination.size,
      filterSort.category || undefined,
      filterSort.location || undefined,
      filterSort.q || undefined,
    );
  }

  @Put('/evaluate/:id/:status')
  @ApiParam({
    name: 'status',
    required: true,
    type: String,
  })
  @HasAuth('donation:evaluate')
  async listDonation(
    @Param('id') donationId: string,
    @Param('status') status: DonationEvaluationType,
    @Body() evaluationDto: PutDonationEvaluationDto,
    @CurrentUser() user: UserType,
  ) {
    if (status === 'DECLINED' && !evaluationDto.comment) {
      throw new BadRequestException();
    }
    return await this.donationService.evaluateDonation(
      donationId,
      status,
      evaluationDto,
      user,
    );
  }

  @Get('unlisted')
  @HasAuth()
  @EndpointResponse({
    type: PaginatedDonationDto,
  })
  async getUnlistedDonation(
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user: UserType,
  ) {
    return await this.donationService.getUnlistedDonations(pagination, user);
  }

  @Get('evaluated/:clerkId')
  @HasAuth('donation:evaluate')
  @EndpointResponse({
    type: PaginatedEvaluatedDonationDto,
  })
  async getEvaluatedDonationsByUser(
    @Param('clerkId') clerkId: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.donationService.getEvaluatedDonationsByUser(
      clerkId,
      pagination,
    );
  }

  @Put('request/create/:donationId')
  @HasAuth()
  async putDonationRequest(
    @Param('donationId') donationId: string,
    @Body() body: PutDonationRequestDto,
    @CurrentUser() user: UserType,
  ) {
    await this.donationService.createDonationRequest(donationId, body, user);
  }

  @Put('request/resolve/:requestId/:status')
  @ApiParam({
    name: 'status',
    required: true,
    type: String,
  })
  @HasAuth()
  async resolveDonationRequest(
    @Param('requestId') requestId: string,
    @Param('status') status: DonationEvaluationType,
    @CurrentUser() user: UserType,
  ) {
    await this.donationService.resolveDonationRequest(requestId, status, user);
  }

  @Get('request/self')
  @HasAuth()
  @EndpointResponse({
    type: PaginatedDonationRequestByUserDto,
  })
  async getUsersDonationRequests(
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user: UserType,
  ): Promise<PaginatedDonationRequestByUserDto> {
    return await this.donationService.getSelfDonationRequests(pagination, user);
  }

  @Get('request/donation')
  @HasAuth()
  @EndpointResponse({
    type: PaginatedDonationUserRequestsDto,
  })
  async getDonationsRequests(
    @Query() pagination: PaginationQueryDto,
    @CurrentUser() user: UserType,
  ) {
    return await this.donationService.getDonationRequests(pagination, user);
  }
}
