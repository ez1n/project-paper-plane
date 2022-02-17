'use strict'
// 서버로 부터 유저 네임 받아오기
const currentUserName = document.querySelector(".current-user-name");
const userName = decodeURIComponent(((document.cookie).substring(9)));
currentUserName.textContent = userName + "님";
