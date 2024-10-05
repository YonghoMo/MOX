let isMoved = false;

function toggleBtn_menu() {
  const menu = document.querySelector(".nav_menu");
  menu.classList.toggle("active");

  const calendarBox = document.getElementById("calendarBox");
  if (!isMoved) {
    calendarBox.classList.add("move-down");
  } else {
    calendarBox.classList.remove("move-down");
  }
  isMoved = !isMoved;
}


/*
      일정 추가 기능
*/

// 기존 코드 내 일정 추가 버튼 클릭 이벤트 처리 부분에 아래 코드를 추가
$("#addCalendar").on("click", function() {
  var content = $("#calendar_content").val();
  var date = $("#calendar_date").val();
  var startTime = date + "T" + $("#calendar_startTime").val();
  var endTime = date + "T" + $("#calendar_endTime").val();

  // 유효성 검사
  if (content && date && startTime && endTime) {
      var eventData = {
          title: content,
          start: startTime,
          end: endTime
      };
      
      // FullCalendar에 이벤트 추가
      calendar.addEvent(eventData);
      console.log(eventData);

      // AJAX를 통해 백엔드에 이벤트 데이터 전송
      addEventToDB(eventData); // 이 부분이 추가됩니다.

      // 모달 닫기
      $("#calendarModal").modal("hide");
  } else {
      alert("모든 필드를 입력하세요.");
  }
});

// AJAX 요청을 보내어 일정 데이터를 백엔드로 전달
function addEventToDB(eventData) {
  $.ajax({
      url: '/events', // 백엔드에 맞는 엔드포인트로 변경
      type: 'POST',
      data: JSON.stringify(eventData),
      contentType: 'application/json',
      success: function(response) {
          console.log('Event saved successfully', response);
      },
      error: function(error) {
          console.log('Error saving event', error);
      }
  });
}


/*
      댓글 추가 기능
*/

// 댓글 업로드 버튼 클릭 시
function uploadComment() {
  var commentText = $("#commentInput").val();
  if (commentText.trim() === "") {
      alert("댓글을 입력하세요.");
      return;
  }

  var eventId = /* 해당하는 이벤트의 ID 값을 설정해야 합니다 (예: info.event.id) */;
  
  // AJAX를 통해 댓글을 백엔드로 전송
  addCommentToDB(eventId, commentText);

  // 댓글을 화면에 추가
  var commentItem = $("<li>").addClass("list-group-item").text(commentText);
  $("#commentList").append(commentItem);
  $("#commentInput").val("");
}

// 댓글을 백엔드로 전송하는 AJAX 요청
function addCommentToDB(eventId, commentText) {
  $.ajax({
      url: '/comments', // 백엔드에 맞는 엔드포인트로 변경
      type: 'POST',
      data: JSON.stringify({
          eventId: eventId,
          content: commentText
      }),
      contentType: 'application/json',
      success: function(response) {
          console.log('Comment saved successfully', response);
      },
      error: function(error) {
          console.log('Error saving comment', error);
      }
  });
}

/*  일정 데이터 불러오기  */
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: 'bootstrap5',
    timeZone: 'UTC',
    initialView: 'dayGridMonth',
    
    // 일정 데이터를 백엔드에서 가져옴
    events: function(fetchInfo, successCallback, failureCallback) {
      $.ajax({
        url: '/events',  // 일정 데이터를 제공하는 백엔드 API
        type: 'GET',
        success: function(data) {
          // 백엔드에서 받은 데이터(data)를 FullCalendar 형식으로 변환
          const events = data.map(event => ({
            title: event.title,
            start: event.startDate,
            end: event.endDate
          }));
          successCallback(events); // FullCalendar에 일정 표시
        },
        error: function(error) {
          console.error('Error fetching events:', error);
          failureCallback(error);
        }
      });
    },

    eventClick: function(info) {
      $("#scheduleModal").modal("show");

      var scheduleTitle = $("#scheduleModalLabel");
      var scheduleDate = $("#scheduleModal_date");
      var scheduleStartTime = $("#scheduleModal_startTime");
      var commentList = $("#commentList");

      // 일정 정보 설정
      scheduleTitle.text(info.event.title);
      scheduleDate.text(info.event.start.toLocaleDateString());
      scheduleStartTime.text(info.event.start.toLocaleTimeString());

      // 댓글 목록 초기화
      commentList.empty();

      // 해당 일정의 댓글 데이터를 백엔드에서 가져옴
      fetchComments(info.event.id);
    },

    customButtons: {
      addEventButton: {
        text: "일정 추가",
        click: function() {
          $("#calendarModal").modal("show");

          $("#addCalendar").on("click", function() {
            var content = $("#calendar_content").val();
            var date = $("#calendar_date").val();
            var startTime = date + "T" + $("#calendar_startTime").val();
            var endTime = date + "T" + $("#calendar_endTime").val();

            if (content && date && startTime && endTime) {
              var eventData = {
                title: content,
                start: startTime,
                end: endTime
              };
              
              calendar.addEvent(eventData);
              addEventToDB(eventData); // 백엔드로 일정 추가 요청

              $("#calendarModal").modal("hide");
            } else {
              alert("모든 필드를 입력하세요.");
            }
          });
        }
      }
    }
  });

  calendar.render();
});

