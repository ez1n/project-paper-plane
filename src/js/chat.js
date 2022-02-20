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
socket.emit("join", { name: userName });
msgInput.focus(); // 입장시 커서 놓기

/**
 * 상단 메뉴바 설정
 */

// 현재 접속중인 사람 이름 표시
currentUserName.textContent = userName + " 님";

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
  const param = {
    name: userName,
    photo: "profilePhoto",
    msg: msgInput.value
  };
  socket.emit("chatting", param);
  msgInput.value = "";
  msgInput.focus();
};


// 채팅 인스턴스
class Chat {
  constructor(name, msg, photo, time, userList, userNum) {
    this.name = name;
    this.msg = msg;
    this.photo = photo;
    this.time = time;
    this.userList = userList;
    this.userNum = userNum;
  };


  // 출입 메시지
  addEntranceMsg(entrance) {
    const li = document.createElement("li");
    li.classList.add("entrance-msg");
    const dom = `${this.name} 님이 ${entrance}했습니다.`;
    li.innerHTML = dom;
    chattingList.appendChild(li);
  };


  // 이거 ㄹㅇ 리펙토링 안되나 너무 꼴보기 싫은데;;
  addToChatting() {
    const li = document.createElement("li");
    li.classList.add(userName === this.name ? "sent" : "received");
    const dom = `<li class="sent">
    <span class="profile">
    <span class="user">${this.name}</span>
    <!-- <img src="" alt="profile"> : ${this.photo} 사용 -->
    </span>
    <span class="msg">${this.msg}</span>
    <span class="time">${this.time}</span>
    </li>`;
    li.innerHTML = dom;
    chattingList.appendChild(li);
  };
};


// 입장시
socket.on("join", (data) => {
  const { name, userList, userNum } = data;
  new Chat(name, userNum).addEntranceMsg("입장");
  currentLoginNum.textContent = userNum;
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
});


// 서버로 부터 채팅 메시지 받기
socket.on("chatting", (data) => {
  const { name, msg, photo, time } = data;
  new Chat(name, msg, photo, time).addToChatting();
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight); //채팅 계속 보내지면 아래로 자동 스크롤
});


// 퇴장시
socket.on("exit", (data) => {
  const { name, userList, userNum } = data;
  new Chat(name, userNum).addEntranceMsg("퇴장");
  currentLoginNum.textContent = userNum;
  chattingSpace.scrollTo(0, chattingSpace.scrollHeight);
});



