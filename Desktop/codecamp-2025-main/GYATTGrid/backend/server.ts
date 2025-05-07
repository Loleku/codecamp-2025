import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import type { Request, Response } from 'express';
import type { RunResult, Database } from 'sqlite3';
import jwt from 'jsonwebtoken';
import { apiApp } from './index';
import axios from 'axios';

const app = express();
const PORT = 3001;
const OLLAMA_API = 'http://localhost:11434/api/generate';

app.use(cors());
app.use(bodyParser.json());

app.use('/', apiApp);

const db: Database = new sqlite3.Database('users.db');

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS puzzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    template TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

const defaultPuzzles = [
  {
    title: "FizzBuzz",
    description: "Write a program that prints the numbers from 1 to 100. But for multiples of three print 'Fizz' instead of the number and for the multiples of five print 'Buzz'. For numbers which are multiples of both three and five print 'FizzBuzz'.",
    template: "function fizzBuzz() {\n  // Your code here\n}",
    difficulty: "Easy",
    created_at: new Date().toISOString()
  },
  {
    title: "Palindrome Checker",
    description: "Check if a given string is a palindrome. A palindrome is a word, phrase, or sequence that reads the same backward as forward.",
    template: "function isPalindrome(str) {\n  // Your code here\n}",
    difficulty: "Easy",
    created_at: new Date().toISOString()
  },
  {
    title: "Anagram Finder",
    description: "Write a function to check whether two given strings are anagrams of each other or not.",
    template: "function areAnagrams(str1, str2) {\n  // Your code here\n}",
    difficulty: "Medium",
    created_at: new Date().toISOString()
  },
  {
    title: "Array Rotation",
    description: "Write a function that rotates an array by a given number of positions. For example, rotating [1, 2, 3, 4, 5] by 2 positions should give [4, 5, 1, 2, 3].",
    template: "function rotateArray(arr, positions) {\n  // Your code here\n}",
    difficulty: "Medium",
    created_at: new Date().toISOString()
  },
  {
    title: "Binary Search",
    description: "Implement a binary search algorithm to find a target value in a sorted array. Return the index of the target if found, or -1 if not found.",
    template: "function binarySearch(arr, target) {\n  // Your code here\n}",
    difficulty: "Hard",
    created_at: new Date().toISOString()
  }
];

let isOllamaAvailable = false;

async function checkOllamaAvailability() {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    const models = response.data.models || [];
    const hasCodeLlama = models.some((model: any) => model.name === 'codellama:latest');
    
    if (hasCodeLlama) {
      isOllamaAvailable = true;
      console.log('Ollama and CodeLlama model are available for puzzle generation');
    } else {
      console.log('CodeLlama model not found. Please run: ollama pull codellama');
      isOllamaAvailable = false;
    }
  } catch (error) {
    console.log('Ollama is not available. Using predefined puzzles instead.');
    console.error('Ollama error:', error);
    isOllamaAvailable = false;
  }
}

checkOllamaAvailability();

