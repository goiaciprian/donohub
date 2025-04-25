import { Module } from '@nestjs/common';
import { CoreListeners } from './core.listener';

@Module({
  providers: [CoreListeners],
  exports: [CoreListeners],
})
export class ListenersModule {}
