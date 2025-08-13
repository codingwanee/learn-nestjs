import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { MqttMessage, MqttMessageSchema } from './schemas/mqtt-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MqttMessage.name, schema: MqttMessageSchema },
    ]),
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
