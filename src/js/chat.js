'use strict'

// 서버로 부터 유저 네임 받아오기
const currentUserName = document.querySelector(".current-user-name");
const userName = decodeURIComponent(((document.cookie).substring(9)));
currentUserName.textContent = userName + "님";

const socket = io();
const chattingList = document.querySelector(".chatting-list");
const msgInput = document.querySelector(".msg-input");
const sendBtn = document.querySelector(".send-btn");

sendBtn.addEventListener("click", () => {
  const param = {
    name: userName,
    photo: "profilePhoto",
    msg: msgInput.value
  }
  socket.emit("chatting", param)
});


socket.on("chatting", (data) => {
  
  const { name, msg, photo, time} = data;
  const item = new LiModel(name, msg, photo, time);
  item.makeLi()
});

function LiModel(name, msg, photo, time) {
  this.name = name;
  this.msg = msg;
  this.photo = photo;
  this.time = time;

  this.makeLi = () => {
    const li = document.createElement("li");
    li.classList.add(userName === this.name ? "sent": "received")
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
  }
};

