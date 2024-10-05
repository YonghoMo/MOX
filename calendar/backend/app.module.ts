/*
  모든 Controller, Service, Entity는 이 파일에 등록되어야
  Nest.js가 이를 인식해 사용할 수 있음
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { Comment } from './calendar/entities/comment.entity';
import { CalendarEvent } from './calendar/entities/calendar-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CalendarEvent])],  // 엔티티 등록
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class AppModule {}
