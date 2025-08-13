import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MqttMessageDocument = MqttMessage & Document;

@Schema({
  collection: 'test', // 컬렉션 이름 명시적 지정
  timestamps: true,
})
export class MqttMessage {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  value: any;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MqttMessageSchema = SchemaFactory.createForClass(MqttMessage);
