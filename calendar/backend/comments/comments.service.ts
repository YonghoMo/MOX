/*  
  댓글 관련 비즈니스 로직을 처리하고, 
  데이터베이스에 댓글을 저장하거나 조회하는 서비스 계층
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
    ) {}

    // 댓글 추가
    async add(createCommentDto: CreateCommentDto): Promise<Comment> {
        const comment = this.commentsRepository.create(createCommentDto);
        return this.commentsRepository.save(comment);
    }

    // 특정 일정의 댓글 조회
    async findByEvent(eventId: number): Promise<Comment[]> {
        return this.commentsRepository.find({ where: { event: eventId } });
    }
}
