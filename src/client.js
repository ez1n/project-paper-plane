'use strict'
const socket = io();

// 서버로부터 유저 이름 받아오기
const userName = decodeURIComponent(((document.cookie).substring(9))); // 쿠키값 파싱

// DOM 가져오기
const chattingList = document.querySelector(".chatting-list");
const msgInput = document.querySelector(".msg-input");
const sendBtn = document.querySelector(".send-btn");
const chattingSpace = document.querySelector(".chatting-space");
const currentUserName = document.querySelector(".current-user-name");
const currentLoginNum = document.querySelector(".current-login-num");
const currentUserList = document.querySelector(".current-user-list");
const userList = document.querySelector(".user-list");
socket.emit("join", {
  name: userName
});
msgInput.focus(); // 입장시 커서 놓기

/**
 * 상단 메뉴바 설정
 */

// 현재 접속중인 사람 이름 표시
currentUserName.textContent = userName + "님";


// 접속자 목록 표시
let currentUsers;
let userCheck = false;
currentUserList.addEventListener("click", () => {
  if (!userCheck) {
    for (let value of currentUsers) {
      const p = document.createElement("p");
      p.classList.add("participants");
      p.innerHTML = value;
      userList.appendChild(p);
    }
    userCheck = true;
  } else {
    userList.innerHTML = "";
    userCheck = false;
  }
});


/**
* 채팅룸 설정
*/

// 엔터키 눌러도 메시지가 보내지도록 설정
msgInput.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    if (msgInput.value == '') return;
    console.log("엔터")
    send();
  }
});


sendBtn.addEventListener("click", () => {
  if (msgInput.value == '') return;
  send();
});


// 메시지 전송 함수
const send = function () {
  socket.emit("chatting", {
    name: userName,
    photo: "profilePhoto",
    msg: msgInput.value
  });
  msgInput.value = "";
  msgInput.focus();
};


const addEntranceMsg = function (name, entrance) {
  const li = document.createElement("li");
  li.classList.add("entrance-msg");
  const dom = `${name} 님이 ${entrance}했습니다.`;
  li.innerHTML = dom;
  chattingList.appendChild(li);
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
}



// 서버로 부터 채팅 메시지 받기
socket.on("chatting", (data) => {
  const { name, msg, photo, time } = data;
  const li = document.createElement("li");
  li.classList.add(userName === name ? "sent": "received");
  const dom = `
  <span class="profile">
  <span class="user">${name}</span>
  <!-- <img src="" alt="profile"> 프로필사진 -->
  </span>
  <div class="msg">${msg}</div>
  <span class="time">${time}</span>`;
  li.innerHTML = dom;
  chattingList.appendChild(li);
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
});


// 입장시
socket.on("join", (data) => {
  addEntranceMsg(data.name, "입장");
  currentLoginNum.textContent = data.userNum;
  currentUsers = data.userList;
});

// 퇴장시
socket.on("exit", (data) => {
  addEntranceMsg(data.name, "퇴장");
  currentLoginNum.textContent = data.userNum;
  currentUsers = data.userList;
});