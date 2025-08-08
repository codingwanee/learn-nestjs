import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';

import { MqttService } from './mqtt.service';

@Controller()
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}
  // Example: publish a message to topic 'mqtt/test' to see this handler fire
  @MessagePattern('mqtt/test')
  handleHelloTopic(@Payload() data: any, @Ctx() context: MqttContext): string {
    const topic = context.getTopic();
    const packet = context.getPacket();
    return this.mqttService.buildMqttResponse(topic, data, packet.qos ?? 0);
  }

  // Wildcard example
  @MessagePattern('collar/prod/+/data')
  handleWildcard(@Payload() payload: unknown, @Ctx() ctx: MqttContext): void {
    const topic = ctx.getTopic();
    this.mqttService.logEvent(topic, payload);
  }
}
