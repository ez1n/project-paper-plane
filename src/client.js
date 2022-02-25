'use strict'
const socket = io();

// 서버로부터 유저 이름, 채팅방 이름 받아오기
const getCookie = function (name){
  let value = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return value ? value[2] : null;
};

const userName = decodeURIComponent(getCookie("userName"));
const roomName = decodeURIComponent(getCookie("roomName"));



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
  name: userName,
  room : roomName
});
msgInput.focus(); // 입장시 커서 놓기


/**
 * 상단 메뉴바 설정
 */

// 현재 접속중인 사람 이름 표시
currentUserName.textContent = roomName + " : " + userName + " 님";


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
    room: roomName,
    photo: "profilePhoto",
    msg: msgInput.value
  });
  msgInput.value = "";
  msgInput.focus();
};


const addEntranceMsg = function (name, entrance) {
  const li = document.createElement("li");
  li.classList.add("entrance-msg");
  let dom;
  if (entrance == "join") {
    dom = `${name} 님이 종이비행기를 타고 왔어요!
    매너채팅 부탁드려요 :)`;
  } else {
    dom = `${name} 님이 종이비행기를 타고 다른 곳으로 날아갔어요. 
    다음에 또 만날 기회가 있을 거에요 :)`;
  }
  li.innerHTML = dom;
  chattingList.appendChild(li);
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
}



// 서버로 부터 채팅 메시지 받기
socket.on("chatting", (data) => {
  const { name, room, msg, photo, time } = data;
  console.log(room);
  const li = document.createElement("li");
  li.classList.add(userName === name ? "sent": "received");
  const dom = `<span class="user">${name}</span>
  <!-- <img src="" alt="profile"> 프로필사진 -->
  <div class="msg">${msg}</div>
  <span class="time">${time}</span>`;
  li.innerHTML = dom;
  chattingList.appendChild(li);
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
  new Audio("sound/msg.mp3").play();
});


// 입장시
socket.on("join", (data) => {
  new Audio("sound/join.mp3").play();
  addEntranceMsg(data.name, "join");
  currentLoginNum.textContent = data.userNum;
  currentUsers = data.userList;
});

// 퇴장시
socket.on("exit", (data) => {
  new Audio("sound/exit.mp3").play();
  addEntranceMsg(data.name, "exit");
  currentLoginNum.textContent = data.userNum;
  currentUsers = data.userList;
});