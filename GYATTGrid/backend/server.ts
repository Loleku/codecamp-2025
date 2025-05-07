import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Błąd podczas otwierania bazy danych:', err.message);
  } else {
    console.log('Połączono z bazą danych');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Błąd podczas tworzenia tabeli:', err.message);
    } else {
      console.log('Tabela users utworzona.');
    }
  })
});

db.close((err) => {
    if (err) {
      console.error('Błąd podczas zamykania bazy danych:', err.message);
    } else {
      console.log('Połączenie z bazą danych zamknięte.');
    }
});