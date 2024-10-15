document
    .getElementById("signup-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault(); // 폼 자동 제출 막음

        // 입력된 값 가져오기
        const username = document.getElementById("username").value;
        const password = document.getElementById("password-input").value;
        const confirmPassword = document.getElementById("confirm-password-input").value;
        const nickname = document.getElementById("nickname-input").value;
        const height = document.getElementById("height-input").value;
        const weight = document.getElementById("weight-input").value;

        // 비밀번호 일치 여부 확인
        if (password !== confirmPassword) {
            document.getElementById("error-message").innerText =
                "비밀번호가 일치하지 않습니다.";
            return;
        }

        try {
            const response = await fetch("/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    nickname: nickname,
                    height: height,
                    weight: weight
                }),
            });

            // 응답의 Content-Type이 JSON인지 확인
            if (
                response.headers.get("content-type")?.includes("application/json")
            ) {
                const data = await response.json();
                if (response.ok) {
                    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                    window.location.href = "/login.html"; // 성공 시 리다이렉트
                } else {
                    document.getElementById("error-message").innerText =
                        data.message || "회원가입에 실패했습니다.";
                }
            } else {
                // JSON이 아닌 응답을 받으면 에러 메시지 표시
                document.getElementById("error-message").innerText =
                    "서버에서 잘못된 응답을 받았습니다.";
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            document.getElementById("error-message").innerText =
                "회원가입에 실패했습니다. 다시 시도해주세요.";
        }
    });
