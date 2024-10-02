/* 
    비즈니스 로직을 처리하는 서비스 계층
    데이터베이스에 접근하여 데이터를 저장하거나 조회
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  // 일정 생성
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(event);
  }

  // 모든 일정 조회
  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }
}
