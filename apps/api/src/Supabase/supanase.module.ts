import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [
    {
      provide: SupabaseService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new SupabaseService(
          configService.getOrThrow('supabaseUrl'),
          configService.getOrThrow('supabaseApiKey'),
        ),
    },
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}