db.get("SELECT COUNT(*) as count FROM puzzles", (err: Error | null, row: { count: number } | undefined) => {
  if (err) {
    console.error("Error checking puzzles table:", err);
    return;
  }
  if (!row) {
    console.error("No count returned from puzzles table");
    return;
  }
  
  if (row.count === 0) {
    const stmt = db.prepare(
      'INSERT INTO puzzles (title, description, template, difficulty, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    
    defaultPuzzles.forEach(puzzle => {
      stmt.run(
        puzzle.title,
        puzzle.description,
        puzzle.template,
        puzzle.difficulty,
        puzzle.created_at
      );
    });
    
    stmt.finalize();
    console.log("Default puzzles inserted");
  }
});

interface Puzzle {
  title: string;
  description: string;
  template: string;
  difficulty: string;
  created_at: string;
}

interface UserRow {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
}

async function generatePuzzle(difficulty: string): Promise<Puzzle> {
  if (!isOllamaAvailable) {
    console.log('Using fallback puzzle generation');
    const matchingPuzzles = defaultPuzzles.filter(p => p.difficulty === difficulty);
    if (matchingPuzzles.length === 0) {
      console.log(`No puzzles found for difficulty ${difficulty}, selecting random puzzle`);
      const randomPuzzle = defaultPuzzles[Math.floor(Math.random() * defaultPuzzles.length)];
      return {
        ...randomPuzzle,
        created_at: new Date().toISOString()
      };
    }
    const randomPuzzle = matchingPuzzles[Math.floor(Math.random() * matchingPuzzles.length)];
    return {
      ...randomPuzzle,
      created_at: new Date().toISOString()
    };
  }

  const prompt = `Generate a coding puzzle with the following format:
Title: [Puzzle Title]
Description: [Clear description of the task]
Template: [JavaScript function template with comments]
Difficulty: ${difficulty}

The puzzle should be challenging but solvable, and should test fundamental programming concepts.
Make sure to follow the exact format above with Title:, Description:, and Template: labels.
Keep the template simple and focused on a single function.`;

  try {
    console.log('Generating puzzle with Ollama...');
    const response = await axios.post(OLLAMA_API, {
      model: "codellama",
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1000
      }
    });

    const generatedText = response.data.response;
    console.log('Received response from Ollama');
    
    const titleMatch = generatedText.match(/Title:\s*(.*?)(?=\n|$)/);
    const descriptionMatch = generatedText.match(/Description:\s*([\s\S]*?)(?=Template:|$)/);
    const templateMatch = generatedText.match(/Template:[\s\n]*([\s\S]*?)(?=Difficulty:|$)/);
    
    if (!titleMatch?.[1] || !descriptionMatch?.[1] || !templateMatch?.[1]) {
      console.error('Failed to parse generated puzzle. Raw response:', generatedText);
      throw new Error('Failed to parse generated puzzle');
    }

    const puzzle = {
      title: titleMatch[1].trim(),
      description: descriptionMatch[1].trim(),
      template: templateMatch[1].trim().replace(/```(javascript|js)?\n?/g, '').replace(/```\n?/g, ''),
      difficulty: difficulty,
      created_at: new Date().toISOString()
    };

    console.log('Successfully generated puzzle:', puzzle.title);
    return puzzle;
  } catch (error) {
    console.error('Error generating puzzle with Ollama:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
    console.log('Falling back to predefined puzzles');
    return generatePuzzle(difficulty);
  }
}

app.post('/api/puzzles/generate', async (req: Request, res: Response) => {
  try {
    const { difficulty = 'Medium' } = req.body;
    const puzzle = await generatePuzzle(difficulty);
    
    const stmt = db.prepare(
      'INSERT INTO puzzles (title, description, template, difficulty, created_at) VALUES (?, ?, ?, ?, ?)'
    );
    
    stmt.run(
      puzzle.title,
      puzzle.description,
      puzzle.template,
      puzzle.difficulty,
      puzzle.created_at,
      function(this: RunResult, err: Error | null) {
        if (err) {
          return res.status(500).json({ message: 'Error saving puzzle' });
        }
        res.status(201).json({ ...puzzle, id: this.lastID });
      }
    );
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in puzzle generation:', error);
    res.status(500).json({ message: 'Error generating puzzle' });
  }
});


app.get('/api/puzzles', (req: Request, res: Response) => {
  db.all('SELECT * FROM puzzles', (err: Error | null, rows: Puzzle[]) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching puzzles' });
    }
    res.json(rows);
  });
});

app.get('/api/puzzle/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM puzzles WHERE id = ?', [id], (err: Error | null, row: Puzzle | undefined) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching puzzle' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Puzzle not found' });
    }
    res.json(row);
  });
});

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
});

app.post('/login', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? AND email = ?',
    [username, email],
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
