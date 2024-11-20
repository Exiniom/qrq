const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database(':memory:', (err) => {
 if (err) {
  console.error(err.message);
 }
 console.log('Connected to the in-memory SQlite database.');

 db.run(`
  CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT UNIQUE NOT NULL,
   password TEXT NOT NULL
  )
 `, (err) => {
  if (err) {
   console.error(err.message);
  } else {
   console.log('Table "users" created or already exists.');
  }
 });
});

app.use(express.json());
app.use(express.static('public'));


app.post('/register', (req, res) => {
 const { username, password } = req.body;

 //Проверка на пустые поля
 if (!username || !password) {
  return res.status(400).json({ error: 'Пожалуйста, заполните все поля.' });
 }

 db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
  if (err) {
   console.error("Ошибка базы данных при проверке пользователя:", err);
   return res.status(500).json({ error: 'Ошибка сервера' });
  }
  if (row) {
   return res.status(400).json({ error: 'Пользователь уже существует' });
  }

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
   if (err) {
    console.error("Ошибка базы данных при добавлении пользователя:", err);
    return res.status(500).json({ error: 'Ошибка сервера' });
   }
   res.json({ message: 'Регистрация успешна', userId: this.lastID });
  });
 });
});

app.listen(port, () => {
 console.log(`Сервер запущен на порту ${port}`);
});

process.on('SIGINT', () => {
 db.close((err) => {
  if (err) {
   return console.error(err.message);
  }
  console.log('Close the database connection.');
  process.exit(0);
 });
});

//Обработка ошибок 404 (страница не найдена) для всех остальных запросов.
app.use((req, res) => {
 res.status(404).json({ error: 'Страница не найдена' });
});

//Обработка ошибок сервера
app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).json({ error: 'Произошла внутренняя ошибка сервера' });
});
