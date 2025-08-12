<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with MQTT message receiving capabilities using Aedes broker.

## Features

- **MQTT Broker**: Built-in Aedes MQTT broker for receiving and processing MQTT messages
- **Message Handling**: Smart message routing with wildcard pattern support
- **Multiple Endpoints**: REST API endpoints and MQTT message handlers
- **Real-time Processing**: Process collar data, sensor readings, and custom messages in real-time

## MQTT Configuration

This application includes an embedded MQTT broker using Aedes that listens on port 1883 by default. The broker can receive and process messages from MQTT clients.

### Supported Message Patterns

- `mqtt/test` - Test messages with automatic response
- `collar/prod/+/data` - Collar device data from any device ID
- `sensor/+/+` - Sensor data (temperature, humidity, motion) from any sensor
- `#` - Global message handler for debugging

### Environment Variables

```bash
MQTT_BROKER_PORT=8083  # Port for Aedes MQTT broker (TCP)
MQTT_WS_PORT=8083      # Port for Aedes MQTT broker (WebSocket)
MQTT_URL=mqtt://localhost:8083  # MQTT client connection URL
MQTT_CLIENT_ID=learn-nestjs_xxx  # MQTT client ID (auto-generated if not set)
```

## Project setup

```bash
# Using bun (recommended)
$ bun install

# Or using yarn
$ yarn install
```

## Compile and run the project

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Testing MQTT Functionality

After starting the application, you can test the MQTT message receiving functionality:

### WebSocket MQTT Testing (Recommended)

```bash
# Run the WebSocket MQTT test client
$ node test-mqtt-websocket-client.js
```

This will:

1. Connect to the embedded MQTT broker via WebSocket (port 8083)
2. Test both local and Cloudflare tunnel connections
3. Send various test messages to different topics
4. Show the responses and processing results
5. Demonstrate the WebSocket MQTT capabilities

### Traditional TCP MQTT Testing

```bash
# Run the traditional TCP MQTT client
$ node test-mqtt-client.js
```

### Manual Testing with MQTT Clients

#### Local WebSocket Testing

```javascript
// Using Node.js MQTT library with WebSocket
const mqtt = require('mqtt');
const client = mqtt.connect('ws://localhost:8083');

client.on('connect', () => {
  client.publish('mqtt/test', '{"message": "Hello WebSocket MQTT!"}');
});
```

#### Traditional TCP Testing

```bash
# Test basic message (TCP)
mosquitto_pub -h localhost -p 8083 -t "mqtt/test" -m '{"message": "Hello World"}'

# Test collar data (TCP)
mosquitto_pub -h localhost -p 8083 -t "collar/prod/device123/data" -m '{"batteryLevel": 85, "gpsLocation": {"lat": 37.5, "lng": 126.9}}'

# Test sensor data (will trigger temperature alert)
mosquitto_pub -h localhost -p 8083 -t "sensor/temperature/sensor001" -m '{"temperature": 35.5}'
```

#### Cloudflare Tunnel WebSocket Testing

```javascript
// Using WebSocket through Cloudflare tunnel
const client = mqtt.connect('ws://wanee.telepodsee.com');
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
