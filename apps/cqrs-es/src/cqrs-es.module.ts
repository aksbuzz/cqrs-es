import { Module } from '@nestjs/common';
import { CqrsEsController } from './cqrs-es.controller';
import { CqrsEsService } from './cqrs-es.service';

@Module({
  imports: [],
  controllers: [CqrsEsController],
  providers: [CqrsEsService],
})
export class CqrsEsModule {}
