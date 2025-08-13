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

### Traditional TCP MQTT Testing

```bash
# Run the traditional TCP MQTT client
$ node test-mqtt-client.js
```

### Manual Testing with MQTT Clients

#### Traditional TCP Testing

```bash
# Test basic message (TCP)
mosquitto_pub -h localhost -p {portNumber} -t "mqtt/test" -m '{"message": "Hello World"}'

# Test collar data (TCP)
mosquitto_pub -h 0.tcp.jp.ngrok.io -p {portNumber} \
-t "collar/prod/TPA000001/data" \
-m "this is dummy value" \
-u user -P pass -q 1
```
