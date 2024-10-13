let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentEventId = '';
const today = new Date();
const events = {}; // 일정을 저장할 객체
const comments = {}; // 각 일정별 댓글 저장 객체

const exerciseLibrary = [
    '런닝', '수영', '요가', '웨이트', '윗몸 일으키기', '크런치', '레그 레이즈', '플랭크',
    '에어 스쿼트', '바벨 백 스쿼트', '레그 프레스', '트레드밀'
];


/* 캘린더 생성 코드 */
function generateCalendar(month, year) {
    // 디버깅 로그
    console.log("Calendar generated for month: ", month, "year: ", year);

    const calendar = document.getElementById('calendar');
    if(!calendar) {
        console.error('캘린더 요소를 찾을 수 없습니다.');
        return;
    }

    // 캘린더 초기화
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
        else {
            console.log("No events for this date.")
        }

        calendar.innerHTML += `
            <div class="${dayClass}" data-date="${dateKey}" onclick="${eventList.length > 0 ? `openCommentModal('${eventList[0].id}')` : `openAddEventModal('${dateKey}')`}">
                <div class="date">${i}</div>
                ${eventText}
            </div>`;
    }
}


/* 일정 추가 모달 */
// 일정 추가 모달 열기
function openAddEventModal(dateKey) {
    // 모달에 날짜 값을 설정
    document.getElementById('event-date').value = dateKey;
    // 일정 추가 모달 열기
    const modal = new bootstrap.Modal(document.getElementById('addEventModal'));
    modal.show();
}
// 운동 종목을 체크박스로 추가
function populateExerciseCheckboxes() {
    const checkboxGroup = document.getElementById('exercise-checkbox-group');
    exerciseLibrary.forEach(exercise => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = exercise;
        checkbox.id = `exercise-${exercise}`;
        checkbox.classList.add('exercise-checkbox');
        
        const label = document.createElement('label');
        label.htmlFor = `exercise-${exercise}`;
        label.textContent = exercise;
        
        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(label);
        checkboxGroup.appendChild(document.createElement('br'));
    });
}
// 페이지 로드 시 체크박스 추가
document.addEventListener('DOMContentLoaded', populateExerciseCheckboxes);

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


/* 일정 삭제 기능 */
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


