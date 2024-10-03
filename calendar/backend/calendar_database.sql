CREATE DATABASE callendar_database;

CREATE TABLE CalendarEvents
(
    EventID INT PRIMARY KEY IDENTITY(1,1),
    -- 고유한 일정 ID
    Title NVARCHAR(100),
    -- 일정 제목
    StartDate DATETIME,
    -- 일정 시작 시간
    EndDate DATETIME,
    -- 일정 종료 시간
    CreatedAt DATETIME DEFAULT GETDATE()
    -- 일정 생성 시간
);

--INSERT INTO CalendarEvents (Title, StartDate, EndDate)
--VALUES ('캡스톤II 중간 과제 발표', '2024-10-14T00:00:00', '2024-10-14T23:59:59');

--INSERT INTO CalendarEvents (Title, StartDate, EndDate)
--VALUES ('캡스톤II 중간 과제 발표', '2024-10-14T00:00:00', '2024-10-14T23:59:59');

--INSERT INTO CalendarEvents (Title, StartDate, EndDate)
--VALUES ('캡스톤II 중간 과제 발표', '2024-10-14T00:00:00', '2024-10-14T23:59:59');
