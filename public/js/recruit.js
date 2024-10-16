// 모집 글 등록 폼을 보여주는 버튼 클릭 시
document
    .getElementById("show-recruit-form-btn")
    .addEventListener("click", function () {
        const form = document.getElementById("friend-recruit-form");
        form.style.display = form.style.display === "none" ? "block" : "none"; // 폼 토글
    });

// 친구 모집 글을 등록하는 함수
document
    .getElementById("friend-recruit-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;

        try {
            const response = await fetch("/api/recruits/recruit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // 세션 기반이므로 JWT 토큰 필요 없음
                },
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("친구 모집 글이 등록되었습니다.");
                document.getElementById("friend-recruit-form").reset(); // 폼 초기화
                loadFriendRecruits(); // 모집 목록 갱신
                document.getElementById("friend-recruit-form").style.display = "none"; // 폼 숨김
            } else {
                alert(data.message || "등록 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("친구 모집 등록 중 오류 발생:", error);
        }
    });

// 친구 모집 글 목록을 불러와 아코디언 형태로 렌더링
async function loadFriendRecruits() {
    const response = await fetch("/api/recruits/recruits", {
        method: "GET",
    });
    const data = await response.json();

    const currentUserId = data.currentUserId; // 서버에서 사용자 ID 받아옴
    const accordion = document.getElementById("recruitAccordion");
    accordion.innerHTML = ""; // 기존 내용 삭제

    data.recruits.forEach((recruit, index) => {
        const isAuthor = recruit.authorId === currentUserId; // 자신이 등록한 글인지 확인
        const recruitItem = `
          <div class="accordion-item">
              <h2 class="accordion-header" id="heading${index}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                      ${recruit.title} <small class="text-muted">(${recruit.authorNickname})</small>  <!-- 제목 옆에 닉네임 표시 -->
                  </button>
              </h2>
              <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#recruitAccordion">
                  <div class="accordion-body">
                      <p>${recruit.description}</p>
                      <button class="btn btn-primary" onclick="sendFriendRequest('${recruit.authorId}')">친구 추가</button>
                      <button class="btn btn-danger" onclick="deleteRecruit('${recruit._id}')">글 삭제</button>
                  </div>
              </div>
          </div>`;
        accordion.innerHTML += recruitItem;
    });
}

// 친구 요청 보내기 함수
async function sendFriendRequest(friendName) {
    try {
        const response = await fetch("/api/friends/request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 쿠키와 세션 정보를 포함하여 요청
            body: JSON.stringify({ friendName }), // 전달할 데이터
        });

        const data = await response.json();
        if (response.ok) {
            alert("친구 요청이 성공적으로 보내졌습니다.");
        } else {
            alert(data.message || "친구 요청에 실패했습니다.");
        }
    } catch (error) {
        console.error("친구 요청 중 오류 발생:", error);
    }
}

// 모집 글 삭제 함수
async function deleteRecruit(recruitId) {
    if (confirm("이 모집 글을 삭제하시겠습니까?")) {
        try {
            const response = await fetch(`/api/recruits/recruit/${recruitId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                alert("모집 글이 삭제되었습니다.");
                loadFriendRecruits(); // 목록 갱신
            } else {
                alert(data.message || "모집 글 삭제 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("모집 글 삭제 중 오류 발생:", error);
        }
    }
}

// 페이지 로딩 시 모집 글 목록 불러오기
loadFriendRecruits();