/* 댓글 모달 */
// 댓글 모달 열기
function openCommentModal(eventId) {
    // 현재 보고 있는 일정의 ID 설정
    currentEventId = eventId;
    const event = events[eventId];
    // 일정 데이터가 존재하는지 확인
    if (!event) {
        console.error('일정을 찾을 수 없습니다.');
        return; // 유효하지 않은 이벤트라면 모달을 열지 않음
    }
    
    // 모달 일정 제목과 정보 설정
    const commentModalLabel = document.getElementById('commentModalLabel');
    const eventDateTime = document.getElementById('event-date-time');
    const eventTime = document.getElementById('event-time');  // 시간 표시용 요소
    const selectedExercisesList = document.getElementById('selected-exercises-list');
    const selectedExercises = getSelectedExercises();

    if (commentModalLabel) {    // 제목 설정
        commentModalLabel.innerText = event.title;
    } else {
        console.error("commentModalLabel 요소를 찾을 수 없습니다.");
    }

    if (eventDateTime) {        // 일정 날짜 설정
        eventDateTime.innerText = event.date;
    } else {
        console.error("event-date-time 요소를 찾을 수 없습니다.");
    }

    // 일정 시간이 있다면 시간도 추가로 표시
    if (eventTime && event.startTime && event.endTime) {
        eventTime.innerText = `${event.startTime} - ${event.endTime}`;  // 일정 시간 표시
    } else {
        eventTime.innerText = "";  // 시간 정보가 없을 경우 비워둠
    }

     // 선택된 운동 이름 표시
    if (selectedExercisesList) {
        if (selectedExercises && selectedExercises.length > 0) {
            selectedExercisesList.innerText = selectedExercises.join(', ');  // 운동 이름을 표시
        } else {
            selectedExercisesList.innerText = "선택된 운동이 없습니다.";   // 선택된 운동 없을 때 비워둠
        }
    } else {
        console.error("selected-exercises-list 요소를 찾을 수 없습니다.");
    }
    
    // 운동 세트 정보 추가
    const settingsContainer = document.getElementById('exercise-amount-settings');
    if(settingsContainer) {
        const settingsContainer = document.getElementById('exercise-amount-settings');
        settingsContainer.innerHTML = '';   // 기존 설정 필드 초기화
    } else {
        console.error('exercise-amount-settings 요소를 찾을 수 없습니다.');
        return;
    }

    selectedExercises.forEach((exercise) => {
        const exerciseBox = document.createElement('div');
        exerciseBox.classList.add('exercise-box');

        // 운동 이름 표시
        const exerciseTitle = document.createElement('h5');
        exerciseTitle.textContent = exercise;
        exerciseBox.appendChild(exerciseTitle);

        // 세트와 반복 횟수 입력 테이블
        const setTable = document.createElement('table');
        const setHeader = `<tr><th>세트</th><th>횟수</th><th>완료</th></tr>`;
        setTable.innerHTML = setHeader;

        // 기본 세트 추가
        addSet(setTable, exercise);

        // 세트 추가/삭제 버튼
        const setButtonsContainer = document.createElement('div');
        setButtonsContainer.classList.add('d-flex', 'justify-content-between', 'mt-3');

        const addSetButton = document.createElement('button');
        addSetButton.classList.add('btn', 'btn-primary');
        addSetButton.textContent = '세트 추가';
        addSetButton.onclick = () => addSet(setTable, exercise);

        const removeSetButton = document.createElement('button');
        removeSetButton.classList.add('btn', 'btn-secondary');
        removeSetButton.textContent = '세트 삭제';
        removeSetButton.onclick = () => removeSet(setTable);

        setButtonsContainer.appendChild(addSetButton);
        setButtonsContainer.appendChild(removeSetButton);

        // 박스 추가
        exerciseBox.appendChild(setTable);
        exerciseBox.appendChild(setButtonsContainer);
        settingsContainer.appendChild(exerciseBox);
    });

    // 모달 열기
    const modalElement = document.getElementById('commentModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();  // 모달을 화면에 표시
    } else {
        console.error('commentModal 요소를 찾을 수 없습니다.');
    }
}
// 세트 추가 기능 (수정됨)
function addSet(setTable, exercise) {
    const setNumber = setTable.querySelectorAll('tr').length; // 세트 번호 계산
    const setRow = document.createElement('tr');

    setRow.innerHTML = `
        <td>${setNumber}</td>
        <td><input type="number" id="reps-${exercise}-${setNumber}" placeholder="횟수" /></td>
        <td><input type="checkbox" id="done-${exercise}-${setNumber}" /></td>
    `;
    setTable.appendChild(setRow);
}
// 세트 삭제 기능 (수정됨)
function removeSet(setTable) {
    const sets = setTable.querySelectorAll('tr');
    if (sets.length > 1) {  // 헤더 제외하고 세트가 있는 경우에만 실행
        const lastSetRow = sets[sets.length - 1];  // 마지막 세트 가져오기
        const doneCheckbox = lastSetRow.querySelector('input[type="checkbox"]');  // 완료 체크박스 찾기

        if (doneCheckbox && !doneCheckbox.checked) {
            // 체크박스가 체크되지 않은 경우에만 세트 삭제
            setTable.removeChild(lastSetRow);
        }
    }
}
// 선택한 운동 종목 가져오기
function getSelectedExercises() {
    const checkboxes = document.querySelectorAll('.exercise-checkbox:checked');
    const selectedExercises = [];
    checkboxes.forEach(checkbox => {
        selectedExercises.push(checkbox.value);
    });
    return selectedExercises;
}
// 코멘트 모달 닫기
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
// 코멘트 추가하기
function addComment() {
    //const eventKey = document.getElementById('event-date-time').innerText.split(' ')[0];
    const commentInput = document.getElementById('comment-input');
    const newComment = commentInput.value.trim();

    if (newComment !== '') {
        // 현재 일정 ID에 대한 댓글이 없으면 배열 생성
        if (!comments[currentEventId]) {
            comments[currentEventId] = []; 
        }

        comments[currentEventId].push(newComment); // 새 댓글 추가
        updateCommentList(currentEventId); // 댓글 리스트 업데이트
        commentInput.value = ''; // 입력 필드 비우기
    }
    else {
        alert("댓글을 입력하세요.");
    }
}
// 코멘트 리스트 업데이트하기
function updateCommentList(eventId) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = ''; // 기존 리스트 비우기

    if (comments[eventId] && comments[eventId].length > 0) {
        // 댓글 있는 경우 모달의 댓글 리스트에 추가
        comments[eventId].forEach((comment) => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = comment;
            commentList.appendChild(listItem);
        });
    } else {
        // 댓글 없는 경우 기본 메세지 표시
        const noComments = document.createElement('li');
        noComments.classList.add('list-group-item');
        noComments.textContent = '아직 댓글이 없습니다.';
        commentList.appendChild(noComments);
    }
}


// 캘린더 기본 기능
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

// 패이지 로드 시 캘린더 생성
document.addEventListener('DOMContentLoaded', () => {
    console.log("페이지 로드 완료. 캘린더 생성 시작.");
    generateCalendar(currentMonth, currentYear); // 캘린더 생성
});

