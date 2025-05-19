import { Controller, Get, Header, Param, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { filter, interval, map, merge } from 'rxjs';
import { SseService } from '@/Common/SSE/sse.service';
import { CategoryService } from '@/Category/category.service';
import { CategoryDto } from '@donohub/shared';
import { EndpointResponse } from '@/Common/Decorators/endpointResponse.decorator';

@Controller()
@ApiTags('general')
export class GeneralController {
  constructor(
    private readonly sseService: SseService,
    private readonly categoryService: CategoryService,
  ) {}

  @Sse('sse/:id')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  sse(@Param('id') clerkId: string) {
    const keppAlive = interval(5 * 60 * 1000).pipe(
      map((_) => ({ data: { message: 'ping' } })),
    );

    return merge(
      keppAlive,
      this.sseService.observable$.pipe(
        filter(({ data }) => data.clerkId === clerkId),
        map(({ data }) => ({
          data: { message: data.message, title: data.title, donationId: data.donationId, type: data.type },
        })),
      ),
    );
  }

  @Get('/categories')
  @EndpointResponse({
    type: CategoryDto,
    isArray: true,
  })
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoryService.getCategories();
  }
}
