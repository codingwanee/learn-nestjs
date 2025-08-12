import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Note: MQTT broker is now handled by AedesService
  // The MQTT microservice client is removed to avoid conflicts
  await app.listen(3000);
}
bootstrap();
