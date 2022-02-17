'use strict'

const socket = io();

//닉네임 -> 테스트용
const userName = document.querySelector(".user-name");
const chattingList = document.querySelector(".chatting-list");
const msgInput = document.querySelector(".msg-input");
const sendBtn = document.querySelector(".send-btn");

sendBtn.addEventListener("click", () => {
  const param = {
    name: userName.value, // -> 테스트용
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
    //username 받아와야함
    li.classList.add(userName.value === this.name ? "sent": "received")
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