import { Module } from '@nestjs/common';
import { dbProviders } from './db/db.provider';

@Module({
  providers: [...dbProviders],
  exports: [...dbProviders],
})
export class CoreModule {}
