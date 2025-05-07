export const ReportPage = () => {
  return (
    <div className="min-h-screen flex justify-center bg-[#0A0F1F] p-14 text-[#D1D5DB] font-[\'Segoe UI\',sans-serif]">
      <div className="w-[700px] bg-[#111827] border border-[#1F2937] rounded-2xl p-8">
        <h2 className="text-2xl text-white m-0 pb-3 border-b border-[#1F2937]">Reflection Report</h2>

        {/* Submitted code */}
        <Field label="Submitted Code:">
          <pre className="bg-[#0F172A] text-sm p-4 rounded-xl border border-[#1F2937] overflow-x-auto font-mono">
            (Błędny kod) <span className="bg-[#FF3366] text-white px-1 rounded-md">Line ?: błąd</span>
          </pre>
        </Field>

        {/* Detected issue */}
        <Field label="Detected Issue:">
          <Input value="Line ?: Pisze czemu jest błąd" disabled />
        </Field>

        {/* AI suggestion */}
        <Field label="AI Suggestion:">
          <Input value="Sugestia ai" disabled />
        </Field>

        <div className="mt-4 space-x-4">
          <Button onClick={() => alert("Saved!")}>Go to homepage</Button>
          <Button>Try again</Button>
        </div>
      </div>
    </div>
  );
}

/********************
 * Helper components
 ********************/
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
      className="px-6 py-2 text-sm rounded-xl border-2 border-[#00FFFF] text-[#00FFFF] transition-colors hover:bg-[#00FFFF] hover:text-[#0A0F1F]"
    >
      {children}
    </button>
  );
}
