import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from '@/App/app.service';
import { CurrentUser } from '@/Common/Decorators/user.decorator';
import { type User } from '@clerk/backend';
import { Body } from '@nestjs/common';
import { PostTestDto, TestDto } from '@donohub/shared';
import { ApiBearerAuth } from '@nestjs/swagger';
// import { EndpointResponse } from '@/Common/Decorators/endpoint.response';

@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  // @EndpointResponse({
  //   type: TestDto
  // })
  getData(@CurrentUser() user: User): TestDto {
    return this.appService.getData(user);
  }

  @Post('/test')
  // @EndpointResponse({
  //   type: TestDto
  // })
  postDate(@Body() body: PostTestDto): TestDto {
    return { message: `response ${body.message}`}
  }

} 
