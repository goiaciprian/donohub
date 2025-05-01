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
import {
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { DonationService } from './Service/donation.service';
import { CurrentUser } from '@/Common/Decorators/user.decorator';
import { PaginationQueryDto } from '@/Common/Dtos/pagination.dto';
import { EndpointResponse } from '@/Common/Decorators/endpointResponse.decorator';
import { DonationDto, PostDonationDto } from '@donohub/shared';
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
    type: DonationDto,
    isArray: true,
  })
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

  @Get(':id')
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
    if (!attachements || attachements.length === 0) {
      throw new BadRequestException();
    }
    return await this.donationService.createDonation(
      donation,
      user.id,
      user.userInfo.id,
      attachements,
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

  @Put(':id/evaluate')
  @HasAuth('donation:evaluate')
  async listDonation(@Param('id') donationId: string) {
    return {
      m: `${donationId} settings to listed`,
    };
  }
}
