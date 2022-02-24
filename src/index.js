const announce = document.querySelector(".announce");
const enterBtn = document.querySelector(".enter-btn");
const overlapCheckBtn = document.querySelector(".overlap-check-btn");
const nameInput = document.querySelector(".name-input");
const roomNameInput = document.querySelector(".room-name-input");
nameInput.focus();

// 엔터 막기
document.querySelector(".enter-form").addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
  }
})

const url = "https://project-paper-plane.herokuapp.com/users";
//const url = "http://localhost:5000/users"; // local 테스트용


overlapCheckBtn.addEventListener("click", () => {
  fetch(url).then(res => res.json()).then(res => {
    const userList = res;
    const currentUserName = document.querySelector(".name-input").value;
    const currentRoomName = document.querySelector(".room-name-input").value;
    console.log(currentUserName, currentRoomName);
    if (userList.includes(currentUserName)) {
      announce.textContent = `'${currentUserName}'을/를 사용하는 사용자가 현재 채팅방에 있습니다!`;
    } else if (currentUserName === "") {
      announce.textContent = "닉네임을 입력해 주세요!";
    } else if (currentRoomName === "") {
      announce.textContent = "채팅방 이름을 입력해 주세요!";
    }else {
      announce.textContent = `'${currentUserName}'님 [${currentRoomName}] (으)로 입장할게요✈️`;
      enterBtn.removeAttribute("style");
      overlapCheckBtn.setAttribute("style", "display:none");
      nameInput.setAttribute("style", "display:none");
      roomNameInput.setAttribute("style", "display:none");
    }
  });
})
