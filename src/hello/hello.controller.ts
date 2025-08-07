import { Controller, Get, Post, Body } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloDto } from './dto/hello.dto';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): string {
    return this.helloService.getHello();
  }

  @Post()
  postHello(@Body() helloDto: HelloDto): string {
    return this.helloService.getPersonalHello(helloDto.name);
  }
}
