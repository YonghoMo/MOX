/*
[ 캘린더 일정 데이터베이스 ]

CREATE DATABASE callendar_database;

CREATE TABLE CalendarEvents
(
    EventID INT PRIMARY KEY IDENTITY(1,1),  -- 고유한 일정 ID
    Title NVARCHAR(100),                    -- 일정 제목
    StartDate DATETIME,                     -- 일정 시작 시간
    EndDate DATETIME,                       -- 일정 종료 시간
    CreatedAt DATETIME DEFAULT GETDATE()    -- 일정 생성 시간
);

INSERT INTO CalendarEvents (Title, StartDate, EndDate)
VALUES ('캡스톤I 중간 과제 발표', '2024-04-15T15:00:00', '2024-04-15T20:00:00');

INSERT INTO CalendarEvents (Title, StartDate, EndDate)
VALUES ('캡스톤I 기말 과제 발표', '2024-06-03T00:00:00', '2024-06-01T23:59:59');

INSERT INTO CalendarEvents (Title, StartDate, EndDate)
VALUES ('캡스톤II 중간 과제 발표', '2024-10-14T00:00:00', '2024-10-14T23:59:59');

SELECT * FROM CalendarEvents;
*/


/*
[ 일정 코멘트 데이터베이스 ]

CREATE TABLE Comments (
    CommentID INT PRIMARY KEY IDENTITY(1,1),    -- 고유한 댓글 ID
    EventID INT,                                -- 댓글이 달린 일정의 ID
    UserName NVARCHAR(50),                      -- 댓글 작성자 이름
    CommentText NVARCHAR(500),                  -- 댓글 내용
    CreatedAt DATETIME DEFAULT GETDATE(),       -- 댓글 작성 시간
    FOREIGN KEY (EventID) REFERENCES CalendarEvents(EventID)  -- 외래 키: 일정과 연결
);

INSERT INTO Comments (EventID, UserName, CommentText)
VALUES (1, 'wooseong', 'This is first comment.');


SELECT c.CommentID, c.UserName, c.CommentText, c.CreatedAt
FROM Comments c
JOIN CalendarEvents e ON c.EventID = e.EventID
WHERE e.EventID = 1;
*/

/*DROP DATABASE calendar_database;*/

SELECT *
FROM Comments;