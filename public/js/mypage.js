// 친구 요청 목록 불러오기 및 렌더링
async function loadFriendRequests() {
    try {
        const response = await fetch("/api/friends/requests", {
            method: "GET",
        });
        const data = await response.json();

        console.log("친구 요청 데이터:", data); // 서버에서 받은 데이터를 로그로 확인

        const requestsDiv = document.getElementById("friend-requests");
        requestsDiv.innerHTML = "";

        // 예외 처리: data.requests가 undefined일 경우 처리
        if (!data.requests || data.requests.length === 0) {
            requestsDiv.innerHTML = "<p>받은 친구 요청이 없습니다.</p>";
            return;
        }

        data.requests.forEach((request) => {
            requestsDiv.innerHTML += `
                  <div>
                      ${request.requestFrom.nickname}님의 친구 요청
                      <button onclick="acceptFriendRequest('${request._id}')">수락</button>
                      <button onclick="rejectFriendRequest('${request._id}')">거절</button>
                  </div>`;
        });
    } catch (error) {
        console.error("친구 요청 목록 불러오기 오류:", error);
    }
}
// 유저 닉네임 표시
async function loadUserInfo() {
    try {
        const userResponse = await fetch("/api/users/me", { method: "GET" });
        if (userResponse.ok) {
            const userData = await userResponse.json();
            const nickname = userData.nickname; // 서버에서 로그인한 사용자 닉네임 받아오기

            // 닉네임을 화면에 표시
            document.getElementById(
                "welcome-message"
            ).textContent = `${nickname}님`;
        } else {
            document.getElementById("welcome-message").textContent =
                "로그인이 필요합니다";
            console.error("사용자 정보를 가져오는 데 실패했습니다.");
        }
    } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
    }
}

loadUserInfo();

// 친구 요청 수락
async function acceptFriendRequest(requestId) {
    try {
        const response = await fetch(`/api/friends/accept/${requestId}`, {
            method: "POST",
        });
        if (response.ok) {
            console.log("친구 요청 수락 성공");
            loadFriendRequests();
            loadFriends(); // 목록 갱신
        } else {
            console.error("친구 요청 수락 실패");
        }
    } catch (error) {
        console.error("친구 요청 수락 중 오류 발생:", error);
    }
}

// 친구 요청 거절
async function rejectFriendRequest(requestId) {
    try {
        const response = await fetch(`/api/friends/reject/${requestId}`, {
            method: "POST",
        });
        if (response.ok) {
            console.log("친구 요청 거절 성공");
            loadFriendRequests(); // 목록 갱신
        } else {
            console.error("친구 요청 거절 실패");
        }
    } catch (error) {
        console.error("친구 요청 거절 중 오류 발생:", error);
    }
}

async function loadFriends() {
    // 1. 로그인한 사용자 ID를 가져오는 fetch 요청
    const userResponse = await fetch("/api/users/me", { method: "GET" });
    if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUserId = userData.userId; // 서버에서 로그인한 사용자 ID 받아오기

        // 2. 친구 목록 불러오기
        const response = await fetch("/api/friends", { method: "GET" });
        const data = await response.json();
        const friendsDiv = document.getElementById("friend-list");

        friendsDiv.innerHTML = "";

        // 3. 친구 목록을 돌면서 친구의 닉네임을 결정
        data.friends.forEach((friend) => {
            let friendNickname;

            // ID 비교 시 .toString()으로 문자열 변환하여 비교
            if (friend.requestFrom._id.toString() === currentUserId.toString()) {
                friendNickname = friend.requestTo.nickname; // 내가 requestFrom일 때 상대방 닉네임
            } else {
                friendNickname = friend.requestFrom.nickname; // 내가 requestTo일 때 상대방 닉네임
            }

            // 4. 친구 목록에 친구의 닉네임 표시
            friendsDiv.innerHTML += `
                  <div>
                      ${friendNickname}
                      <button onclick="deleteFriend('${friend._id}')">삭제</button>
                  </div>`;
        });
    } else {
        console.error("사용자 ID를 가져오는 데 실패했습니다.");
    }
}

// 친구 삭제
async function deleteFriend(friendId) {
    const response = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
    });
    loadFriends(); // 목록 갱신
}

// 페이지 로딩 시 친구 요청 및 친구 목록 불러오기
loadFriendRequests();
loadFriends();
