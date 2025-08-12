import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { createServer } from 'net';
import { createServer as createHttpServer } from 'http';
import { WebSocketServer } from 'ws';

const aedes = require('aedes');
const websocketStream = require('websocket-stream');

@Injectable()
export class MqttService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MqttService.name);
  private broker: any;
  private tcpServer: any;
  private httpServer: any;
  private wsServer: any;

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

    // WebSocket Server
    this.httpServer = createHttpServer();
    this.wsServer = new WebSocketServer({ server: this.httpServer });

    this.wsServer.on('connection', (ws) => {
      const stream = websocketStream(ws);
      this.broker.handle(stream);
      this.logger.log('WebSocket MQTT client connected');
    });

    this.httpServer.listen(8083, () => {
      this.logger.log('MQTT Broker (WebSocket) is running on port 8083');
    });

    // Handle messages
    this.broker.on('publish', (packet, client) => {
      if (client) {
        this.logger.log(
          `Message received: ${packet.topic} -> ${packet.payload.toString()}`,
        );
      }
    });

    this.broker.on('client', (client) => {
      this.logger.log(`Client connected: ${client.id}`);
    });

    this.broker.on('clientDisconnect', (client) => {
      this.logger.log(`Client disconnected: ${client.id}`);
    });
  }
}
