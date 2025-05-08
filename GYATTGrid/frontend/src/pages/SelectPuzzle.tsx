import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Links } from "../constants/links";
import type { Puzzle } from "../../../backend/index";

const levels = ['easy', 'medium', 'hard'];
const topics = ['Loops', 'Arrays', 'if statements', 'arithmetics', 'Logic', 'Anything'];

export const PuzzleSelectorPage = () => {
  const [puzzles, setPuzzles] = useState<Record<string, Puzzle>>({});
  const [selectedPuzzleId, setSelectedPuzzleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const fetchPuzzles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/puzzles");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch puzzles");
      }
      const data: Record<string, Puzzle> = await res.json();
      setPuzzles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading puzzles");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzles();
  }, []);

  console.log(puzzles);

  const selectedPuzzle = selectedPuzzleId
    ? puzzles[selectedPuzzleId]
    : undefined;

  const handleStartPuzzle = () => {
    if (selectedPuzzle) {
      navigate(
        Links.EDITOR.replace(
          ":id",
          selectedPuzzle.id.toString()
        )
      );
    }
  };

  const handleGeneratePuzzle = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: levels[Math.floor(Math.random() * levels.length)],
          topic: topics[Math.floor(Math.random() * topics.length)],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to generate puzzle");
      }
      const newPuzzle: Puzzle = await res.json();
      setPuzzles(prev => ({
        ...prev,
        [newPuzzle.id.toString()]: newPuzzle
      }));
      setSelectedPuzzleId(newPuzzle.id.toString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating puzzle");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen font-sans bg-gradient-to-br from-[#072453] to-[#0F518C] pt-32 pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-[#181818f5] rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
            <p className="text-white text-center">Loading puzzles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen font-sans bg-gradient-to-br from-[#072453] to-[#0F518C] pt-32 pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-[#181818f5] rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
            <p className="text-red-400 text-center">{error}</p>
            <button
              onClick={() => {
                setError("");
                fetchPuzzles();
              }}
              className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-[#208EF3] to-[#0F518C] text-white font-medium hover:from-[#0F518C] hover:to-[#208EF3] transition-all duration-300 shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-[#072453] to-[#0F518C] pt-32 pb-10">
      <div className="container mx-auto px-4">
        <div className="bg-[#181818f5] rounded-3xl p-8 max-w-4xl mx-auto shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">
              Select a Puzzle
            </h1>
            <button
              onClick={handleGeneratePuzzle}
              disabled={generating}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 shadow-md ${
                generating
                  ? "bg-gray-600 cursor-wait"
                  : "bg-gradient-to-r from-[#208EF3] to-[#0F518C] hover:from-[#0F518C] hover:to-[#208EF3]"
              }`}
            >
              {generating ? "Generating..." : "Generate New Puzzle"}
            </button>
          </div>

          <select
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#208EF3] focus:outline-none transition-colors"
            value={selectedPuzzleId}
            onChange={e => setSelectedPuzzleId(e.target.value)}
          >
            <option value="">Choose a puzzle...</option>
            {Object.values(puzzles).map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {selectedPuzzle && (
            <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-[#208EF3]">
                {selectedPuzzle.title}
              </h2>
              <p className="text-gray-300 mb-6">
                {selectedPuzzle.description}
              </p>
              <button
                onClick={handleStartPuzzle}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#208EF3] to-[#0F518C] text-white font-medium hover:from-[#0F518C] hover:to-[#208EF3] transition-all duration-300 shadow-md"
              >
                Start Puzzle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
