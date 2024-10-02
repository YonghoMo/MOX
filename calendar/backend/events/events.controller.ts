/*
    클라이언트로부터 일정과 관련된 요청을 받아 처리하는 역할
*/

import { Controller, Post, Body, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './create-event.dto.ts';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 일정 생성
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // 저장된 일정 조회
  @Get()
  async getAllEvents() {
    return this.eventsService.findAll();
  }
}
