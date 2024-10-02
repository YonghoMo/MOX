/*
    해당 모듈을 정의
    일정과 관련된 컨트롤러, 서비스, 엔터티 등을 묶어 
    하나의 모듈로 구성
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [EventsController],
    providers: [EventsService],
})
export class EventsModule {}


