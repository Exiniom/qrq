//ym.js (пример, замените на ваш реальный код)
//Здесь может быть ваш код для управления устройствами "умного дома"
console.log("ym.js loaded");

const controlButtons = document.querySelectorAll('.control-button');
controlButtons.forEach(button => {
 button.addEventListener('click', () => {
  const device = button.dataset.device;
  let state = button.dataset.state === 'off' ? 1 : 0; // 1 - on, 0 - off
  button.dataset.state = state === 1 ? 'on' : 'off';
  button.textContent = state === 1 ? 'Выключить' : 'Включить';


  //Отправка запроса на сервер
  fetch(`/devices/${device}`, {
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state })
   })
   .then(response => {
    if (!response.ok) {
     console.error("Ошибка обновления состояния устройства:", response);
    }
   })
   .catch(error => {
    console.error("Ошибка сети:", error)
   });

 });
});
