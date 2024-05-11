let isMoved = false;
let originalfooterTop;

window.onload = function() {
    const footer = document.getElementById("footer");
    originalfooterTop = footer.offsetTop; // footer의 원래 위치를 저장
}

function toggleBtn_menu() {
    const menu = document.querySelector("#navbar");

    const calendarBox = document.getElementById("calendarBox");
    const footer = document.getElementById("footer");

    if(!isMoved) {
        calendarBox.classList.add("move-down");
        footer.classList.add("move-down");
    } else {
        calendarBox.classList.remove("move-down");
        footer.classList.remove("move-down");
    }
    isMoved = !isMoved;
}