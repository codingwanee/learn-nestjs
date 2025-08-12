import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HelloController } from './hello/hello.controller';
import { AppService } from './app.service';
import { HelloService } from './hello/hello.service';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [MqttModule],
  controllers: [AppController, HelloController],
  providers: [AppService, HelloService],
})
export class AppModule {}
