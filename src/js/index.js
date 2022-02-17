const enterBtn = document.querySelector(".enter-btn");
enterBtn.addEventListener("click", () => {
  const userName = document.querySelector(".name-input").value;
  localStorage.setItem("userName", userName);
})