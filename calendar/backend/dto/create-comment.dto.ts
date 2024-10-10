/*
    DTO: Data Tranfer Object
    
    댓글 작성에 필요한 데이터를 정의
*/

export class CreateCommentDto {
    eventId: number;      // 해당 일정의 ID (외래 키)
    userName: string;     // 작성자 이름
    commentText: string;  // 댓글 내용
    createdAt?: Date;     // 댓글 작성 시간 (생략 가능, 기본값으로 현재 시간)
}