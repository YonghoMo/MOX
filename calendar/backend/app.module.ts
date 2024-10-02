/*
  모든 모듈을 가져와 전체 애플리케이션을 구성하는 메인 모듈
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 혹은 'postgres' 사용 가능
      host: 'localhost',
      port: 3306, // MySQL의 경우
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    EventsModule,
    CommentsModule,
  ],
})
export class AppModule {}
