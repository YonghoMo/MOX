/*
    일정 테이블과 매핑되는 엔티티
*/

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    eventId: number;       // 일정 고유 ID

    @Column()
    title: string;         // 일정 제목

    @Column()
    startDate: Date;       // 일정 시작 날짜와 시간

    @Column()
    endDate: Date;         // 일정 종료 날짜와 시간

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;       // 일정 생성 시간
}
