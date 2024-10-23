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

// 페이지 로딩 시 함수 호출
loadTodaySchedule();

// 접속 중인 친구 목록 불러오기
async function loadOnlineFriends() {
    try {
        const response = await fetch('/api/friends/online');
        if (response.ok) {
            const { onlineFriends } = await response.json();
            const friendList = onlineFriends.map(friend => `<p>${friend.nickname}</p>`).join('');
            document.querySelector('.online-friends').innerHTML = friendList;
        } else {
            console.error('접속 중인 친구 목록을 가져오는 데 실패했습니다.');
        }
    } catch (error) {
        console.error('친구 목록을 가져오는 중 오류 발생:', error);
    }
}
loadOnlineFriends();