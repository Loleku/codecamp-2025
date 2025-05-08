import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { Links } from "../constants/links";

export const CodeEditor = () => {
  const { id } = useParams();
  if (id) {
    localStorage.setItem("puzzleId", id);
  }

  const navigate = useNavigate();

  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState<Record<string, string>[]>([]);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  // const editorCode = localStorage.getItem("editorCode")

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/puzzle/${id}`
        );
        if (!response.ok) throw new Error("Puzzle not found");
        const data = await response.json();
        setDesc(data.description);
        setTitle(data.title)
        // if(editorCode) setCode(editorCode);
        setCode(data.template);
      } catch {
        navigate("/select");
      }
    };
    loadData();
  }, [id, navigate]);

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/test/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      // localStorage.setItem("editorCode", code)
      const data = await response.json();
      setResult(data.results);
      setLogs(data.log);
      setPopup(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadHint = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/hint/${id}`);
      const text = await response.text();
      setHint(text);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="font-sans flex h-full bg-[#051C41] text-gray-100 pt-16">
      <div className="w-3/4 p-8 space-y-6">
        {desc && title && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700">
            <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>
            <p className="text-gray-300">{desc}</p>
          </div>
        )}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <Editor
            height="calc(100vh - 12rem)"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
            }}
            onChange={(v) => setCode(v || "")}
          />
        </div>
      </div>

      <div className="w-1/4 border-l border-gray-700 p-6 flex flex-col space-y-5">
        <h2 className="text-2xl font-bold mb-2 text-logoBlue">Test</h2>

        <button
          onClick={runTests}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium transition 
            ${loading
              ? "bg-blue-400 cursor-wait"
              : "bg-gradient-to-r from-[#208EF3] to-[#0F518C] hover:from-[#0F518C] hover:to-[#208EF3] shadow-md"}
          `}
        >
          {loading ? "Running tests…" : "Run Tests"}
        </button>

        <button
          onClick={loadHint}
          className="w-full py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition shadow-sm"
        >
          Show Hint
        </button>

        {hint && (
          <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 shadow-inner">
            {hint}
          </div>
        )}

        <div className="flex-1 bg-gray-800 p-4 rounded-lg overflow-auto shadow-inner">
        {logs ? (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-200 leading-relaxed">
            {logs.trim()}
            </pre>
        ) : (
            <p className="text-gray-500 text-sm">
            Your logs will appear here…
            </p>
        )}
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans">
          <div className="bg-gray-800 text-gray-100 rounded-xl w-11/12 max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Test Results</h3>
              <button
                onClick={() => setPopup(false)}
                className="text-gray-400 hover:text-gray-200 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="divide-y divide-gray-700 max-h-80 overflow-auto">
              {result.map((r) => (
                <div
                  key={r.id}
                  className="flex justify-between items-center py-3"
                >
                  <span className="font-medium">Test {r.id}</span>
                  <span
                    className={`font-semibold ${
                      r.status === "pass" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {r.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">{r.time} ms</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4 text-center">
                <Link to={Links.REPORT} className="hidden lg:block bg-[#208EF3] text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-[#0F518C]">
                    More Puzzles
                </Link>
                <Link to={Links.REPORT} className="hidden mt-5 lg:block bg-[#208EF3] text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-[#0F518C]">
                    View report
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
