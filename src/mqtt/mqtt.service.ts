import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createServer } from 'net';
import {
  MqttMessage,
  MqttMessageDocument,
} from './schemas/mqtt-message.schema';
import { getMongoDb } from 'src/lib/mongo';

const aedes = require('aedes');

@Injectable()
export class MqttService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MqttService.name);
  private broker: any;
  private tcpServer: any;

  constructor(
    @InjectModel(MqttMessage.name)
    private mqttMessageModel: Model<MqttMessageDocument>,
  ) {}

  onApplicationBootstrap() {
    this.initializeBroker();
  }

  private initializeBroker() {
    // Create Aedes broker instance
    this.broker = aedes({
      id: 'aedes-broker',
    });

    // TCP Server
    this.tcpServer = createServer(this.broker.handle);
    this.tcpServer.listen(1883, () => {
      this.logger.log('MQTT Broker (TCP) is running on port 1883');
    });

    // Handle messages
    this.broker.on('publish', async (packet, client) => {
      if (client) {
        this.logger.log(
          `Message received: ${packet.topic} -> ${packet.payload.toString()}`,
        );

        // 특정 토픽들만 MongoDB에 저장
        await this.saveMessageToMongoDB(packet, client);
      }
    });

    this.broker.on('client', (client) => {
      this.logger.log(`Client connected: ${client.id}`);
    });

    this.broker.on('clientDisconnect', (client) => {
      this.logger.log(`Client disconnected: ${client.id}`);
    });
  }

  private async saveMessageToMongoDB(packet: any, client: any) {
    try {
      const { db: mongoDb, client } = await getMongoDb('carrot');
      // 저장할 토픽 패턴 정의
      const saveTopics = ['collar/prod/+/data'];

      // 토픽이 저장 대상인지 확인
      const shouldSave = saveTopics.some((pattern) =>
        this.matchTopic(pattern, packet.topic),
      );

      const deviceId: string = packet.topic.split('/')[2];

      if (!shouldSave) {
        return;
      }

      // 페이로드 파싱
      let parsedPayload: string;
      try {
        parsedPayload = JSON.parse(packet.payload.toString());
      } catch (e) {
        // JSON이 아닌 경우 문자열로 저장
        parsedPayload = packet.payload.toString();
      }

      console.log('parsedPayload', parsedPayload);

      // MongoDB에 저장
      const result = await mongoDb.collection('test').insertOne({
        id: deviceId,
        value: parsedPayload,
        timestamp: new Date(),
      });

      console.log('result', result);

      this.logger.log(`💾 Message saved to MongoDB: ${packet.topic}`);
    } catch (error) {
      this.logger.error(`❌ Failed to save message to MongoDB:`, error);
    }
  }

  private matchTopic(pattern: string, topic: string): boolean {
    // MQTT 와일드카드 패턴 매칭
    // + : 한 레벨 매칭, # : 모든 레벨 매칭
    const regexPattern = pattern
      .replace(/\+/g, '[^/]+')
      .replace(/#/g, '.*')
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(topic);
  }

  // 저장된 메시지 조회 메서드들
  async getMessagesByTopic(topic: string, limit: number = 100) {
    return this.mqttMessageModel
      .find({ topic })
      .sort({ receivedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getRecentMessages(limit: number = 50) {
    return this.mqttMessageModel
      .find()
      .sort({ receivedAt: -1 })
      .limit(limit)
      .exec();
  }

  async getMessagesByPattern(topicPattern: string, limit: number = 100) {
    // 정규식으로 토픽 패턴 검색
    const regexPattern = topicPattern
      .replace(/\+/g, '[^/]+')
      .replace(/#/g, '.*')
      .replace(/\//g, '\\/');

    return this.mqttMessageModel
      .find({ topic: { $regex: `^${regexPattern}$` } })
      .sort({ receivedAt: -1 })
      .limit(limit)
      .exec();
  }
}

function toStringStrict(v: unknown): string {
  if (typeof v === 'string') return v;
  if (Buffer.isBuffer(v)) return v.toString('utf8');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v ?? '');
}
