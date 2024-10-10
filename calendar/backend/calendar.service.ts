/*
    비즈니스 로직과 데이터베이스와의 상호작용 수행
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
    export class CalendarService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    
        @InjectRepository(CalendarEvent)
        private eventRepository: Repository<CalendarEvent>,
    ) {}

    // 댓글 추가 로직
    async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
        const comment = this.commentRepository.create(createCommentDto);
        return await this.commentRepository.save(comment);
    }

    // 특정 일정의 댓글 조회 로직
    async getComments(eventId: number): Promise<Comment[]> {
        return await this.commentRepository.find({ where: { eventId } });
    }

    // 일정 추가 로직
    async addEvent(createEventDto: CreateEventDto): Promise<CalendarEvent> {
        const event = this.eventRepository.create(createEventDto);
        return await this.eventRepository.save(event);
    }

    // 일정 업데이트 로직
    async updateEvent(eventId: number, updateEventDto: UpdateEventDto): Promise<CalendarEvent> {
        await this.eventRepository.update(eventId, updateEventDto);
        return await this.eventRepository.findOne(eventId);
    }
}

