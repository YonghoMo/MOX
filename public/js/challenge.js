const statusElement = document.getElementById("status");
const roomNameInput = document.getElementById("roomNameInput");
const createRoomButton = document.getElementById("createRoomButton");
const roomListElement = document.getElementById("roomList");
const turnButton = document.getElementById("turnButton");
const leaveRoomButton = document.getElementById("leaveRoomButton");
const lobbyDiv = document.getElementById("lobby");
const gameDiv = document.getElementById("game");
const roomTitle = document.getElementById("roomTitle");
const refreshRoomsButton = document.getElementById("refreshRoomsButton");

const socket = io();
let currentRoom = null;
let createdRoom = null;
let currentRestTime = 30;

// 방 만들기
createRoomButton.addEventListener("click", () => {
    const roomName = roomNameInput.value;
    if (roomName) {
        if (!createdRoom) {
            socket.emit("create_room", roomName);
            roomNameInput.value = "";
            createdRoom = roomName;
        } else {
            alert("이미 만든 방이 있습니다.");
        }
    }
});

// 새로고침 버튼 클릭 시 방 목록 요청
refreshRoomsButton.addEventListener("click", () => {
    socket.emit("get_rooms");
});

// 방 목록 업데이트
socket.on("room_list", (rooms) => {
    roomListElement.innerHTML = "";
    for (let roomName in rooms) {
        const listItem = document.createElement("li");
        listItem.classList.add("room-list-item");

        const isFull = rooms[roomName].length >= 2;
        const joinButtonHTML = isFull
            ? `<button class="full-btn">가득 참</button>`
            : `<button class="join-btn">참가</button>`;

        listItem.innerHTML = `
            ${roomName} (${rooms[roomName].length}/2)
            ${joinButtonHTML}
        `;

        if (!isFull) {
            listItem.querySelector(".join-btn").onclick = () => {
                socket.emit("join_room", roomName);
            };
        }

        roomListElement.appendChild(listItem);
    }
});

// 방 참가 성공
socket.on("joined_room", (roomName) => {
    currentRoom = roomName;
    lobbyDiv.style.display = "none";
    gameDiv.style.display = "block";
    roomTitle.textContent = `방: ${roomName}`;
    statusElement.textContent = `"${roomName}"방에 입장했습니다. 턴을 기다려주세요!`;

    // 쉬는 시간 관련 UI 초기화
    currentRestTime = 30; // 기본 쉬는 시간으로 초기화
    document.getElementById("restTime").textContent = currentRestTime;
    document.getElementById("restControls").style.display = "none"; // 쉬는 시간 UI 숨기기
    document.getElementById("status").style.display = "block"; // 턴 상태 메시지 표시
    document.getElementById("turnButton").style.display = "block"; // 턴 넘기기 버튼 표시
});

// 방에서 나가기
leaveRoomButton.addEventListener("click", () => {
    if (currentRoom) {
        socket.emit("leave_room", currentRoom);

        // 방에서 나가면 쉬는 시간 초기화
        resetRestState();

        // 방을 나가면 로비로 돌아가기
        currentRoom = null;
        gameDiv.style.display = "none";
        lobbyDiv.style.display = "block";
        statusElement.textContent = "방을 떠났습니다.";
    }
});

// 쉬는 시간 초기화 함수
function resetRestState() {
    currentRestTime = 30; // 기본 쉬는 시간으로 초기화
    document.getElementById("restTime").textContent = currentRestTime;
    document.getElementById("restControls").style.display = "none"; // 쉬는 시간 UI 숨기기
    document.getElementById("status").style.display = "block"; // 턴 상태 메시지 표시
    document.getElementById("turnButton").style.display = "block"; // 턴 넘기기 버튼 표시
}

// 다른 사용자가 방에 입장했을 때 처리
socket.on("player_joined", ({ roomName, playerCount }) => {
    statusElement.textContent = `플레이어가 "${roomName}" 방에 입장했습니다. 인원: ${playerCount}/2`;
});

// 방에서 사용자가 나갔을 때 처리
socket.on("player_left", ({ roomName, playerCount }) => {
    statusElement.textContent = `플레이어가 "${roomName}" 방을 떠났습니다. 인원: ${playerCount}/2`;
});

// 방이 가득 찼을 때 처리
socket.on("error_message", (message) => {
    alert(message);
});

// 턴 시작 (본인의 턴이 시작될 때)
socket.on("your_turn", () => {
    statusElement.textContent = "당신의 턴입니다!";
    turnButton.disabled = false; // 본인의 턴일 때만 버튼 활성화
});

// 턴 넘기기 버튼 클릭 처리
turnButton.addEventListener("click", () => {
    if (currentRoom) {
        socket.emit("pass_turn", currentRoom); // 턴을 서버에 넘김
        turnButton.disabled = true; // 클릭 후 버튼 비활성화
        statusElement.textContent = "상대방의 턴입니다...";
    }
});

// 라운드 종료 시 처리
socket.on("round_end", ({ round, restTime }) => {
    // 턴 상태 메시지와 턴 넘기기 버튼 숨기기
    document.getElementById("status").style.display = "none";
    document.getElementById("turnButton").style.display = "none";
    turnButton.disabled = true; // 쉬는 시간 동안 버튼 비활성화

    // 쉬는 시간 UI 표시
    document.getElementById("restControls").style.display = "block";
    document.getElementById(
        "roundStatus"
    ).textContent = `${round} 라운드 종료`;
    currentRestTime = restTime;
    document.getElementById("restTime").textContent = currentRestTime;

    // 쉬는 시간 타이머 시작
    const restInterval = setInterval(() => {
        currentRestTime--;
        document.getElementById("restTime").textContent = currentRestTime;

        if (currentRestTime <= 0) {
            clearInterval(restInterval);
            socket.emit("start_next_round", currentRoom); // 다음 라운드 시작 요청

            // 쉬는 시간이 끝나면 쉬는 시간 UI를 숨기고 턴 UI 다시 표시
            document.getElementById("restControls").style.display = "none";
            document.getElementById("status").style.display = "block";
            document.getElementById("turnButton").style.display = "block";

            // 현재 턴이 본인인지 확인하여 버튼 상태 복원
            socket.emit("check_turn", currentRoom); // 서버에 턴 상태 확인 요청
        }
    }, 1000);
});

// 서버에서 확인한 턴 정보에 따라 버튼 상태 복원
socket.on("turn_status", (isYourTurn) => {
    if (isYourTurn) {
        turnButton.disabled = false; // 본인의 턴이면 버튼 활성화
        statusElement.textContent = "당신의 턴입니다!";
    } else {
        turnButton.disabled = true; // 상대방의 턴이면 버튼 비활성화
        statusElement.textContent = "상대방의 턴입니다!";
    }
});

// 쉬는 시간 조정
document.getElementById("increaseRest").addEventListener("click", () => {
    socket.emit("adjust_rest_time", {
        roomName: currentRoom,
        adjustment: 10,
    });
});

document.getElementById("decreaseRest").addEventListener("click", () => {
    socket.emit("adjust_rest_time", {
        roomName: currentRoom,
        adjustment: -10,
    });
});

socket.on("update_rest_time", (newRestTime) => {
    currentRestTime = newRestTime;
    document.getElementById("restTime").textContent = newRestTime;
});
