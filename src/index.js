const announce = document.querySelector(".announce");
const enterBtn = document.querySelector(".enter-btn");
const overlapCheckBtn = document.querySelector(".overlap-check-btn");
const nameInput = document.querySelector(".name-input");

// 엔터 막기
document.querySelector(".enter-form").addEventListener("keypress", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
  }
})

const url = "https://project-paper-plane.herokuapp.com";

overlapCheckBtn.addEventListener("click", () => {
  fetch(url).then(res => res.json()).then(res => {
    const userList = res;
    const currentUserName = document.querySelector(".name-input").value;
    console.log(currentUserName)
    if (userList.includes(currentUserName)) {
      announce.textContent = `'${currentUserName}'을/를 사용하는 사용자가 현재 채팅방에 있습니다!`;
    } else if (currentUserName === "") {
      announce.textContent = "이름을 입력해 주세요!";
    } else {
      announce.textContent = `'${currentUserName}'은/는 사용 가능한 닉네임 입니다:)`;
      enterBtn.removeAttribute("style");
      overlapCheckBtn.setAttribute("style", "display:none");
      nameInput.setAttribute("style", "display:none");
    }
  });
})
