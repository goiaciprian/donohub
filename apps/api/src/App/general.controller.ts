import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { interval, map } from 'rxjs';
import { CategoryService } from '@/Category/category.service';
import { CategoryDto } from '@donohub/shared';
import { EndpointResponse } from '@/Common/Decorators/endpointResponse.decorator';
import { NotificationServie } from '@/Notifications/service/notification.service';
import { SubscriptionDto } from '@/Notifications/dto/subscription.dto';
import { EventService } from '@/Common/Event/event.service';
import { HasAuth } from '@/Common/Decorators/hasAuth.decorator';
import { type UserType } from '@/Auth/clerk.strategy';
import { CurrentUser } from '@/Common/Decorators/user.decorator';
import { type ValidationInput } from '@/Validator/validator.service';

@Controller()
@ApiTags('general')
export class GeneralController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly eventService: EventService,
    private readonly notificationService: NotificationServie,
  ) {}

  @Sse('sse/:id')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  /**
   * will keep this in case i need it in the future
   */
  sse(@Param('id') _clerkId: string) {
    return interval(5 * 60 * 1000).pipe(
      map((_) => ({ data: { message: 'ping' } })),
    );

    // return merge(
    //   keppAlive,
    //   this.sseService.observable$.pipe(
    //     filter(({ data }) => data.clerkId === clerkId),
    //     map(({ data }) => ({
    //       data: {
    //         message: data.message,
    //         title: data.title,
    //         donationId: data.donationId,
    //         requestId: data.requestId,
    //         type: data.type,
    //       },
    //     })),
    //   ),
    // );
  }

  @Post('subscribe')
  @HasAuth()
  async subscribe(@Body() sub: SubscriptionDto, @CurrentUser() user: UserType) {
    return await this.notificationService.subscribe(user.id, sub);
  }

  @Post('unsubscribe')
  @HasAuth()
  async unsubscribe(@CurrentUser() user: UserType) {
    return await this.notificationService.unsubscribe(user.id);
  }

  @Post('notification/test')
  async test() {
    this.eventService.sendNotification({
      clerkId: undefined as any as string,
      message: 'Test notification',
      title: 'Test notification',
      type: 'comment',
      donationId: '',
    });
  }

  @Get('/categories')
  @EndpointResponse({
    type: CategoryDto,
    isArray: true,
  })
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoryService.getCategories();
  }

  @Post('validatorResponse')
  async validatorResponse(@Body() response: ValidationInput) {
    this.eventService.sendToValidation(response)
  }
}
