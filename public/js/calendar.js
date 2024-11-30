let userId;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0: 1월, 11: 12월

// 페이지 로드 시 서버에서 세션을 통해 userId를 받아옴
window.onload = function () {
    axios
        .get("/api/users/me")
        .then((response) => {
            userId = response.data.userId;
            generateCalendar(); // 달력 생성
        })
        .catch((error) => {
            console.error("User ID를 불러오는 중 오류가 발생했습니다.", error);
            alert("로그인이 필요합니다.");
            window.location.href = "/login.html"; // 로그인 페이지로 이동
        });
};

// 달력 생성 함수
function generateCalendar(year = currentYear, month = currentMonth) {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // 기존 달력 초기화

    const today = new Date(); // 오늘 날짜
    const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    document.getElementById("month-year").textContent = `${year}년 ${month + 1}월`;

    // 빈 셀 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day");
        calendar.appendChild(emptyCell);
    }

    // 날짜 셀 생성
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");

        const dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.textContent = day;

        // 일정 컨테이너 추가
        const eventsContainer = document.createElement("div");
        eventsContainer.classList.add("events-container");

        dayCell.appendChild(dayNumber);
        dayCell.appendChild(eventsContainer);

        // 오늘 날짜 강조
        if (isCurrentMonth && day === today.getDate()) {
            dayCell.style.backgroundColor = '#ffffcc'; // 옅은 노란색
        }

        calendar.appendChild(dayCell);
    }

    loadEvents(); // 일정 데이터 불러오기
}

// 이전 달로 이동
document.getElementById('prevMonthBtn').addEventListener('click', function () {
    currentMonth--; // 이전 달로 이동
    if (currentMonth < 0) {
        currentMonth = 11; // 12월로 변경
        currentYear--; // 연도 감소
    }
    generateCalendar(currentYear, currentMonth); // 달력 다시 생성
});

// 다음 달로 이동
document.getElementById('nextMonthBtn').addEventListener('click', function () {
    currentMonth++; // 다음 달로 이동
    if (currentMonth > 11) {
        currentMonth = 0; // 1월로 변경
        currentYear++; // 연도 증가
    }
    generateCalendar(currentYear, currentMonth); // 달력 다시 생성
});

document.getElementById('todayBtn').addEventListener('click', function () {
    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth(); // 현재 월로 변경
    generateCalendar(currentYear, currentMonth); // 오늘 날짜로 달력 다시 생성
});

// 운동 종목 불러오기
async function loadExercises() {
    const exerciseListContainer = document.getElementById('exercise-list-container');

    try {
        // 운동 종목을 가져오는 API 호출
        const response = await fetch('/api/exercises');
        const exercises = await response.json();

        // 운동 종목을 체크박스 형식으로 추가
        exerciseListContainer.innerHTML = ''; // 기존 내용 제거
        exercises.forEach(exercise => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `exercise-${exercise._id}`;
            checkbox.name = 'exercises';
            checkbox.value = exercise._id;

            const label = document.createElement('label');
            label.htmlFor = `exercise-${exercise._id}`;
            label.innerText = `${exercise.name} (${exercise.category})`;

            const div = document.createElement('div');
            div.appendChild(checkbox);
            div.appendChild(label);
            exerciseListContainer.appendChild(div);
        });
    } catch (error) {
        console.error('운동 종목 불러오기 중 오류 발생:', error);
    }
}

// 모달이 열릴 때 운동 종목 불러오기
document.getElementById('addEventModal').addEventListener('shown.bs.modal', loadExercises);

