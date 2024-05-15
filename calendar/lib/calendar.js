let isMoved = false;

function toggleBtn_menu() {
    const menu = document.querySelector(".nav_menu");
    menu.classList.toggle("active");

    const calendarBox = document.getElementById("calendarBox");
    if(!isMoved) {
        calendarBox.classList.add("move-down");
    } else {
        calendarBox.classList.remove("move-down");
    }
    isMoved = !isMoved;
}