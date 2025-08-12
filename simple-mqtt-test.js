const mqtt = require('mqtt');

console.log('Testing WebSocket MQTT...');

// WebSocket 연결 (포트 8083)
const client = mqtt.connect('wss://wanee.telepodsee.com');
console.log('client', client);
// const client = mqtt.connect('ws://localhost:8083');

client.on('connect', () => {
  console.log('✅ Connected to WebSocket MQTT');

  // 구독
  client.subscribe('mqtt/test', (err) => {
    if (!err) console.log('📡 Subscribed to mqtt/test');
  });

  // 메시지 발행
  client.publish('mqtt/test', 'hello over ws');
  console.log('📤 Published message');

  // 3초 후 종료
  setTimeout(() => client.end(), 3000);
});

client.on('message', (topic, message) => {
  console.log(`📨 Received: ${topic} -> ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('❌ Error:', err.message);
});
