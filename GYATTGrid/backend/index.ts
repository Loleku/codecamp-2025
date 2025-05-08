import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import os from 'os';
import path from 'path'
import fs from 'fs';
import { performance } from 'perf_hooks';
import { spawnSync } from 'child_process';
import { Ollama } from 'ollama';


export const apiApp = express.Router();

export type Puzzle = {
    id: string,
    title: string,
    description: string,
    template: string,
    hints: string[],
    tests: { id: number, input: string, expected: string }[]
};

const puzzles: Record<string, Puzzle> = {}
const hintCounters: Record<string, number> = {};

let currId = 1;

// test
puzzles['0'] = {
  id: '0',
  title: "Sum of two numbers",
  description: 'Make a function that returns sum of two numbers. Name your function "solve"',
  template: 'function solve(a,b) { return /* … */ }',
  hints: ['Hint 1', 'Hint 2'],
  tests: [
    { id: 1, input: '2 3', expected: '5' },
    { id: 2, input: '10 15', expected: '25' }
  ]
}
hintCounters['0'] = 0

apiApp.use(cors());
apiApp.use(bodyParser.json());

apiApp.get('/api/puzzles', (req: Request, res: Response) => {
  res.status(200).send(puzzles);
})

apiApp.post('/api/puzzle', async (req: Request, res: Response) => {
  const { level, topic } = req.body

  const prompt = [
    '/no_think',
    `Create a programming puzzle as JSON with keys:`,
    `  • title (string)`,
    `  • description (string)`,
    `  • template(JS, function must be named "solve") (string)`,
    `  • hints (array of strings)`,
    `  • tests (array of {id,input,expected})`,
    `Difficulty Level: ${level}, Topic: ${topic}.`,
    `Respond with JSON only.`
  ].join('\n')

  try {
    const ollama = new Ollama({ host: 'https://ollama4.kkhost.pl' })
    const aiResponse = await ollama.generate({
      model: 'qwen3:8b',
      prompt,
      stream: false,
    })

    const raw: string =
      (aiResponse as any).response
      || (aiResponse as any).completions?.[0]?.message?.content
      || (aiResponse as any).message?.content
      || ''

    if (!raw) {
      console.error('Brak treści w odpowiedzi AI:', aiResponse)
      throw new Error('Invalid AI response format')
    }

    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

    const puzzleNoID: Puzzle = JSON.parse(cleaned)

    const puzzle: Puzzle = { ...{id: `${currId++}`}, ...puzzleNoID }
    puzzles[puzzle.id] = puzzle
    hintCounters[puzzle.id] = 0

    return res.status(201).json(puzzle)
  } catch (e) {
    console.error('Error while generating puzzle:', e)
    return res.status(500).json({ message: 'Error while generating puzzle' })
  }
})

apiApp.get('/api/puzzle/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const puzzle = puzzles[id];

    if (!puzzle){
      res.status(404).send({ message: "Puzzle not found" });
      return;
    }
      

    res.status(200).send(puzzle);
})

apiApp.post('/api/test/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { code } = req.body as { code: string };
  const puzzle = puzzles[id];

  if (!puzzle) {
    res.status(404).send({ message: "Puzzle not found" });
    return;
  }

  const results: any[] = [];
  let log = '';

  puzzle.tests.forEach(test => {
    const tempDir = os.tmpdir();
    const fileName = `puzzle_${id}_${test.id}_${new Date().toDateString()}.js`;
    const filePath = path.join(tempDir, fileName);
    const wrapiApper = `
      const fs = require('fs');
      const input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(x => isNaN(x) ? x : Number(x));
      ${code}
      (async () => {
        try {
          const result = solve(...input);
          console.log(result);
        } catch (err) {
          console.error(err);
          process.exit(1);
        }
      })();
    `;

    fs.writeFileSync(filePath, wrapiApper);
    const startTime = performance.now();
    const cp = spawnSync('node', [filePath], {
      encoding: 'utf-8',
      input: test.input
    });
    const duration = performance.now() - startTime;
    let status: 'pass' | 'fail' = 'fail';
    let output = '';

    if (cp.error || cp.status !== 0)
      output = cp.stderr || cp.error?.message || '';
    else {
      output = (cp.stdout || '').trim();
      status = output === test.expected ? 'pass' : 'fail';
    }

    let runtimeExceed;

    if(Number.parseFloat(duration.toFixed(2)) > 5000.00) runtimeExceed = "Maximum execution time exceeded";

    log += `Test ${test.id}: ${status}
Input: ${test.input}
Expected: ${test.expected}, Got: ${output}
Runtime: ${runtimeExceed ? runtimeExceed : duration.toFixed(2) + "ms"}

`;

    results.push({ id: test.id, status, time: duration.toFixed(2), memory: 0 })
    
    try { fs.unlinkSync(filePath); } catch {}
  })

  res.status(201).send({ results, log: log });
})

apiApp.get('/api/hint/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const puzzle = puzzles[id];
  
  if (!puzzle) {
    res.status(404).send({ message: "Puzzle not found" });
    return;
  }

  const idx = hintCounters[id] || 0;
  const hint = puzzle.hints[idx] || 'No more hints available.';
  hintCounters[id] = idx + 1;

  res.status(200).send(hint);
})
