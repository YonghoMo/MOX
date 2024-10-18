let userId;

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
function generateCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = ""; // 기존 달력 초기화

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 이번 달 첫 요일
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 이번 달 마지막 날짜

    // 빈 셀 추가 (첫 번째 요일 전까지)
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
        dayCell.appendChild(dayNumber);

        calendar.appendChild(dayCell);
    }

    loadEvents(); // 일정 불러오기
}

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
function saveEvent() {
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    
     // 운동 선택을 체크박스로 변경
    const checkedExercises = document.querySelectorAll('input[name="exercises"]:checked');
    const exercises = Array.from(checkedExercises).map(checkbox => checkbox.value); // 체크된 운동의 value 값을 배열로 변환


    if (title && date && startTime && endTime) {
        axios
            .post("/api/events", {
                title,
                date,
                startTime,
                endTime,
                exercises,
                userId,
            })
            .then((response) => {
                if (response.data.success) {
                    alert("일정이 저장되었습니다.");
                    generateCalendar(); // 저장 후 일정 새로고침

                    // 모달 창 닫기
                    const addEventModal = bootstrap.Modal.getInstance(document.getElementById("addEventModal"));
                    addEventModal.hide(); // 모달 닫기
                } else {
                    alert("일정 저장에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error(error);
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
    events.forEach((event) => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const dayCells = document.querySelectorAll(".day");

        dayCells.forEach((cell) => {
            const dayNumber = cell.querySelector(".day-number");
            if (dayNumber && parseInt(dayNumber.textContent) === day) {
                // PC/태블릿용 일정 제목 추가
                const eventTitle = document.createElement("div");
                eventTitle.classList.add("event-title");
                eventTitle.textContent = event.title;
                eventTitle.dataset.eventId = event._id;

                // 기본 색상 파란색 설정
                const savedColor = localStorage.getItem(`eventColor_${event._id}`) || "#007bff";
                eventTitle.style.backgroundColor = savedColor;

                eventTitle.onclick = function () {
                    showEventDetails(event); // 제목 클릭 시 상세 정보 모달 표시
                };

                // 모바일용 일정 동그라미 추가
                const eventCircle = document.createElement("div");
                eventCircle.classList.add("event-circle");
                eventCircle.style.backgroundColor = savedColor; // 저장된 색상이 있으면 적용
                eventCircle.onclick = function () {
                    showEventDetails(event); // 동그라미 클릭 시 상세 정보 모달 표시
                };

                // PC/태블릿에서는 제목, 모바일에서는 동그라미 추가
                cell.appendChild(eventTitle);
                cell.appendChild(eventCircle);
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

    // 로컬 스토리지에 선택한 색상 저장
    localStorage.setItem(`eventColor_${eventId}`, selectedColor);

    // 변경된 색상을 화면에 적용
    applyEventColor(eventId, selectedColor);
}

// 일정 상세 정보 모달에 표시
async function showEventDetails(event) {
    document.getElementById("viewEventTitle").textContent = event.title;
    document.getElementById("viewEventDate").textContent = event.date;
    document.getElementById("viewEventTime").textContent = event.startTime + " - " + event.endTime;

    // 운동 종목이 표시될 부분 초기화
    const exerciseListContainer = document.getElementById("viewEventExercises");
    exerciseListContainer.innerHTML = ''; // 기존 내용을 초기화

    // 운동 종목이 있을 때만 처리
    if (Array.isArray(event.exercises) && event.exercises.length > 0) {
        try {
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

                // 웨이트일 경우 무게와 횟수 입력 박스를 가로로 배치
                if (exercise.category === '웨이트') {
                    measureDiv.innerHTML = `
                        <span>운동량 타입: ${measurementTypesText}</span>
                        <div class="weight-reps-container">
                            <input type="number" class="weight-value" placeholder="무게(kg)" />
                            <input type="number" class="reps-value" placeholder="횟수(회)" />
                            <input type="checkbox" class="set-complete" /> 완료
                        </div>
                    `;
                } else if (exercise.category === '유산소') {
                    // 유산소일 경우 시간 입력(mm:ss) 설정
                    measureDiv.innerHTML = `
                        <span>운동량 타입: ${measurementTypesText}</span>
                        <div class="cardio-time-container">
                            <input type="text" class="time-value" placeholder="시간(mm:ss)" pattern="\\d{2}:\\d{2}" />
                            <input type="checkbox" class="set-complete" /> 완료
                        </div>
                    `;
                } else if (exercise.category === '맨몸운동') {
                    // 맨몸운동일 경우 횟수 입력 설정
                    measureDiv.innerHTML = `
                        <span>운동량 타입: ${measurementTypesText}</span>
                        <div class="bodyweight-reps-container">
                            <input type="number" class="reps-value" placeholder="횟수(회)" />
                            <input type="checkbox" class="set-complete" /> 완료
                        </div>
                    `;
                }
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
                    const setRow = document.createElement('div');
                    setRow.classList.add('set-row');

                    // 웨이트일 경우 무게와 횟수 입력 추가
                    if (exercise.category === '웨이트') {
                        setRow.innerHTML = `
                            <div class="weight-reps-container">
                                <input type="number" class="weight-value" placeholder="무게 (kg)" />
                                <input type="number" class="reps-value" placeholder="횟수 (회)" />
                                <input type="checkbox" class="set-complete" /> 완료
                            </div>
                            
                        `;
                    } else if (exercise.category === '유산소') {
                        // 유산소일 경우 시간 입력 추가
                        setRow.innerHTML = `
                            <input type="text" class="time-value" placeholder="시간 (mm:ss)" pattern="\\d{2}:\\d{2}" />
                            <input type="checkbox" class="set-complete" /> 완료
                        `;
                    } else if (exercise.category === '맨몸운동') {
                        // 맨몸운동일 경우 횟수 입력 추가
                        setRow.innerHTML = `
                            <input type="number" class="reps-value" placeholder="횟수 (회)" />
                            <input type="checkbox" class="set-complete" /> 완료
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

document.getElementById("saveEventBtn").addEventListener("click", saveEvent);

// 세트 추가/삭제 핸들러
function setupSetHandlers(exerciseBox) {
    const addSetBtn = exerciseBox.querySelector('.add-set-btn');
    const deleteSetBtn = exerciseBox.querySelector('.delete-set-btn');
    const setsDiv = exerciseBox.querySelector('.exercise-sets');

    // setsDiv가 없을 경우 생성
    if (!setsDiv) {
        setsDiv = document.createElement('div');
        setsDiv.classList.add('exercise-sets');
        exerciseBox.appendChild(setsDiv);
    }

    // 세트 추가
    addSetBtn.addEventListener('click', () => {
        const setRow = document.createElement('div');
        setRow.classList.add('set-row');
        // 운동 카테고리에 따른 입력 필드 결정
        if (exercise.category === '웨이트') {
            setRow.innerHTML = `
                <div class="weight-reps-container">
                    <input type="number" class="weight-value" placeholder="무게 (kg)" />
                    <input type="number" class="reps-value" placeholder="횟수 (회)" />
                    <input type="checkbox" class="set-complete" /> 완료
                </div>
            `;
        } else if (exercise.category === '유산소') {
            setRow.innerHTML = `
                <input type="text" class="time-value" placeholder="시간 (mm:ss)" />
                <input type="checkbox" class="set-complete" /> 완료
            `;
        } else if (exercise.category === '맨몸운동') {
            setRow.innerHTML = `
                <input type="number" class="reps-value" placeholder="횟수 (회)" />
                <input type="checkbox" class="set-complete" /> 완료
            `;
        }
        setsDiv.appendChild(setRow);
    });

    // 세트 삭제(완료된 세트는 삭제하지 않음)
    deleteSetBtn.addEventListener('click', () => {
        const setRows = setsDiv.querySelectorAll('.set-row');
        // 가장 마지막 세트를 삭제하는데, 완료된 세트는 삭제되지 않도록 함
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
}

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
    const date = new Date().toISOString();  // 현재 날짜 저장

    const workoutLogs = [];  // 전체 운동 기록 배열 초기화

    document.querySelectorAll('.exercise-box').forEach((exerciseBox) => {
        const exerciseId = exerciseBox.dataset.exerciseId;  // 운동 종목 ID 배열
        const measurementTypes = exerciseBox.querySelector('.exercise-measure span').textContent;  // 운동량 타입
        const setRows = exerciseBox.querySelectorAll('.set-row');  // 세트 행

        console.log("exerciseId:", exerciseId);  // 콘솔로 확인
        if (!exerciseId) {
            console.error("exerciseId가 없습니다:", exerciseBox);
            return;  // exerciseId가 없으면 실행하지 않음
        }

        const sets = [];

        // 각 세트별 데이터를 배열에 추가
        setRows.forEach((setRow, index) => {
            const setNumber = index + 1;  // 세트 번호
            const isCompleted = setRow.querySelector('.set-complete').checked; 
            
            let setData = {
                exerciseId: exerciseId,
                setNumber,      // 세트 번호
                isCompleted     // 완료 여부
            };

            // 운동 카테고리에 따라 다른 데이터를 추가
            if (measurementTypes.includes('무게/횟수')) {
                setData.weight = setRow.querySelector('.weight-value').value;  // 무게 (kg)
                setData.reps = setRow.querySelector('.reps-value').value;  // 횟수 (회)
            } else if (measurementTypes.includes('시간')) {
                setData.time = setRow.querySelector('.time-value').value;  // 시간 (mm:ss)
            } else if (measurementTypes.includes('횟수')) {
                setData.reps = setRow.querySelector('.reps-value').value;  // 횟수 (회)
            }           

            sets.push(setData);
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
        workoutLogs,    // 운동 기록
        date  // 현재 날짜
    };

    try {
        const response = await axios.post('/api/workoutLogs/saveWorkoutLog', workoutLogData);
        console.log("서버 응답: ", response.data);
        if (response.data.success) {
            alert('운동 기록이 저장되었습니다.');
        } else {
            alert('운동 기록 저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('운동 기록 저장 중 오류 발생:', error);
        alert('운동 기록 저장 중 오류가 발생했습니다.');
    }
});
