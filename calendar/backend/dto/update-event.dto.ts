/*
    일정을 업데이트할 때 사용
    일부 필드만 업데이트 할 수 있도록 선택적 필드로 구성
*/

export class UpdateEventDto {
    title: string;       // 일정 제목 (선택적 필드)
    startDate?: Date;     // 일정 시작 날짜와 시간 (선택적 필드)
    endDate?: Date;       // 일정 종료 날짜와 시간 (선택적 필드)
}