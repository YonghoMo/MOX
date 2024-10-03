/*
  모든 모듈을 가져와 전체 애플리케이션을 구성하는 메인 모듈
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ //TypeORM와 데이터베이스 연결 시 설정
      type: 'mysql',
      host: 'localhost',
      port: 3306, // MySQL 기본 포트
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  // true로 설정하면 애플리케이션 시작 시 엔터티에 맞춰 테이블이 자동으로 생성됨
    }),
    EventsModule, // 일정 관련 모듈
    CommentsModule,  // 댓글 관련 모듈
  ],
})
export class AppModule {}
