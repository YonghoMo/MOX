/*
    댓글 테이블과 매핑되는 엔티티
*/

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    commentId: number;        // 댓글 고유 ID

    @Column()
    eventId: number;          // 댓글이 달린 일정의 ID (외래 키)

    @Column()
    userName: string;         // 댓글 작성자 이름

    @Column({ length: 500 })
    commentText: string;      // 댓글 내용

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;          // 댓글 작성 시간
}
