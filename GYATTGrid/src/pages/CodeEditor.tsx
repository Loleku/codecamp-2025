import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";

export const CodeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    
    const [desc, setDesc] = useState("");
    const [code, setCode] = useState("");
    const [logs, setLogs] = useState("");
    const [result, setResult] = useState<Record<string, string>[]>([]);
    const [hint, setHint] = useState("");
    const [loading, setLoading] = useState(false);

    console.log(id);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/puzzle/${id}`);
            
                if (!response.ok)
                    throw new Error("Puzzle not found");

                const data = await response.json();
                setDesc(data.description)
                setCode(data.template);
            } catch (e) {
                console.log(e);
                navigate('/select');
            }
        }
        
        loadData();
    }, []);

    const runTests = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/api/test/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
            setResult(data.results);
            setLogs(data.log);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const loadHint = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/hint/${id}`);
            const data = await response.text();
            setHint(data);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex h-full bg-slate-800 text-gray-100 pt-16">
            <div className="w-3/4 p-8">
                {desc && (
                    <div className="mb-6 p-4 bg-gray-800 rounded text-gray-200">
                      {desc}
                    </div>
                )}
                <Editor 
                    height="calc(100vh - 2rem)"
                    defaultLanguage="javascript"
                    value={code}
                    theme="vs-dark"
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                    onChange={v => setCode(v || '')}
                />
            </div>

            <div className="w-1/4 border-l border-gray-600 p-4 flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-logoBlue">Test</h2>

                <button onClick={runTests} disabled={loading} 
                className="mb-3 w-full bg-gradient-to-r from-[#208EF3] to-[#0F518C] text-white py-2 rounded-lg hover:opacity-90 transition"
                >
                    {loading ? "Running tests..." : "Test"}
                </button>

                <button onClick={loadHint} className="mb-4 w-full bg-slate-500 text-gray-900 py-2 rounded-lg hover:opacity-90 transition">
                    Hint
                </button>

                {hint && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg text-sm">
                        {hint}
                    </div>
                )}

                <div className="flex-1 overflow-auto bg-gray-900 p-3 rounded-lg">
                    {logs ? (
                        logs.split('\n').map((l, i) => (
                            <pre key={i} className="text-xs">{l}</pre>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">Logs will show here after testing.</p>
                    )
                }
                </div>
            </div>
        </div>
    )
}