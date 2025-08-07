import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    return 'Hello from HelloService!';
  }

  getPersonalHello(name: string): string {
    return `Hello, ${name}!`;
  }
}
