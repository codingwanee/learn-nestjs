import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Attach MQTT microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL ?? 'mqtt://localhost:1883',
      // Provide a stable-ish clientId to avoid duplicate connections when developing
      clientId:
        process.env.MQTT_CLIENT_ID ??
        `learn-nestjs_${Math.random().toString(16).slice(2)}`,
      clean: true,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
