/*
    클라이언트로부터 받은 댓글 데이터를 
    서버에서 유효성 검사를 수행하여 처리하는 
    데이터 전송 객체(DTO)
*/

export class CreateCommentDto {
    readonly eventId: number;
    readonly content: string;
}