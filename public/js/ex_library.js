const searchInput = document.getElementById("search_input");
const searchSuggestions = document.getElementById("searchSuggestions");
const searchForm = document.getElementById("searchForm");

// 검색어 입력 시 관련된 운동 목록을 표시
searchInput.addEventListener("input", function () {
    let filter = this.value.toLowerCase();
    let items = document.querySelectorAll(".accordion-item");
    searchSuggestions.innerHTML = ""; // 이전 검색 결과 초기화

    items.forEach((item) => {
        let exerciseName = item
            .querySelector(".accordion-button")
            .textContent.toLowerCase();
        if (exerciseName.includes(filter) && filter.length > 0) {
            let suggestion = document.createElement("li");
            suggestion.textContent =
                item.querySelector(".accordion-button").textContent;
            suggestion.classList.add(
                "list-group-item",
                "list-group-item-action"
            );
            suggestion.addEventListener("click", function () {
                openAccordion(item);
            });
            searchSuggestions.appendChild(suggestion);
        }
    });
});

// 검색 버튼을 눌렀을 때 첫 번째 유사 항목 열기
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let firstSuggestion = searchSuggestions.querySelector("li");
    if (firstSuggestion) {
        let items = document.querySelectorAll(".accordion-item");
        items.forEach((item) => {
            if (
                item.querySelector(".accordion-button").textContent ===
                firstSuggestion.textContent
            ) {
                openAccordion(item);
            }
        });
    }
});

function openAccordion(item) {
    let button = item.querySelector(".accordion-button");
    let collapse = item.querySelector(".accordion-collapse");

    // 상위 아코디언을 열기 위한 부모 찾기
    let parentAccordion = item.closest(".accordion-collapse");
    if (parentAccordion && !parentAccordion.classList.contains("show")) {
        let parentItem = parentAccordion.parentElement;
        let parentButton = parentItem.querySelector(".accordion-button");

        // 상위 아코디언 열기
        if (parentButton && parentButton.classList.contains("collapsed")) {
            parentButton.click(); // 상위 아코디언을 열기
        }
    }

    // 하위 아코디언 열기
    if (!collapse.classList.contains("show")) {
        button.click();
    }

    searchSuggestions.innerHTML = ""; // 검색 리스트 초기화
}