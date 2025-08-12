# Cloudflare Tunnel 설정 가이드

## 1. Cloudflare Tunnel 설치 및 설정

### cloudflared 설치 (macOS)

```bash
brew install cloudflared
```

### Cloudflare 로그인

```bash
cloudflared tunnel login
```

### 터널 생성

```bash
cloudflared tunnel create wanee-mqtt-tunnel
```

### 터널 설정 파일 생성

`~/.cloudflared/config.yml` 파일을 생성하고 다음 내용을 추가:

```yaml
tunnel: wanee-mqtt-tunnel
credentials-file: ~/.cloudflared/[터널ID].json

ingress:
  # MQTT over TCP (포트 8083)
  - hostname: wanee.telepodsee.com
    service: tcp://localhost:8083
  # HTTP API (포트 3000) - 선택사항
  - hostname: api.wanee.telepodsee.com
    service: http://localhost:3000
  # 기본 라우트
  - service: http_status:404
```

### DNS 설정

```bash
cloudflared tunnel route dns wanee-mqtt-tunnel wanee.telepodsee.com
cloudflared tunnel route dns wanee-mqtt-tunnel api.wanee.telepodsee.com
```

### 터널 실행

```bash
cloudflared tunnel run wanee-mqtt-tunnel
```

## 2. MQTT 클라이언트 테스트

### mosquitto 클라이언트로 테스트

```bash
# 설치
brew install mosquitto

# 메시지 발행 테스트
mosquitto_pub -h wanee.telepodsee.com -p 8083 -t "test/topic" -m "Hello from Cloudflare tunnel!"

# 메시지 구독 테스트
mosquitto_sub -h wanee.telepodsee.com -p 8083 -t "test/topic"
```

### Node.js MQTT 클라이언트로 테스트

```javascript
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://wanee.telepodsee.com:8083');

client.on('connect', () => {
  console.log('Connected to MQTT broker via Cloudflare tunnel');
  client.publish('test/topic', 'Hello from Node.js client!');
});
```

## 3. 환경변수 설정 (선택사항)

`.env` 파일 생성:

```bash
MQTT_PORT=8083
MQTT_URL=mqtt://wanee.telepodsee.com:8083
NODE_ENV=production
```

## 4. 서비스로 등록 (선택사항)

시스템 서비스로 등록하려면:

```bash
sudo cloudflared service install ~/.cloudflared/config.yml
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

## 5. 보안 설정 (권장)

### MQTT 인증 설정

현재 브로커는 인증 없이 동작합니다. 프로덕션 환경에서는 인증을 추가하는 것을 권장합니다.

### 방화벽 설정

```bash
# 로컬에서만 8083 포트 접근 허용 (Cloudflare tunnel을 통해서만 접근)
sudo ufw allow from 127.0.0.1 to any port 8083
```
