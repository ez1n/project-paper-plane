const nameInput = document.querySelector('.name-input');
const enterBtn = document.querySelector('.enter-btn');
const photoInput = document.querySelector('#upload-photo');

enterBtn.addEventListener('click', () => {
  const data = {
    name: nameInput.value
  };
  alert(data.name);
});