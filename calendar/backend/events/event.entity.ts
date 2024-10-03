/*
    데이터베이스 테이블의 구조를 정의하는 엔티티
    TypeORM을 사용하여 Event 테이블을 정의함
*/

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number; // 기본 키 (자동 생성)

  @Column()
  title: string;  // 일정 제목

  @Column()
  start: string;  // 시작 날짜, 시간

  @Column()
  end: string;  // 종료 날짜, 시간

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];  //// 하나의 일정에 여러 개의 댓글이 달릴 수 있음
}
