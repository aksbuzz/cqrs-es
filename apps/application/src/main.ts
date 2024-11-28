import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './application.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: { servers: ['nats://localhost:4222'] },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
