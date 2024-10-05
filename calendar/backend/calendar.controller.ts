/*
    HTTP 요청을 처리하고
    클라이언트로부터 받은 요청을 Service로 전달
*/

import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    // 댓글 추가 API
    @Post('add-comment')
    async addComment(@Body() createCommentDto: CreateCommentDto) {
        return this.calendarService.addComment(createCommentDto);
    }

    // 특정 일정에 달린 댓글 조회 API
    @Get('comments/:eventId')
    async getComments(@Param('eventId') eventId: number) {
        return this.calendarService.getComments(eventId);
    }

    // 일정 추가 API
    @Post('add-event')
    async addEvent(@Body() createEventDto: CreateEventDto) {
        return this.calendarService.addEvent(createEventDto);
    }

    // 일정 업데이트 API
    @Patch('update-event/:id')
    async updateEvent(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto) {
        return this.calendarService.updateEvent(id, updateEventDto);
    }
}

