import { MongoClient } from 'mongodb';

const uri =
  (process.env.DATABASE_URL_MONGO as string) ||
  'mongodb+srv://pumpkin:DVmgapAUChv9Xwlb@pet-prod-seoul.zhirt5.mongodb.net/?retryWrites=true&w=majority&appName=pet-prod-seoul&ssl=true';
if (!uri) throw new Error('Missing DATABASE_URL_MONGO');

// 기본값은 pumpkin
const DEFAULT_DB_NAME = 'pumpkin';

// 커넥션 풀은 하나만 유지 (DB 이름에 따라 분기)
let cachedClient: MongoClient | null = null;

export async function getMongoDb(dbName = DEFAULT_DB_NAME) {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 50, // 병렬 작업이 많으면 더 늘릴 수 있음
      minPoolSize: 10,
      readPreference: 'primary', // secondary로 설정된 이유가 없다면 primary 권장
      socketTimeoutMS: 30000, // 30초 동안 서버와의 연결이 없으면 타임아웃
      heartbeatFrequencyMS: 60000, // 60초마다 서버와 연결 상태 확인
    });
    try {
      await cachedClient.connect();
      // console.log('MongoDB client connected');
    } catch (err) {
      console.error('Error connecting to MongoDB', err);
      throw err;
    }
  } else {
    try {
      // 연결 확인용 ping
      await cachedClient.db(dbName).command({ ping: 1 });
    } catch (err) {
      console.warn('⚠️ MongoClient disconnected, reconnecting...');
      try {
        await cachedClient.connect();
        console.log('Reconnected to MongoDB');
      } catch (reconnectErr) {
        console.error('Failed to reconnect to MongoDB', reconnectErr);
        throw reconnectErr;
      }
    }
  }

  const db = cachedClient.db(dbName);
  return { db, client: cachedClient };
}

export async function closeMongoConnection() {
  if (cachedClient) {
    try {
      await cachedClient.close();
      console.log('🧹 MongoDB client closed');
    } catch (err) {
      console.error('Error closing MongoDB connection', err);
    }
    console.log('🧹 MongoDB client closed');
  }
}
