/*
  Comment 엔터티를 정의하여 
  데이터베이스에서 댓글 데이터를 관리
*/

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from '../events/event.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Event, (event) => event.comments)
  event: Event;
}
