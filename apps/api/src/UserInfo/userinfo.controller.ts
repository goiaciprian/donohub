import { Controller, Get, Param } from '@nestjs/common';
import { UserInfoService } from './Service/userinfo.service';
import { ApiTags } from '@nestjs/swagger';
import { EndpointResponse } from '@/Common/Decorators/endpoint.response';
import { UserInfoDto } from '@donohub/shared';

@Controller('userInfo/:id')
@ApiTags('userInfo')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Get('clerk')
  @EndpointResponse({
    type: UserInfoDto,
  })
  async getUserInfoByClerkId(@Param('id') id: string): Promise<UserInfoDto> {
    return await this.userInfoService.getUserInfoByClerkId(id);
  }

  @Get('info')
  @EndpointResponse({
    type: UserInfoDto,
  })
  async getUserInfoById(@Param('id') id: string): Promise<UserInfoDto> {
    return await this.userInfoService.getUserInfoById(id);
  }
}
