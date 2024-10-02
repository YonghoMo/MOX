/*
  클라이언트로부터 댓글과 관련된 요청을 받아 처리하는 역할 
  예: 댓글 생성, 댓글 조회 등
*/

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 추가
  @Post()
  async addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.add(createCommentDto);
  }

  // 특정 일정의 댓글 조회
  @Get(':eventId')
  async getComments(@Param('eventId') eventId: number) {
    return this.commentsService.findByEvent(eventId);
  }
}
