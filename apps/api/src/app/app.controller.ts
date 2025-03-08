import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './Common/Decorators/user.decorator';
import { type User } from '@clerk/backend';
import { Body } from '@nestjs/common';
import { PostTestDto, TestDto } from '@donohub/shared';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getData(@CurrentUser() user: User): TestDto {
    return this.appService.getData(user);
  }

  @Post('/test')
  postDate(@Body() body: PostTestDto): TestDto {
    return { message: `response ${body.message}`}
  }

} 
