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

// 일정 저장
function saveEvent() {
    const title = document.getElementById("event-title").value;
    const date = document.getElementById("event-date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const exercises = document.getElementById("exercises").value.split(",");

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
                eventTitle.dataset.eventId = event.id;

                // 기본 색상 파란색 설정
                const savedColor = localStorage.getItem(`eventColor_${event.id}`) || "#007bff";
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
    const newComment = document.getElementById("new-comment").value;

    if (newComment) {
        axios.post(`/api/events/${eventId}/comments`, { userId, comment: newComment })
            .then((response) => {
                if (response.data.success) {
                    alert("댓글이 저장되었습니다.");
                    loadComments(eventId); // 댓글 새로고침
                } else {
                    alert("댓글 저장에 실패했습니다.");
                }
            })
            .catch((error) => {
                console.error("댓글 저장 중 오류가 발생했습니다.", error);
            });
    }
}

// 댓글 불러오기 및 표시
function loadComments(eventId) {
    axios.get(`/api/events/${eventId}/comments`)
        .then((response) => {
            const commentsList = document.getElementById("comments-list");
            commentsList.innerHTML = ""; // 기존 댓글 초기화
            response.data.comments.forEach((comment) => {
                const commentItem = document.createElement("li");
                commentItem.textContent = `${comment.nickname}: ${comment.text}`; // 닉네임과 댓글 표시
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
function showEventDetails(event) {
    document.getElementById("viewEventTitle").textContent = event.title;
    document.getElementById("viewEventDate").textContent = event.date;
    document.getElementById("viewEventTime").textContent = event.startTime + " - " + event.endTime;
    document.getElementById("viewEventExercises").textContent = event.exercises.join(", ");

    // 댓글 불러오기
    loadComments(event.id);

    // 모달 안의 색상 선택기에서 로컬 스토리지에 저장된 색상 불러오기
    const colorPicker = document.getElementById("event-color-picker");
    colorPicker.value = localStorage.getItem(`eventColor_${event.id}`) || "#007bff"; // 기본 파란색

    // 색상 변경 이벤트 리스너 등록 (중복 방지)
    colorPicker.removeEventListener('input', handleColorChange); // 기존 리스너 제거
    colorPicker.addEventListener('input', function handleColorChange() {
        const selectedColor = colorPicker.value;
        localStorage.setItem(`eventColor_${event.id}`, selectedColor); // 로컬 스토리지에 저장
        applyEventColor(event.id, selectedColor); // 변경된 색상 적용
    });

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

document.getElementById("saveEventBtn").addEventListener("click", saveEvent);
