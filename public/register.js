const form = document.getElementById('registrationForm');
form.addEventListener('submit', (event) => {
 event.preventDefault(); // Предотвращаем стандартное поведение формы

 const username = document.getElementById('username').value;
 const password = document.getElementById('password').value;

 fetch('/register', {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username, password })
 })
 .then(response => {
  if (!response.ok) {
   return response.json().then(errorData => {
    throw new Error(errorData.error || 'Ошибка регистрации');
   });
  }
  return response.json();
 })
 .then(data => {
  console.log('Регистрация успешна:', data);
  // Перенаправление на главную страницу после успешной регистрации
  window.location.href = 'index.html';
 })
 .catch(error => {
  console.error('Ошибка:', error);
  // Вывести сообщение об ошибке пользователю (например, с помощью alert)
  alert(error.message);
 });
});
