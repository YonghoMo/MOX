/*
    클라이언트로부터 받은 일정 데이터의 구조를 정의하고 
    유효성 검사를 수행하는 데이터 전송 객체(DTO)
*/

export class CreateEventDto {
    readonly title: string;
    readonly start: string;
    readonly end: string;
}  