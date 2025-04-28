import { Controller, Get, Param, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SupabaseService } from '@/Supabase/supabase.service';
import { interval, map, merge } from 'rxjs';
import { SseService } from '@/Common/SSE/sse.service';
import { CategoryService } from '@/Category/category.service';
import { CategoryDto } from '@donohub/shared';
import { EndpointResponse } from '@/Common/Decorators/endpoint.response';

@Controller()
@ApiTags('general')
export class GeneralController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly sseService: SseService,
    private readonly categoryService: CategoryService,
  ) {}

  @Sse('sse')
  sse() {
    const keppAlive = interval(5 * 60 * 1000).pipe(
      map((_) => ({ data: { message: 'ping' } })),
    );

    return merge(keppAlive, this.sseService.observable$);
  }

  // @Get('/content/:id')
  // async getBuckets(@Param('id') id: string) {
  //   return this.supabaseService.getMediaContent(id);
  // }

  @Get('/categories')
  @EndpointResponse({
    type: CategoryDto,
    isArray: true,
  })
  async getCategories(): Promise<CategoryDto[]> {
    return this.categoryService.getCategories();
  }
}
