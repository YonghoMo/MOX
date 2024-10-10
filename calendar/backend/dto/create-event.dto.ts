/*
    DTO: Data Tranfer Object

    일정을 생성할 때 필요한 데이터를 정의
*/

export class CreateEventDto {
    title: string;         // 일정 제목
    startDate: Date;       // 일정 시작 날짜와 시간
    endDate: Date;         // 일정 종료 날짜와 시간
}