// 댓글 데이터 가져오기
function fetchComments(eventId) {
  $.ajax({
    url: `/comments/${eventId}`,  // 댓글 데이터를 제공하는 백엔드 API
    type: 'GET',
    success: function(comments) {
      var commentList = $("#commentList");
      comments.forEach(comment => {
        var commentItem = $("<li>").addClass("list-group-item").text(`${comment.userName}: ${comment.commentText}`);
        commentList.append(commentItem);
      });
    },
    error: function(error) {
      console.error('Error fetching comments:', error);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: 'bootstrap5',
    timeZone: 'UTC',
    initialView: 'dayGridMonth',
    
    // 일정 데이터를 백엔드에서 가져옴
    events: function(fetchInfo, successCallback, failureCallback) {
      $.ajax({
        url: '/events',  // 일정 데이터를 제공하는 백엔드 API
        type: 'GET',
        success: function(data) {
          // 백엔드에서 받은 데이터(data)를 FullCalendar 형식으로 변환
          const events = data.map(event => ({
            title: event.title,
            start: event.startDate,
            end: event.endDate
          }));
          successCallback(events); // FullCalendar에 일정 표시
        },
        error: function(error) {
          console.error('Error fetching events:', error);
          failureCallback(error);
        }
      });
    },

    eventClick: function(info) {
      $("#scheduleModal").modal("show");

      var scheduleTitle = $("#scheduleModalLabel");
      var scheduleDate = $("#scheduleModal_date");
      var scheduleStartTime = $("#scheduleModal_startTime");
      var commentList = $("#commentList");

      // 일정 정보 설정
      scheduleTitle.text(info.event.title);
      scheduleDate.text(info.event.start.toLocaleDateString());
      scheduleStartTime.text(info.event.start.toLocaleTimeString());

      // 댓글 목록 초기화
      commentList.empty();

      // 해당 일정의 댓글 데이터를 백엔드에서 가져옴
      fetchComments(info.event.id);
    },

    customButtons: {
      addEventButton: {
        text: "일정 추가",
        click: function() {
          $("#calendarModal").modal("show");

          $("#addCalendar").on("click", function() {
            var content = $("#calendar_content").val();
            var date = $("#calendar_date").val();
            var startTime = date + "T" + $("#calendar_startTime").val();
            var endTime = date + "T" + $("#calendar_endTime").val();

            if (content && date && startTime && endTime) {
              var eventData = {
                title: content,
                start: startTime,
                end: endTime
              };
              
              calendar.addEvent(eventData);
              addEventToDB(eventData); // 백엔드로 일정 추가 요청

              $("#calendarModal").modal("hide");
            } else {
              alert("모든 필드를 입력하세요.");
            }
          });
        }
      }
    }
  });

  calendar.render();
});

/*  댓글 데이터 가져오기  */
function fetchComments(eventId) {
  $.ajax({
    url: `/comments/${eventId}`,  // 댓글 데이터를 제공하는 백엔드 API
    type: 'GET',
    success: function(comments) {
      var commentList = $("#commentList");
      comments.forEach(comment => {
        var commentItem = $("<li>").addClass("list-group-item").text(`${comment.userName}: ${comment.commentText}`);
        commentList.append(commentItem);
      });
    },
    error: function(error) {
      console.error('Error fetching comments:', error);
    }
  });
}

/*  댓글 추가 */
// 댓글 업로드 버튼 클릭 시
function uploadComment() {
  var commentText = $("#commentInput").val();
  if (commentText.trim() === "") {
    alert("댓글을 입력하세요.");
    return;
  }

  var eventId = /* 일정 ID를 가져와야 합니다 (info.event.id 사용) */;
  
  // AJAX를 통해 댓글을 백엔드로 전송
  addCommentToDB(eventId, commentText);

  // 댓글을 화면에 추가
  var commentItem = $("<li>").addClass("list-group-item").text(commentText);
  $("#commentList").append(commentItem);
  $("#commentInput").val("");
}

// 댓글을 백엔드로 전송하는 AJAX 요청
function addCommentToDB(eventId, commentText) {
  $.ajax({
    url: '/comments',  // 백엔드 댓글 추가 API 엔드포인트
    type: 'POST',
    data: JSON.stringify({
      eventId: eventId,
      userName: '사용자명',  // 실제 사용자명으로 변경 필요
      commentText: commentText
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Comment saved successfully', response);
    },
    error: function(error) {
      console.log('Error saving comment', error);
    }
  });
}

