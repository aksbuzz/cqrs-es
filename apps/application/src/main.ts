import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './application.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
