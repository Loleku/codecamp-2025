import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Links } from "../constants/links";
import { Ollama } from "ollama"; // Ensure the correct Ollama library is installed
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ReportPage = () => {
  const navigate = useNavigate();
  const submittedCode = localStorage.getItem("editorCode") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [thoughtProcess, setThoughtProcess] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [isThoughtProcessVisible, setIsThoughtProcessVisible] = useState(false);

  const id = localStorage.getItem("puzzleId");
  const title = localStorage.getItem("puzzleTitle");

  useEffect(() => {
    const generateReport = async () => {
      const prompt = `
      You are an expert JavaScript code reviewer tasked with critically evaluating the provided code for a programming exercise. Your goal is to identify all errors, inefficiencies, security risks, and deviations from best practices with maximum scrutiny. Provide a structured response in Markdown format with the following sections:
      
      - **Error Line(s)**: Specify the line number(s) where issues are found, or "None" if no issues exist. If multiple issues occur, list each with its line number.
      - **Issue Type**: Categorize each issue (e.g., Syntax Error, Logical Error, Performance Issue, Security Risk, Style Violation, Maintainability Concern, Best Practice Violation).
      - **Explanation**: Provide a detailed, critical explanation of each issue, including why it is problematic, its potential impact (e.g., runtime errors, unexpected behavior, scalability concerns, security vulnerabilities), and any relevant context from the exercise's requirements. Reference modern JavaScript standards (ES2023+), industry best practices, and principles like DRY, KISS, or SOLID where applicable. If no issues are found, state "No issues found" and justify why the code is robust.
      - **Suggestion**: Offer a precise, corrected version of the code or a specific recommendation to address each issue. Include explanations of why the suggestion improves the code (e.g., better performance, readability, or security). If no issues exist, state "N/A" and briefly explain why the code is optimal. Provide code snippets in \`\`\`javascript blocks where relevant.
      - **Additional Notes**: Highlight any overarching concerns (e.g., lack of error handling, poor variable naming, or scalability issues) or commend exceptional aspects of the code (if any). Suggest improvements even for minor inefficiencies or stylistic issues to ensure the code is production-ready.
      
      Before the structured response, include your thought process in a <think> section, detailing how you analyzed the code step-by-step.
      
      Exercise Description: ${title}
      
      Code to Evaluate:
      \`\`\`javascript
      ${submittedCode}
      \`\`\`
      
      Be exhaustive, precise, and professional. Assume the code is intended for a production environment and must adhere to the highest standards of quality, security, and maintainability. Do not overlook subtle issues, such as potential edge cases, type coercion problems, or missing documentation. If the code is perfect, provide a rigorous justification for its correctness and optimality.
      `;

      try {
        const ollama = new Ollama({ host: "https://ollama4.kkhost.pl/" });
        const response = await ollama.chat({
          model: "qwen3:8b",
          messages: [
            {
              role: "system",
              content:
                "You are a code analysis assistant. Provide clear, concise, and accurate error analysis in Markdown format.",
            },
            { role: "user", content: prompt },
          ],
        });

        let result = response.message.content || "";
        console.log("Ollama response:", result);

        // Extract <think> section and the rest of the content
        const thinkMatch = result.match(/<think>([\s\S]*?)<\/think>/);
        const thoughtProcessContent = thinkMatch ? thinkMatch[1].trim() : "";
        const evaluationContent = thinkMatch
          ? result.replace(/<think>[\s\S]*?<\/think>/, "").trim()
          : result;

        setThoughtProcess(thoughtProcessContent);
        setEvaluation(evaluationContent);
      } catch (err) {
        console.error("Ollama error:", err);
        setError("Failed to generate report. Please check the server or try again later.");
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [submittedCode]);

  const handleClick = (action: "home" | "editor") => {
    if (action === "home") navigate(Links.HOME);
    if (action === "editor") navigate(`/editor/${id}`);
  };

  const toggleThoughtProcess = () => {
    setIsThoughtProcessVisible(!isThoughtProcessVisible);
  };

  return (
    <div className="min-h-screen flex justify-center pt-30 bg-[#0A0F1F] p-14 text-gray-300 font-['Segoe UI',sans-serif]">
      <div className="w-[700px] bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-2xl text-white m-0 pb-3 border-b border-gray-800">Reflection Report</h2>

        <Field label="Submitted Code:">
          <pre className="bg-gray-950 text-sm p-4 rounded-xl border border-gray-800 overflow-x-auto font-mono whitespace-pre-wrap">
            {submittedCode}
          </pre>
        </Field>

        {loading ? (
          <p className="text-sm italic text-gray-500">Generating report...</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <>
            <Field label="Thought Process:">
              <button
                className={`w-full text-left py-2 px-4 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors flex items-center ${isThoughtProcessVisible ? "active" : ""}`}
                onClick={toggleThoughtProcess}
              >
                <span className={`mr-2 transition-transform ${isThoughtProcessVisible ? "rotate-90" : ""}`}>
                  ▶
                </span>
                {isThoughtProcessVisible ? "Hide" : "Show"} Thought Process
              </button>
              
              <div
                className={`mt-2 p-4 bg-gray-950 border border-gray-800 rounded-lg ${isThoughtProcessVisible ? "block" : "hidden"}`}
              >
                <Markdown remarkPlugins={[remarkGfm]}>{thoughtProcess}</Markdown>
              </div>
            </Field>
            <p>Report:</p>
            <div
                className={`mt-2 p-4 bg-gray-950 border border-gray-800 rounded-lg`}
            >
              <Field label="">
                <Markdown remarkPlugins={[remarkGfm]}>{evaluation}</Markdown>
              </Field>
            </div>
          </>
        )}

        <div className="mt-4 space-x-4">
          <Button onClick={() => handleClick("home")}>Go to homepage</Button>
          <Button onClick={() => handleClick("editor")}>Try again</Button>
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

function Button({
  children,
  ...rest
}: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="px-6 py-2 text-sm rounded-xl border-2 border-[#0F518C] text-[#208EF3] transition-colors hover:bg-[#0F518C] hover:text-[#0A0F1F]"
    >
      {children}
    </button>
  );
}