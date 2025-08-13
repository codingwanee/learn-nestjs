import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { HelloController } from './hello/hello.controller';
import { AppService } from './app.service';
import { HelloService } from './hello/hello.service';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://pumpkin:DVmgapAUChv9Xwlb@pet-prod-seoul.zhirt5.mongodb.net/?retryWrites=true&w=majority&appName=pet-prod-seoul&ssl=true',
    ),
    MqttModule,
  ],
  controllers: [AppController, HelloController],
  providers: [AppService, HelloService],
})
export class AppModule {}
