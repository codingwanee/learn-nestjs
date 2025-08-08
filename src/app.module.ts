import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HelloController } from './hello/hello.controller';
import { MqttController } from './mqtt/mqtt.controller';
import { MqttService } from './mqtt/mqtt.service';
import { AppService } from './app.service';
import { HelloService } from './hello/hello.service';

@Module({
  imports: [],
  controllers: [AppController, HelloController, MqttController],
  providers: [AppService, HelloService, MqttService],
})
export class AppModule {}
