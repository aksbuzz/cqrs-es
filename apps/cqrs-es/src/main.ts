import { NestFactory } from '@nestjs/core';
import { CqrsEsModule } from './cqrs-es.module';

async function bootstrap() {
  const app = await NestFactory.create(CqrsEsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
