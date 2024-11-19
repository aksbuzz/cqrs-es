import { Injectable } from '@nestjs/common';

@Injectable()
export class CqrsEsService {
  getHello(): string {
    return 'Hello World!';
  }
}
