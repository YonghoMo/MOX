function enterkey(e) {
    if (e.keyCode === 13) {
        document.getElementById("loginBtn").click();
    }
}

document
    .getElementById("loginBtn")
    .addEventListener("click", async function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            document.getElementById("alert").innerText =
                "아이디와 비밀번호를 입력하세요.";
            return;
        }

        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // 로그인 성공 시 alert 후 메인 페이지로 이동
                alert("로그인 성공! 메인 페이지로 이동합니다.");
                window.location.href = "/home.html";
            } else {
                document.getElementById("alert").innerText =
                    data.message || "로그인에 실패했습니다.";
            }
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            document.getElementById("alert").innerText =
                "로그인에 실패했습니다. 다시 시도해주세요.";
        }
    });
