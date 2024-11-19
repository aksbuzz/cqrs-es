import { Controller, Get } from '@nestjs/common';
import { CqrsEsService } from './cqrs-es.service';

@Controller()
export class CqrsEsController {
  constructor(private readonly cqrsEsService: CqrsEsService) {}

  @Get()
  getHello(): string {
    return this.cqrsEsService.getHello();
  }
}
