import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
  buildMqttResponse(topic: string, payload: unknown, qos: number): string {
    const serialized = this.safeStringify(payload);
    return `Received on ${topic}: ${serialized} (qos=${qos})`;
  }

  logEvent(topic: string, payload: unknown): void {
    // eslint-disable-next-line no-console
    console.log('[MQTT]', topic, this.safeStringify(payload));
  }

  private safeStringify(value: unknown): string {
    try {
      return typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
