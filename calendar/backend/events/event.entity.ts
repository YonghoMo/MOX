/*
    데이터베이스 테이블의 구조를 정의하는 엔티티
    TypeORM을 사용하여 Event 테이블을 정의함
*/

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comment } from '../comments/comment.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @OneToMany(() => Comment, (comment) => comment.event)
  comments: Comment[];
}
