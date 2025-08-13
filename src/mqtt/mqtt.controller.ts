import { Controller, Get, Query, Param } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Get('messages')
  async getRecentMessages(@Query('limit') limit?: number) {
    const messageLimit = limit ? parseInt(limit.toString()) : 50;
    const messages = await this.mqttService.getRecentMessages(messageLimit);
    return {
      count: messages.length,
      messages,
    };
  }

  @Get('messages/topic/:topic')
  async getMessagesByTopic(
    @Param('topic') topic: string,
    @Query('limit') limit?: number,
  ) {
    const messageLimit = limit ? parseInt(limit.toString()) : 100;
    const messages = await this.mqttService.getMessagesByTopic(
      topic,
      messageLimit,
    );
    return {
      topic,
      count: messages.length,
      messages,
    };
  }

  @Get('messages/pattern/:pattern')
  async getMessagesByPattern(
    @Param('pattern') pattern: string,
    @Query('limit') limit?: number,
  ) {
    const messageLimit = limit ? parseInt(limit.toString()) : 100;
    const messages = await this.mqttService.getMessagesByPattern(
      pattern,
      messageLimit,
    );
    return {
      pattern,
      count: messages.length,
      messages,
    };
  }
}
