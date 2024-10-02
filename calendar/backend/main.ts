/*
  Nest.js 애플리케이션의 시작점
  서버를 실행하는 역할을 담당
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000); // 서버를 3000 포트에서 실행
}
bootstrap();