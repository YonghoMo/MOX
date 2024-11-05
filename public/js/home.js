// Socket.IO로 서버와 연결
const socket = io();

// 접속 상태 변경 이벤트 수신
socket.on('userStatusChange', (data) => {
    // data.userId와 data.isOnline를 이용해 화면의 친구 목록 업데이트
    if (data.isOnline) {
        // 친구 목록에 추가 또는 업데이트
    } else {
        // 친구 목록에서 제거 또는 상태 비활성화
    }
});

async function loadUserInfo() {
    try {
        const userResponse = await fetch("/api/users/me", { method: "GET" });
        if (userResponse.ok) {
            const userData = await userResponse.json();
            const nickname = userData.nickname; // 서버에서 로그인한 사용자 닉네임 받아오기

            // 닉네임을 화면에 표시
            document.getElementById(
                "welcome-message"
            ).textContent = `${nickname}님 환영합니다`;
        } else {
            document.getElementById("welcome-message").textContent =
                "로그인이 필요합니다";
            console.error("사용자 정보를 가져오는 데 실패했습니다.");
        }
    } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
}

// 페이지 로딩 시 사용자 정보를 불러옴
loadUserInfo();

// 오늘의 일정 불러오기
async function loadTodaySchedule() {
    try {
        const response = await fetch('/api/events/today', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'  // 캐시를 사용하지 않고 항상 새 데이터를 요청
            }
        });

        if (response.ok) {
            const { events } = await response.json();

            if (events.length === 0) {
                document.querySelector('.today-schedule').innerHTML = '<p>오늘의 일정이 없습니다.</p>';
                return;
            }

            const scheduleList = events.map(event =>
                `<p><a href="#" class="event-link" data-id="${event._id}">${event.title}</a></p>`
            ).join('');

            document.querySelector('.today-schedule').innerHTML = scheduleList;

            // 클릭 이벤트 추가
            document.querySelectorAll('.event-link').forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const eventId = this.dataset.id;

                    // 일정 ID를 localStorage에 저장
                    localStorage.setItem('selectedEventId', eventId);

                    // 캘린더 페이지로 이동
                    window.location.href = 'calendar.html';
                });
            });
        } else {
            console.error('오늘의 일정을 가져오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('일정을 가져오는 중 오류 발생:', error);
    }
}

// 접속 중인 친구 목록 불러오기
async function loadOnlineFriends() {
    console.log("loadOnlineFriends 함수가 호출됨");  // 함수 호출 여부 확인
    try {
        const response = await fetch('/api/friends/online', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'  // 캐시 비활성화
            }
        });
        if (response.ok) {
            const { onlineFriends, userId } = await response.json();  // 서버에서 userId도 반환
            console.log("서버 응답 데이터:", onlineFriends, "사용자 ID:", userId);

            const friendList = onlineFriends.map(friend => {
                let friendNickname;

                // 디버깅: 각 friend 객체에서 requestFrom 및 requestTo 확인
                console.log("friend 데이터:", friend);

                if (friend.requestFrom._id.toString() === userId.toString()) {
                    friendNickname = friend.requestTo.nickname; // 내가 requestFrom일 때 상대방 닉네임
                    console.log("친구 요청을 보낸 사람입니다. 상대방 닉네임:", friendNickname);
                } else if (friend.requestTo._id.toString() === userId.toString()) {
                    friendNickname = friend.requestFrom.nickname; // 내가 requestTo일 때 상대방 닉네임
                    console.log("친구 요청을 받은 사람입니다. 상대방 닉네임:", friendNickname);
                } else {
                    console.log("현재 사용자와 일치하지 않는 친구 관계입니다.");
                }

                return friendNickname ? `<p>${friendNickname}</p>` : '';  // 닉네임이 있을 때만 추가
            }).join('');

            document.querySelector('.online-friends').innerHTML = friendList;
        } else {
            console.error('접속 중인 친구 목록을 가져오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('친구 목록을 가져오는 중 오류 발생:', error);
    }
}


window.onload = function () {
    loadTodaySchedule();  // 오늘 일정 로드
    loadOnlineFriends();  // 접속 중인 친구 목록 로드

    // 5초마다 loadOnlineFriends 호출
    setInterval(function () {
        loadOnlineFriends();
    }, 5000);
};