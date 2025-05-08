import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Links } from "../constants/links";

export const ReportPage = () => {
  const navigate = useNavigate();
  const submittedCode = localStorage.getItem("editorCode") || "";
  const [loading, setLoading] = useState(true);
  const [errorLine, setErrorLine] = useState("");
  const [explanation, setExplanation] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const id = localStorage.getItem("puzzleId");

  useEffect(() => {
    const generateReport = async () => {
      const prompt = `
Oceń poniższy kod pod kątem błędów. Dla każdego błędu podaj:
1. Numer linii, w której występuje błąd.
2. Wyjaśnienie, dlaczego to jest błąd.
3. Poprawioną wersję lub sugestię.

Kod:
${submittedCode}
      `;

      try {
        const response = await fetch("https://ollama4.kkhost.pl/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "qwen3:latest",
            prompt,
            max_tokens: 1024,
          }),
        });

        const data = await response.json();
        const result = data.response || "";

        const lineMatch = result.match(/Line\s+\d+:?.*/i);
        const explanationMatch = result.match(/Wyjaśnienie:?.*/i);
        const suggestionMatch = result.match(/Sugestia:?.*/i);

        setErrorLine(lineMatch ? lineMatch[0] : "Brak danych");
        setExplanation(explanationMatch ? explanationMatch[0].replace("Wyjaśnienie:", "").trim() : "Brak danych");
        setSuggestion(suggestionMatch ? suggestionMatch[0].replace("Sugestia:", "").trim() : "Brak danych");
      } catch (error) {
        setErrorLine("Nie udało się wygenerować raportu.");
        setExplanation("Błąd serwera lub sieci.");
        setSuggestion("Spróbuj ponownie później.");
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [submittedCode]);

  const handleClick = (a: Number) => {
    if(a==1) navigate(Links.HOME);
    if(a==2) navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen flex justify-center pt-30 bg-[#0A0F1F] p-14 text-[#D1D5DB] font-['Segoe UI',sans-serif]">
      <div className="w-[700px] bg-[#111827] border border-[#1F2937] rounded-2xl p-8">
        <h2 className="text-2xl text-white m-0 pb-3 border-b border-[#1F2937]">Reflection Report</h2>

        <Field label="Submitted Code:">
          <pre className="bg-[#0F172A] text-sm p-4 rounded-xl border border-[#1F2937] overflow-x-auto font-mono whitespace-pre-wrap">
            {submittedCode}
          </pre>
        </Field>

        {loading ? (
          <p className="text-sm italic text-[#9CA3AF]">Generuję raport...</p>
        ) : (
          <>
            <Field label="Detected Issue:">
              <Input value={errorLine} disabled />
            </Field>

            <Field label="Explanation:">
              <Input value={explanation} disabled />
            </Field>

            <Field label="AI Suggestion:">
              <Input value={suggestion} disabled />
            </Field>
          </>
        )}

        <div className="mt-4 space-x-4">
          <Button onClick={() => handleClick(1)}>Go to homepage</Button>
          <Button onClick={() => handleClick(2)}>Try again</Button>
        </div>
      </div>
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="w-full text-sm px-3 py-2 rounded-xl border border-[#1F2937] bg-[#0F172A] text-[#D1D5DB] disabled:opacity-70"
    />
  );
}

function Button({ children, ...rest }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="px-6 py-2 text-sm rounded-xl border-2 border-[#0F518C] text-[#208EF3] transition-colors hover:bg-[#0F518C] hover:text-[#0A0F1F]"
    >
      {children}
    </button>
  );
}
