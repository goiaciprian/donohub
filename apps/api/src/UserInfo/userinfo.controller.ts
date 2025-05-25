import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserInfoService } from './Service/userinfo.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EndpointResponse } from '@/Common/Decorators/endpointResponse.decorator';
import { UserInfoDto } from '@donohub/shared';
import { UserCreatedEvent } from '@/Common/Dtos/usercreated.event';
import { UserDeletedEvent } from '@/Common/Dtos/userdeleted.event';
import {
  WebhookDeleteGuard,
  WebhookRegisterGuard,
  WebhookUpdatedGuard,
} from '@/Common/Guards/webhook.guard';
import { UserUpdatedEvent } from '@/Common/Dtos/userupdated.events';

@Controller('userInfo')
@ApiTags('userInfo')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get(':id/clerk')
  @EndpointResponse({
    type: UserInfoDto,
  })
  async getUserInfoByClerkId(@Param('id') id: string) {
    return await this.userInfoService.getUserInfoByClerkId(id);
  }

  @Get(':id/info')
  @EndpointResponse({
    type: UserInfoDto,
  })
  async getUserInfoById(@Param('id') id: string): Promise<UserInfoDto> {
    return await this.userInfoService.getUserInfoById(id);
  }

  @Post('complete')
  @ApiBody({
    type: UserCreatedEvent,
  })
  @UseGuards(WebhookRegisterGuard)
  async completeRegister(@Body() body: UserCreatedEvent) {
    await this.userInfoService.completeRegister(body.data.id);
  }

  @Post('delete')
  @ApiBody({
    type: UserDeletedEvent,
  })
  @UseGuards(WebhookDeleteGuard)
  async completeDeletion(@Body() body: UserDeletedEvent) {
    await this.userInfoService.completeDeletion(body.data.id);
  }

  @Post('update')
  @ApiBody({
    type: UserUpdatedEvent
  })
  @UseGuards(WebhookUpdatedGuard)
  async updateUser(@Body() body: UserUpdatedEvent) {
    await this.userInfoService.updateUser(body);
  }

}
