import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import os from 'os';
import path from 'path'
import fs from 'fs';
import { performance } from 'perf_hooks';
import { spawnSync } from 'child_process';


const app = express();
const PORT = 2008;

type Puzzle = {
    id: string,
    template: string,
    hints: string[],
    tests: { id: number, input: string, expected: string }[]
};

const puzzles: Record<string, Puzzle> = {}
const hintCounters: Record<string, number> = {};

app.use(cors());
app.use(bodyParser.json());

app.post('/api/puzzle', async (req, res) => {
  const { level, topic } = req.body;
  try {
    const prompt = `Create a programming puzzle as JSON with keys id (string), template (string), hints (array of strings), and tests (array of {id,input,expected}). Difficulty Level: ${level}, Topic: ${topic}. Respond with JSON only.`;

    const response = await fetch('https://ollama4.kkhost.pl/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'qwen3:latest', prompt, max_tokens: 1024 })
    });

    // debugging
    const raw = await response.text();
    console.log('raw AI answer:\n', raw);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('json not found in AI response');
      throw new Error('Invalid AI response format');
    }

    let body: any;
    try {
      body = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('error parsing json:\n', jsonMatch[0]);
      throw e;
    }

    const content = body.completions?.[0]?.message?.content || body.choices?.[0]?.text;
    const puzzle: Puzzle = JSON.parse(content);
    puzzles[puzzle.id] = puzzle;
    hintCounters[puzzle.id] = 0;
    res.status(201).send(puzzle);
  } catch (e) {
    console.error("Error while generating: ", e);
    res.status(500).send({ message: "Error while generating" });
  }
})

app.get('/api/puzzle/:id/template', (req, res) => {
    const id = req.params.id;
    const puzzle = puzzles[id];

    if (!puzzle){
      res.status(404).send({ message: "Puzzle not found" });
      return;
    }
      

    res.status(200).send(puzzle.template);
})

app.post('/api/test/:id', (req, res) => {
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
    const wrapper = `
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

    fs.writeFileSync(filePath, wrapper);
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

    log += `
      Test ${test.id}: ${status}
      Input: ${test.input}
      Expected: ${test.expected}, Got: ${output}
      Runtime: ${duration.toFixed(2)}
    `;

    results.push({ id: test.id, status, time: duration.toFixed(2), memory: 0 })
    
    try { fs.unlinkSync(filePath); } catch {}
  })

  res.status(201).send({ results, log: log });
})

app.get('/api/hint/:id', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
});




