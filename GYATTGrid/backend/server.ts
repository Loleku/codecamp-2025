const express = require('express');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
import type { Request, Response } from 'express';
import type { RunResult } from 'sqlite3';
import jwt from 'jsonwebtoken';
import { apiApp } from './index';


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/', apiApp);

const db = new sqlite3.Database('users.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

app.post('/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
  }

  const createdAt = new Date().toISOString();

  const stmt = db.prepare(
    'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)'
  );
  stmt.run(username, email, password, createdAt, function (this: RunResult, err: Error | null) {
    if (err) {
      return res.status(400).json({ message: 'Użytkownik z takim emailem lub nazwą użytkownika już istnieje.' });
    }
    res.status(201).json({ message: 'Użytkownik zarejestrowany.', id: this.lastID });
  });

  console.log(`Zarejestrowano użytkownika ${username}, ${email}, ${password}`);

  // db.all("SELECT * FROM users", (err: Error | null, rows: Array<{ id: number; username: string; email: string; password: string }>) => {
  //   if (err) {
  //     console.error("Błąd podczas pobierania danych:", err);
  //     return;
  //   }
  //   console.log("Użytkownicy:", rows);
  // });
});

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
  }

  interface UserRow {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: string;
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err: Error | null, row: UserRow | undefined) => {
      if (err) {
        return res.status(500).json({ message: 'Błąd bazy danych.' });
      }

      if (!row) {
        return res.status(400).json({ message: 'Nie znaleziono użytkownika.' });
      }

      if (row.password !== password) {
        return res.status(400).json({ message: 'Nieprawidłowe hasło.' });
      }

      const token = jwt.sign(
        {
          id: row.id,
          username: row.username,
          email: row.email,
          created_at: row.created_at
        },
        "g!y!a!t@t*g9r@i/d",
        { expiresIn: '168h' }
      );
      

      res.status(200).json({ message: 'Zalogowano pomyślnie.', token });
    }
  );
});


app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
