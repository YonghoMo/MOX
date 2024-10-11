let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentEventId = '';
const today = new Date();
const events = {}; // 일정을 저장할 객체
const comments = {}; // 각 일정별 댓글 저장 객체

// 캘린더 생성 코드 수정
function generateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const firstDay = new Date(year, month).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    document.getElementById('month-year').innerText = `${year}-${String(month + 1).padStart(2, '0')}`;

    for (let i = 0; i < firstDay; i++) {
        calendar.innerHTML += '<div class="day empty"></div>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let dayClass = 'day';
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

        if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
            dayClass += ' today';
        }

        // 일정 표시 (삭제 버튼 제외)
        let eventText = '';
        const eventList = Object.values(events).filter(event => event.date === dateKey);
        if (eventList.length > 0) {
            eventList.forEach(event => {
                eventText += `
                    <div class="event" onclick="openCommentModal(${event.id})">
                        ${event.title} <!-- 삭제 버튼을 캘린더에서 숨기기 -->
                    </div>`;
            });
        }

        calendar.innerHTML += `
            <div class="${dayClass}" data-date="${dateKey}" onclick="${eventList.length > 0 ? `openCommentModal('${eventList[0].id}')` : `openAddEventModal('${dateKey}')`}">
                <div class="date">${i}</div>
                ${eventText}
            </div>`;
    }
}

function openAddEventModal(dateKey) {
    // 모달에 날짜 값을 설정
    document.getElementById('event-date').value = dateKey;
    // 일정 추가 모달 열기
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
}

function saveEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (title && date) {
        // 고유 ID 생성
        const eventId = Date.now();

        // 일정 데이터를 저장
        events[eventId] = { id: eventId, title, date, startTime, endTime };

        // 캘린더 업데이트
        generateCalendar(currentMonth, currentYear);

        // 모달 창 닫기
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();
    } else {
        alert('일정 제목과 날짜는 필수입니다.');
    }
}

function deleteEvent() {
    if (confirm('정말 이 일정을 삭제하시겠습니까?')) {
        // 현재 보고 있는 일정 삭제
        delete events[currentEventId]; // 전역 변수로 저장된 일정 ID를 사용
        generateCalendar(currentMonth, currentYear); // 캘린더 갱신

        // 모달 닫기
        const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
        modal.hide();

        // 강제적으로 모달과 백드롭 제거
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove()); // 백드롭 제거
        document.body.classList.remove('modal-open'); // 모달 오픈 상태 클래스 제거
        document.body.style = ''; // body에 적용된 스타일 초기화
    }
}

function openCommentModal(eventId) {
    currentEventId = eventId; // 현재 보고 있는 일정의 ID 저장
    const event = events[eventId];

    // 모달 창에 일정 제목 및 시간 표시
    if (event) {
        document.getElementById('commentModalLabel').innerText = event.title;
        
        // 일정 날짜와 시간 표시
        document.getElementById('event-date-time').innerText = `${event.date} ${event.startTime} - ${event.endTime}`;
    }

    // 댓글 리스트 업데이트
    updateCommentList(eventId);

    // 댓글 모달 열기
    const modal = new bootstrap.Modal(document.getElementById('commentModal'));
    modal.show();
}

function closeCommentModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));

    if (modal) {
        modal.hide(); // 모달 닫기
    }

    // 강제적으로 모달과 백드롭 제거
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove()); // 백드롭 제거
    document.body.classList.remove('modal-open'); // 모달 오픈 상태 클래스 제거
    document.body.style = ''; // body에 적용된 스타일 초기화
}

function addComment() {
    const eventKey = document.getElementById('event-date-time').innerText.split(' ')[0];
    const commentInput = document.getElementById('comment-input');
    const newComment = commentInput.value.trim();

    if (newComment !== '') {
        if (!comments[eventKey]) {
            comments[eventKey] = []; // 해당 일정에 대한 댓글이 없으면 배열 생성
        }

        comments[eventKey].push(newComment); // 새 댓글 추가
        updateCommentList(eventKey); // 댓글 리스트 업데이트
        commentInput.value = ''; // 입력 필드 비우기
    }
}

function updateCommentList(eventKey) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = ''; // 기존 리스트 비우기

    if (comments[eventKey] && comments[eventKey].length > 0) {
        comments[eventKey].forEach((comment) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = comment;
            commentList.appendChild(listItem);
        });
    } else {
        const noComments = document.createElement('li');
        noComments.classList.add('list-group-item');
        noComments.textContent = '아직 댓글이 없습니다.';
        commentList.appendChild(noComments);
    }
}

document.getElementById('todayBtn').addEventListener('click', () => {
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// 처음 페이지 로드 시 캘린더 생성
generateCalendar(currentMonth, currentYear);