// 일정 저장
function saveEvents() {
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;

    // 사용자가 선택한 운동 종목
    const checkedExercises = document.querySelectorAll('input[name="exercises"]:checked');
    const exercises = Array.from(checkedExercises).map(checkbox => checkbox.value);

    if (title && date && startTime && endTime) {
        const events = [
            {
                title,
                date,
                startTime,
                endTime,
                exercises,
                userId,
            },
            // 필요시 여러 일정을 여기에 추가 가능
        ];

        axios
            .post("/api/events/bulk", { events })
            .then((response) => {
                if (response.data.success) {
                    alert("일정이 저장되었습니다.");
                    generateCalendar(); // 저장 후 달력 새로고침

                    // 모달 닫기
                    const addEventModal = bootstrap.Modal.getInstance(document.getElementById("addEventModal"));
                    addEventModal.hide();
                } else {
                    alert("일정 저장에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("일정 저장 중 오류 발생:", error);
                alert("일정 저장 중 오류가 발생했습니다.");
            });
    } else {
        alert("모든 필드를 입력해주세요.");
    }
}

// 일정 삭제
function deleteEvent(eventId) {
    axios
        .delete(`/api/events/${eventId}`)
        .then((response) => {
            if (response.data.success) {
                alert("일정이 삭제되었습니다.");
                generateCalendar(); // 삭제 후 일정 새로고침
            } else {
                alert("일정 삭제에 실패했습니다.");
            }
        })
        .catch((error) => {
            console.error("일정 삭제 중 오류가 발생했습니다.");
        });
}

// 서버에서 일정 불러오기
function loadEvents() {
    axios
        .get(`/api/events?userId=${userId}`)
        .then((response) => {
            const events = response.data.events;
            displayEvents(events);
        })
        .catch((error) => {
            console.error("일정 불러오기 중 오류가 발생했습니다.", error);
            alert("일정 불러오기 중 오류가 발생했습니다.");
        });
}

// 일정 달력에 표시 및 클릭 시 모달로 상세 정보 보기
function displayEvents(events) {
    const dayCells = document.querySelectorAll(".day");

    events.forEach((event) => {
        const eventDate = new Date(event.date);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();

        dayCells.forEach((cell) => {
            const dayNumber = cell.querySelector(".day-number");

            // 날짜와 연도, 월이 모두 일치하는 셀에만 일정 추가
            if (
                dayNumber &&
                parseInt(dayNumber.textContent) === eventDay &&
                eventYear === currentYear &&
                eventMonth === currentMonth
            ) {
                let eventsContainer = cell.querySelector(".events-container");
                if (!eventsContainer) {
                    eventsContainer = document.createElement("div");
                    eventsContainer.classList.add("events-container");
                    cell.appendChild(eventsContainer);
                }

                // PC용 제목 추가
                const eventTitle = document.createElement("div");
                eventTitle.classList.add("event-title");
                if (event.isFriendEvent) {
                    eventTitle.classList.add("friend-event");
                }
                eventTitle.textContent = event.title;
                eventTitle.onclick = () => showEventDetails(event);

                // 모바일용 동그라미 추가
                const eventCircle = document.createElement("div");
                eventCircle.classList.add("event-circle");
                if (event.isFriendEvent) {
                    eventCircle.classList.add("friend-event-circle");
                }
                eventCircle.onclick = () => showEventDetails(event);

                // 두 가지 UI 요소를 모두 추가
                eventsContainer.appendChild(eventTitle);
                eventsContainer.appendChild(eventCircle);
            }
        });
    });
}

// 댓글 저장 기능
function saveComment(eventId) {
    const newComment = document.getElementById("new-comment").value; // 댓글 입력값

    if (newComment) {
        // 서버에 댓글 저장 요청
        axios.post(`/api/events/${eventId}/comments`, {
            userId: userId, // 현재 로그인한 사용자 ID
            comment: newComment // 새로운 댓글
        })
            .then((response) => {
                if (response.data.success) {
                    alert("댓글이 저장되었습니다.");
                    loadComments(eventId); // 댓글 목록 새로고침
                    document.getElementById("new-comment").value = ''; // 댓글 입력창 초기화
                } else {
                    alert("댓글 저장에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("댓글 저장 중 오류가 발생했습니다.", error);
                alert("댓글 저장 중 오류가 발생했습니다.");
            });
    } else {
        alert("댓글을 입력하세요.");
    }
}


// 댓글 불러오기 기능
function loadComments(eventId) {
    axios.get(`/api/events/${eventId}/comments`)
        .then((response) => {
            const commentsList = document.getElementById("comments-list");
            commentsList.innerHTML = ""; // 기존 댓글 초기화
            response.data.comments.forEach((comment) => {
                const commentItem = document.createElement("li");
                commentItem.textContent = `${comment.nickname}: ${comment.text}`; // 닉네임과 댓글 내용 표시
                commentsList.appendChild(commentItem);
            });
        })
        .catch((error) => {
            console.error("댓글 불러오기 중 오류가 발생했습니다.", error);
        });
}

// 색상 변경 핸들러 함수
function handleColorChange(eventId) {
    const colorPicker = document.getElementById("event-color-picker");
    const selectedColor = colorPicker.value;

    // 이벤트 제목 요소가 존재하는지 먼저 확인
    const eventTitleElement = document.getElementById("viewEventTitle");
    if (eventTitleElement) {
        const eventId = eventTitleElement.dataset.eventId; // 안전하게 이벤트 ID 가져오기

        // 로컬 스토리지에 선택한 색상 저장
        localStorage.setItem(`eventColor_${eventId}`, selectedColor);

        // 변경된 색상을 화면에 적용
        applyEventColor(eventId, selectedColor);
    } else {
        console.error("이벤트 제목 요소를 찾을 수 없습니다.");
    }
}
// 색상 선택 시 이벤트 리스너 추가
document.getElementById("event-color-picker").addEventListener("input", handleColorChange);

// 일정 상세 정보 모달에 표시
async function showEventDetails(event) {
    const eventTitleElement = document.getElementById("viewEventTitle");

    // 제목과 함께 data-event-id 속성에 eventId를 저장
    eventTitleElement.textContent = event.title;
    eventTitleElement.setAttribute('data-event-id', event._id);  // 여기서 data-event-id에 eventId를 할당

    document.getElementById("viewEventDate").textContent = event.date;
    document.getElementById("viewEventTime").textContent = event.startTime + " - " + event.endTime;

    // 운동 종목이 표시될 부분 초기화
    const exerciseListContainer = document.getElementById("viewEventExercises");
    exerciseListContainer.innerHTML = ''; // 기존 내용을 초기화

    // 운동 종목이 있을 때만 처리
    if (Array.isArray(event.exercises) && event.exercises.length > 0) {
        try {
            // event.exercises가 운동의 ObjectId로 구성되어 있는지 확인
            console.log("event.exercises:", event.exercises);

            const response = await axios.post('/api/exercises/multiple', {
                exerciseIds: event.exercises // 운동 ID 배열을 서버로 전송
            });
            const exercises = response.data;

            exercises.forEach(exercise => {
                const exerciseBox = document.createElement('div');
                exerciseBox.classList.add('exercise-box');
                // data-exercise-id 속성에 exercise._id 값을 저장
                exerciseBox.setAttribute('data-exercise-id', exercise._id);;

                console.log(`exerciseId: ${exercise._id}`);


                // 상단: 운동 이름
                const titleDiv = document.createElement('div');
                titleDiv.classList.add('exercise-title');
                titleDiv.textContent = `${exercise.name} (${exercise.category})`;
                exerciseBox.appendChild(titleDiv);

                // 중단: 운동량 타입 설정 및 완료 체크 공간
                const measureDiv = document.createElement('div');
                measureDiv.classList.add('exercise-measure');
                // measurementTypes가 존재하지 않을 경우를 처리
                const measurementTypesText = exercise.measurementTypes
                    ? exercise.measurementTypes.join(', ')
                    : '운동량 정보 없음';  // measurementTypes가 없을 경우 기본 텍스트 설정

                // 세트가 추가되기 전에는 운동량 입력 필드를 보이지 않도록 함
                measureDiv.innerHTML = `
                <span>${measurementTypesText}</span>
                <div class="exercise-sets"></div>
                `;
                exerciseBox.appendChild(measureDiv);

                // 하단: 세트 추가/삭제 버튼
                const controlsDiv = document.createElement('div');
                controlsDiv.classList.add('exercise-controls');
                controlsDiv.innerHTML = `
                    <button class="add-set-btn">세트 추가</button>
                    <button class="delete-set-btn">세트 삭제</button>
                `;
                exerciseBox.appendChild(controlsDiv);

                // 세트 추가/삭제 기능 구현
                let setsDiv = measureDiv.querySelector('.exercise-sets'); // 세트가 추가될 div
                // setsDiv가 없을 경우 생성
                if (!setsDiv) {
                    setsDiv = document.createElement('div');
                    setsDiv.classList.add('exercise-sets');
                    measureDiv.appendChild(setsDiv);
                }

                // 세트 추가 기능
                const addSetBtn = controlsDiv.querySelector('.add-set-btn');
                addSetBtn.addEventListener('click', () => {

                    // 첫 번째 세트가 없는 경우, 세트를 자동으로 추가
                    const setRow = document.createElement('div');
                    setRow.classList.add('set-row');

                    // 웨이트일 경우 무게와 횟수 입력 추가
                    if (exercise.category === '웨이트') {
                        setRow.innerHTML = `
                                <div class="weight-reps-container">
                                    <input type="number" class="weight-value" placeholder="무게(kg)" />
                                    <input type="number" class="reps-value" placeholder="횟수(회)" />
                                    <input type="checkbox" class="set-complete" />
                                </div>
                            `;
                    } else if (exercise.category === '유산소') {
                        // 유산소일 경우 시간 입력 추가
                        setRow.innerHTML = `
                                <input type="text" class="time-value" placeholder="시간(mm)" pattern="\\d{2}:\\d{2}" />
                                <input type="checkbox" class="set-complete" />
                            `;
                    } else if (exercise.category === '맨몸운동') {
                        // 맨몸운동일 경우 횟수 입력 추가
                        setRow.innerHTML = `
                                <input type="number" class="reps-value" placeholder="횟수(회)" />
                                <input type="checkbox" class="set-complete" />
                            `;
                    }
                    setsDiv.appendChild(setRow);

                });

                // 세트 삭제 기능 (완료되지 않은 세트만 삭제)
                const deleteSetBtn = controlsDiv.querySelector('.delete-set-btn');
                deleteSetBtn.addEventListener('click', () => {
                    const setRows = setsDiv.querySelectorAll('.set-row');
                    for (let i = setRows.length - 1; i >= 0; i--) {
                        const row = setRows[i];
                        const isComplete = row.querySelector('.set-complete').checked;

                        // 완료되지 않은 세트만 삭제
                        if (!isComplete) {
                            row.remove();  // 완료되지 않은 마지막 세트만 삭제
                            break;  // 한 번 삭제 후 함수 종료
                        }
                    }
                });

                // 운동 종목 박스를 모달에 추가
                exerciseListContainer.appendChild(exerciseBox);

                // 세트 추가/삭제 핸들러 설정
                //setupSetHandlers(exerciseBox);

                console.log(event.exercises); // 운동 종목 데이터를 콘솔에 출력
            });

        } catch (error) {
            console.error('운동 정보 불러오기 중 오류 발생: ', error);
        }
    } else {
        exerciseListContainer.textContent = '운동 종목 정보가 없습니다.';
    }

    // 댓글 불러오기
    loadComments(event._id);

    // 삭제 버튼에 리스너 연결
    attachDeleteEventListener(event._id);

    // 모달을 띄우는 코드
    const viewEventModal = new bootstrap.Modal(document.getElementById("viewEventModal"));
    viewEventModal.show();
}

// 특정 일정에 색상 적용
function applyEventColor(eventId, color) {
    const dayCells = document.querySelectorAll('.day');
    dayCells.forEach((cell) => {
        const eventTitles = cell.querySelectorAll('.event-title');
        const eventCircles = cell.querySelectorAll('.event-circle'); // 동그라미도 함께 선택
        eventTitles.forEach((eventTitle) => {
            if (eventTitle.dataset.eventId === eventId.toString()) {
                eventTitle.style.backgroundColor = color; // 일정 배경색 적용
            }
        });
        eventCircles.forEach((eventCircle) => {
            if (eventCircle.parentNode.querySelector('.event-title').dataset.eventId === eventId.toString()) {
                eventCircle.style.backgroundColor = color; // 동그라미 색상 적용
            }
        });
    });
}

// 댓글 저장 버튼 클릭 이벤트 추가
document.getElementById("saveCommentBtn").addEventListener("click", function () {
    const eventId = document.getElementById("viewEventTitle").dataset.eventId; // 모달에서 이벤트 ID 가져오기
    saveComment(eventId); // 댓글 저장 함수 호출
});

// 운동 종목 조회 함수 (서버에서 운동 종목을 가져와서 모달에 열로 표시)
async function fetchAndDisplayExercisesInModal() {
    try {
        const response = await axios.get('/api/exercises');  // 전체 운동 종목 조회 API 호출        
        const exercises = response.data;
        console.log("운동 종목 데이터:", exercises);

        // 운동 종목 리스트가 표시될 공간을 찾음
        const exercisesListContainer = document.getElementById('exercise-list-container');
        exercisesListContainer.innerHTML = '';  // 기존 리스트 초기화

        // 운동 종목 데이터를 반복하여 화면에 표시
        exercises.forEach(exercise => {
            const exerciseItem = document.createElement('div');
            exerciseItem.classList.add('col-12');  // 한 열에 하나씩 표시되도록 설정
            const measurementTypes = exercise.measurementTypes
                ? exercise.measurementTypes.join(', ')
                : 'Not specified';                              // measurementTypes가 없는 경우 처리

            exerciseItem.textContent = `${exercise.name} - ${exercise.category}`;

            // 운동 종목 클릭 시 선택 기능 추가
            exerciseItem.addEventListener('click', () => {
                // 선택된 운동 종목 정보를 처리하는 로직)
                console.log('선택된 운동: ${exercise.name}');
            });

            exercisesListContainer.appendChild(exerciseItem);
        });
    } catch (error) {
        console.error('운동 종목 조회 중 오류가 발생했습니다:', error);
    }
}

// 일정 추가 모달이 열릴 때 운동 종목 리스트를 불러와 표시
function showAddEventModal() {
    fetchAndDisplayExercisesInModal();  // 운동 종목 리스트를 모달에 표시
    const addEventModal = new bootstrap.Modal(document.getElementById("addEventModal"));
    addEventModal.show();
}

// 운동 종목 추가
function addExercise() {
    const exerciseName = document.getElementById("exercise-name").value;
    const exerciseCategory = document.getElementById("exercise-category").value;
    const exerciseType = document.getElementById("exercise-type").value.split(",").map(type => type.trim());

    console.log({
        name: exerciseName,
        category: exerciseCategory,
        measurementTypes: exerciseType
    });

    if (exerciseName && exerciseCategory && exerciseType.length > 0) {
        axios.post("/api/exercises", {
            name: exerciseName,
            category: exerciseCategory,
            measurementTypes: exerciseType  // 배열로 전송
        })
            .then((response) => {
                if (response.data.success) {
                    alert("운동 종목이 성공적으로 추가되었습니다.");
                    document.getElementById("exercise-name").value = '';  // 입력 필드 초기화
                    document.getElementById("exercise-category").value = '';
                    document.getElementById("exercise-type").value = '';

                    // 모달 닫기
                    const addExerciseModal = bootstrap.Modal.getInstance(document.getElementById("addExerciseModal"));
                    addExerciseModal.hide();
                } else {
                    alert("운동 종목 추가에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("운동 종목 추가 중 오류가 발생했습니다:", error);
            });
    } else {
        alert("모든 필드를 입력해주세요.");
    }
}

// 운동 종목 추가 버튼 클릭 시 운동 종목 저장 함수 호출
document.getElementById("addExerciseBtn").addEventListener("click", addExercise);

// 모달이 열릴 때 입력 필드 초기화
document.querySelector("[data-bs-target='#addExerciseModal']").addEventListener("click", () => {
    document.getElementById("exercise-name").value = '';
    document.getElementById("exercise-category").value = '';
    document.getElementById("exercise-type").value = '';
});

document.getElementById("saveEventBtn").addEventListener("click", saveEvents);

// 세부 일정 모달을 열 때 선택된 운동 종목 정보 가져오기
async function fetchAndDisplayExercises(eventId) {
    try {
        const response = await axios.get(`/api/events/${eventId}/exercises`);
        const exercises = response.data;

        // 운동 정보 모달에 표시
        showSelectedExercisesInModal(exercises);
    } catch (error) {
        console.error('운동 정보 불러오기 오류:', error);
    }
}

// 운동 기록 저장 버튼 클릭 시 서버로 데이터 전송
document.getElementById("saveWorkoutLogBtn").addEventListener("click", async function () {
    const eventId = document.getElementById("viewEventTitle").dataset.eventId;  // 이벤트 ID
    //const date = new Date().toISOString();  // 현재 날짜 저장

    const workoutLogs = [];  // 전체 운동 기록 배열 초기화

    // 각 운동 종목 데이터 수집
    document.querySelectorAll('.exercise-box').forEach((exerciseBox) => {
        // 운동 종목 ID 배열
        const exerciseId = exerciseBox.dataset.exerciseId;  
        // 운동량 타입
        const measurementTypes = exerciseBox.querySelector('.exercise-measure span').textContent;  
        // 세트
        const setRows = exerciseBox.querySelectorAll('.set-row');  

        if (!exerciseId) {
            console.error("exerciseId가 없습니다:", exerciseBox);
            return;  // exerciseId가 없으면 실행하지 않음
        }

        const sets = [];

        // 각 세트별 데이터를 배열에 추가
        setRows.forEach((setRow, index) => {
            const setNumber = index + 1;  // 세트 번호
            const isCompleted = setRow.querySelector('.set-complete').checked;

            // 운동 카테고리에 따라 다른 데이터를 추가
            if (measurementTypes.includes('무게') && measurementTypes.includes('횟수')) {
                const weight = setRow.querySelector('.weight-value').value.trim();  // 무게 (kg)
                const reps = setRow.querySelector('.reps-value').value.trim();  // 횟수 (회)

                if (!weight || !reps) {
                    alert("무게 값을 입력해 주세요.");
                    console.error("무게나 횟수 값이 비어있습니다.", setRow);  // 비어있는 값 확인
                } else {
                    console.log("무게 값: ", weight);  // 무게 값 콘솔 출력
                    console.log("횟수 값: ", reps);  // 횟수 값 콘솔 출력

                    // setData 객체에 weight와 reps 값을 포함하여 선언
                    let setData = {
                        exerciseId: exerciseId,
                        setNumber,                // 세트 번호
                        isCompleted,              // 완료 여부
                        weight: Number(weight),   // 무게 값 추가
                        reps: Number(reps)        // 횟수 값 추가
                    };
                    sets.push(setData);  // 최종 데이터 배열에 추가
                }
            } else if (measurementTypes.includes('시간')) {
                const time = setRow.querySelector('.time-value').value;  // 시간 (mm:ss)
                if (!time) {
                    alert("시간 값을 입력해 주세요.");
                    console.error("시간 값이 비어있습니다.", setRow);
                } else {
                    let setData = {
                        exerciseId: exerciseId,
                        setNumber,      // 세트 번호
                        isCompleted,    // 완료 여부
                        time            // 시간 값 추가
                    };

                    sets.push(setData);  // 최종 데이터 배열에 추가
                }
            } else if (measurementTypes.includes('횟수')) {
                const reps = setRow.querySelector('.reps-value').value;  // 횟수 (회)
                if (!reps) {
                    alert("횟수 값을 입력해 주세요.");
                    console.error("횟수 값이 비어있습니다.", setRow);
                } else {
                    let setData = {
                        exerciseId: exerciseId,
                        setNumber,      // 세트 번호
                        isCompleted,    // 완료 여부
                        reps: Number(reps)   // 횟수 값 추가 (숫자로 변환)
                    };

                    sets.push(setData);  // 최종 데이터 배열에 추가
                }
            }
        });

        workoutLogs.push({
            exerciseId: exerciseId,
            sets: sets
        });
    });

    // 서버로 전송할 전체 데이터
    const workoutLogData = {
        userId,  // 로그인한 사용자 ID
        eventId,  // 이벤트 ID
        workoutLogs    // 운동 기록
    };

    try {
        const response = await axios.post('/api/workoutLogs/saveWorkoutLog', workoutLogData);
        console.log("서버 응답: ", response.data);
        if (response.data.success) {
            alert('운동 기록이 저장되었습니다.');
            fetchWorkoutLog(eventId);
        } else {
            alert('운동 기록 저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('운동 기록 저장 중 오류 발생:', error);
        alert('운동 기록 저장 중 오류가 발생했습니다.');
    }
});

// 일정 상세 모달을 열 때 선택된 운동 기록 불러오기
async function fetchWorkoutLog(eventId) {
    try {
        const response = await axios.get(`/api/workoutLogs/event/${eventId}`);
        const workoutLog = response.data;

        if (workoutLog && workoutLog.workoutLogs.length > 0) {
            console.log("운동 기록 불러오기 성공: ", workoutLog);  // 추가된 로그
            document.getElementById('saveWorkoutLogBtn').style.display = 'none'; // 운동 기록이 존재하면 저장 버튼 숨기기
            displayWorkoutLogInModal(workoutLog);  // 운동 기록을 모달에 표시하는 함수 호출
        } else {
            console.error("운동 기록을 찾을 수 없습니다.");
            document.getElementById('saveWorkoutLogBtn').style.display = 'block'; // 운동 기록이 없으면 저장 버튼 보이기
            resetExerciseBoxes();
        }

        // 삭제 버튼에 eventId를 동적으로 설정
        //document.getElementById('deleteWorkoutLogBtn').setAttribute('data-event-id', eventId);
    } catch (error) {
        console.error("운동 기록 불러오기 중 오류 발생:", error);
        document.getElementById('saveWorkoutLogBtn').style.display = 'block';
    }
}

// 운동 기록을 모달에 표시하는 함수
function displayWorkoutLogInModal(workoutLog) {
    const exerciseListContainer = document.getElementById("viewEventExercises");
    exerciseListContainer.innerHTML = '';  // 기존 내용을 초기화

    workoutLog.workoutLogs.forEach(log => {
        const exerciseBox = document.createElement('div');
        exerciseBox.classList.add('exercise-box');

        // 운동 이름과 카테고리 표시
        const exerciseTitle = document.createElement('div');
        exerciseTitle.textContent = `운동: ${log.exerciseId.name} (${log.exerciseId.category})`;
        exerciseBox.appendChild(exerciseTitle);

        // 세트 정보 표시
        log.sets.forEach(set => {
            const setRow = document.createElement('div');
            setRow.classList.add('set-row');

            // 웨이트 카테고리일 경우 무게와 횟수만 표시
            if (log.exerciseId.category === '웨이트') {
                setRow.innerHTML = `
                    <div>${set.setNumber}</div>
                    <div>${set.weight || 'N/A'} kg</div>
                    <div>${set.reps || 'N/A'} 회</div>
                    <div>${set.isCompleted ? '🔵' : '●'}</div>
                `;
            }
            // 유산소 카테고리일 경우 시간만 표시
            else if (log.exerciseId.category === '유산소') {
                setRow.innerHTML = `
                    <div>${set.setNumber}</div>
                    <div>${set.time || 'N/A'} 분</div>
                    <div>${set.isCompleted ? '🔵' : '●'}</div>
                `;
            }
            // 맨몸운동일 경우 횟수만 표시
            else if (log.exerciseId.category === '맨몸운동') {
                setRow.innerHTML = `
                    <div>${set.setNumber}</div>
                    <div>${set.reps || 'N/A'} 회</div>
                    <div>${set.isCompleted ? '🔵' : '●'}</div>
                `;
            }
            exerciseBox.appendChild(setRow);
        });

        exerciseListContainer.appendChild(exerciseBox);
    });
}

// 일정 상세 모달을 열 때 운동 기록 불러오기
document.getElementById('viewEventModal').addEventListener('shown.bs.modal', function () {
    const eventId = document.getElementById("viewEventTitle").dataset.eventId;  // 이벤트 ID 가져오기
    console.log(`모달이 열림: eventId = ${eventId}`);
    fetchWorkoutLog(eventId);  // 운동 기록 불러오기
    document.getElementById('deleteWorkoutLogBtn').setAttribute('data-event-id', eventId);  // 삭제 버튼에 이벤트 ID 설정

    // 추가: 운동량 저장 버튼 숨기기
    document.getElementById('saveWorkoutLogBtn').style.display = 'block';
});

// 운동 기록 삭제
async function deleteWorkoutLog() {
    const eventId = document.getElementById('deleteWorkoutLogBtn').getAttribute('data-event-id');  // 버튼의 data-event-id 속성에서 eventId 가져오기
    console.log(`삭제 요청: eventId = ${eventId}`);  // 삭제 요청 로그 추가

    try {
        const response = await axios.delete(`/api/workoutLogs/event/${eventId}`);
        console.log("삭제 요청 응답: ", response.data);
        if (response.data.success) {
            alert('운동 기록이 삭제되었습니다.');
            // 모달을 업데이트하여 삭제된 내용을 반영
            resetExerciseBoxes();
            fetchWorkoutLog(eventId);
            //document.getElementById("viewEventExercises").innerHTML = '';
        } else {
            alert('운동 기록 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('운동 기록 삭제 중 오류 발생:', error);
        alert('운동 기록 삭제 중 오류가 발생했습니다.');
    }
}

document.getElementById('deleteWorkoutLogBtn').addEventListener('click', function () {
    console.log('삭제 버튼 클릭됨');  // 삭제 버튼 클릭 여부 확인
    deleteWorkoutLog();  // 삭제 요청 함수 호출
});

// 운동량 입력 박스와 세트 추가/삭제 버튼을 초기화하는 함수
function resetExerciseBoxes() {
    const exerciseListContainer = document.getElementById("viewEventExercises");
    exerciseListContainer.innerHTML = ''; // 기존 내용을 초기화

    // 운동량 입력 박스 기본 구조 생성
    const exerciseBox = document.createElement('div');
    exerciseBox.classList.add('exercise-box');

    // 운동 이름과 카테고리 표시 (예시로 설정)
    const exerciseTitle = document.createElement('div');
    exerciseTitle.textContent = `운동: 이름 (카테고리)`; // 이 부분은 동적으로 변경 가능
    exerciseBox.appendChild(exerciseTitle);

    // 세트 추가/삭제 버튼
    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('exercise-controls');
    controlsDiv.innerHTML = `
        <button class="add-set-btn">세트 추가</button>
        <button class="delete-set-btn">세트 삭제</button>
    `;
    exerciseBox.appendChild(controlsDiv);

    // 운동 종목 박스를 모달에 추가
    exerciseListContainer.appendChild(exerciseBox);
}

// 일정 삭제 함수
async function deleteEvent(eventId) {
    if (!eventId) {
        alert('삭제할 일정을 선택하세요.');
        return;
    }

    const confirmation = confirm('정말로 이 일정을 삭제하시겠습니까?');
    if (confirmation) {
        try {
            const response = await axios.delete(`/api/events/${eventId}`); // userId 제거

            if (response.data.success) {
                alert('일정이 삭제되었습니다.');
                removeEventFromCalendar(eventId); // UI에서 일정 제거
                const viewEventModal = bootstrap.Modal.getInstance(document.getElementById('viewEventModal'));
                viewEventModal.hide(); // 모달 닫기
            } else {
                alert(response.data.message); // 서버에서 받은 오류 메시지 표시
            }
        } catch (error) {
            console.error('일정 삭제 중 오류 발생:', error);
            alert('일정 삭제 중 오류가 발생했습니다.');
        }
    }
}

// 삭제된 일정만 제거
function removeEventFromCalendar(eventId) {
    const dayCells = document.querySelectorAll(".day");

    dayCells.forEach((cell) => {
        const eventTitles = cell.querySelectorAll(".event-title");
        const eventCircles = cell.querySelectorAll(".event-circle");

        // 해당 eventId를 가진 요소를 삭제
        eventTitles.forEach((title) => {
            if (title.getAttribute("data-event-id") === eventId) {
                title.remove();
            }
        });

        eventCircles.forEach((circle) => {
            if (circle.getAttribute("data-event-id") === eventId) {
                circle.remove();
            }
        });
    });
}

// 삭제 버튼 이벤트 리스너 관리 함수
function attachDeleteEventListener(eventId) {
    const deleteButton = document.getElementById('deleteEventBtn');

    // 기존 이벤트 리스너 제거
    if (deleteButton._deleteHandler) {
        deleteButton.removeEventListener('click', deleteButton._deleteHandler);
    }

    // 새로운 이벤트 리스너 정의
    const newDeleteHandler = function () {
        deleteEvent(eventId);
    };

    // 새로운 이벤트 리스너 추가
    deleteButton.addEventListener('click', newDeleteHandler);

    // 핸들러를 저장해 다음에 제거 가능하도록 설정
    deleteButton._deleteHandler = newDeleteHandler;
}