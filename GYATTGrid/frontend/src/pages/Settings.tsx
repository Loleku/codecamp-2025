import { useState } from "react";
import { FaUser } from "react-icons/fa";

/**
 * SettingsApp – Full Tailwind CSS rewrite (all 9 sections wired‑up).
 * -------------------------------------------------------------------------
 * • Single‑file React component (drop‑in).
 * • Pure Tailwind utility classes (no external CSS).
 * • Matches original dark‑neon aesthetic 1‑for‑1.
 */

// Sidebar items in original order
interface NavItem {
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: "General", id: "general" },
  { label: "Account", id: "account" },
  { label: "Appearance", id: "appearance" },
  { label: "Notifications", id: "notifications" },
  { label: "Privacy", id: "privacy" },
  { label: "Analytics", id: "analytics" },
  { label: "Subscription", id: "subscription" },
  { label: "Security", id: "security" },
  { label: "About", id: "about" }
];

export const SettingsPage = () => {
  const [active, setActive] = useState<string>("general");

  return (
    <div className="flex min-h-screen bg-[#0A0F1F] text-[#D1D5DB]">
      {/* ───────── Sidebar ───────── */}
      <nav className="w-[250px] flex flex-col bg-[#1a2336] border-r border-[#1F2937]">
        <h2 className="mt-20 px-4 py-6 text-lg font-semibold text-white border-b border-[#1F2937]">
          Settings
        </h2>
        {navItems.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActive(id)}
            className={`px-4 py-4 cursor-pointer border-b border-[#1F2937] transition-colors hover:bg-[#0F518C] ${
              active === id
                ? " text-[#208EF3] font-semibold border-l-4"
                : ""
            }`}
          >
            {label}
          </div>
        ))}
      </nav>

      {/* ───────── Main content ───────── */}
      <main className="flex-1 p-8 bg-[#0A0F1F] mt-20">
        {navItems.map(({ id }) => (
          <Section key={id} id={id} active={active} />
        ))}
      </main>
    </div>
  );
}

/*********************************
 * Generic section shell
 *********************************/
interface SectionProps {
  id: string;
  active: string;
}

function Section({ id, active }: SectionProps) {
  const isActive = active === id;
  if (!isActive) return null; // hides the inactive ones entirely
  return (
    <section
      id={id}
      className="animate-[fadeIn_0.25s_ease-in]" /* relies on default Tailwind JIT arbitrary keyframes */
    >
      {renderSectionContent(id)}
    </section>
  );
}

/*********************************
 * Content renderer (switch‑case)
 *********************************/
function renderSectionContent(id: string): React.ReactElement | null {
  switch (id) {
    /* ───────── General ───────── */
    case "general":
      return (
        <>
          <Header title="General Settings" desc="Configure general puzzle settings and preferences." />
          {/* Language */}
          <Field label="Interface Language">
            <Select list={["English", "Polski", "Español", "Français", "Deutsch", "日本語", "中文"]} />
          </Field>
          {/* Code language */}
          <Field label="Default Code Language">
            <Select list={["Python", "JavaScript", "Java", "C++", "C#", "Ruby", "Go", "Rust"]} />
          </Field>
          {/* Toggles */}
          <Toggle label="Auto‑save solutions" defaultChecked />
          <Toggle label="Show compiler hints" defaultChecked />
          <SaveButton />
        </>
      );

    /* ───────── Account ───────── */
    case "account":
      return (
        <>
          <Header title="Account" desc="Manage your account information and credentials." />
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
            <FaUser className="w-16 h-16 text-gray-400" />
          </div>
          <div>
            <button className="mt-6 mr-5 border-2 border-[#FF3366] text-[#FF3366] px-6 py-3 rounded-xl text-sm transition-colors hover:bg-[#FF3366] hover:text-white">
              Reset password
            </button>
            <button className="mt-6 mr-5 border-2 border-[#FF3366] text-[#FF3366] px-6 py-3 rounded-xl text-sm transition-colors hover:bg-[#FF3366] hover:text-white">
              Delete Account
            </button>
            <button className="mt-6 border-2 border-[#FF3366] text-[#FF3366] px-6 py-3 rounded-xl text-sm transition-colors hover:bg-[#FF3366] hover:text-white">
              Change your username
            </button>
          </div>
        </>
      );

    /* ───────── Appearance ───────── */
    case "appearance":
      return (
        <>
          <Header title="Appearance" desc="Personalize the interface theme and accent." />
          {/* Theme mode */}
          <Field label="Theme">
            <Select list={["Dark", "Light", "System"]} />
          </Field>
          {/* Accent color */}
          <Field label="Accent Color">
            <div className="grid grid-cols-6 gap-3 w-72">
              {[
                "#208EF3",
                "#FF00CC",
                "#FF3366",
                "#22C55E",
                "#3B82F6",
                "#F59E0B"
              ].map((hex) => (
                <AccentSwatch key={hex} color={hex} />
              ))}
            </div>
          </Field>
          <Toggle label="Animate UI elements" defaultChecked />
          <SaveButton />
        </>
      );

    /* ───────── Notifications ───────── */
    case "notifications":
      return (
        <>
          <Header title="Notifications" desc="Control how we keep you in the loop." />
          <Toggle label="Email notifications" defaultChecked />
          <Toggle label="Push notifications" />
          <Toggle label="SMS notifications" />
          <Toggle label="Weekly summary" defaultChecked />
          <SaveButton />
        </>
      );

    /* ───────── Privacy ───────── */
    case "privacy":
      return (
        <>
          <Header title="Privacy" desc="Choose what you share and what stays private." />
          <Toggle label="Public profile" defaultChecked />
          <Toggle label="Show activity status" />
          <Toggle label="Allow search engines to index my profile" />
          <Field label="Blocked users">
            <Textarea placeholder="user1, user2, …" />
          </Field>
          <SaveButton />
        </>
      );

    /* ───────── Analytics ───────── */
    case "analytics":
      return (
        <>
          <Header title="Analytics" desc="Control sharing of usage analytics." />
          <Toggle label="Send anonymous usage data" defaultChecked />
          <Toggle label="Crash reports" defaultChecked />
          <Toggle label="Personalized tips based on my activity" />
          <SaveButton />
        </>
      );

    /* ───────── Subscription ───────── */
    case "subscription":
      return (
        <>
          <Header title="Subscription" desc="Manage your plan and billing details." />
          <div className="border border-[#1F2937] rounded-xl p-6 w-72 mb-6">
            <p className="text-sm text-white mb-2">Current plan</p>
            <p className="text-lg font-semibold text-[#208EF3] mb-4">Pro Yearly</p>
            <button className="border-2 border-[#208EF3] text-[#208EF3] px-4 py-2 rounded-xl text-sm transition-colors hover:bg-[#208EF3] hover:text-[#0A0F1F] w-full mb-2">
              Upgrade / Downgrade
            </button>
            <button className="border-2 border-[#FF3366] text-[#FF3366] px-4 py-2 rounded-xl text-sm transition-colors hover:bg-[#FF3366] hover:text-white w-full">
              Cancel Subscription
            </button>
          </div>
          <Field label="Payment method">
            <Select list={["Visa **** 4242", "Mastercard **** 1964", "Add new card…"]} />
          </Field>
          <SaveButton />
        </>
      );

    /* ───────── Security ───────── */
    case "security":
      return (
        <>
          <Header title="Security" desc="Protect your account with extra layers." />
          <Toggle label="Two‑factor authentication (2FA)" defaultChecked />
          <Field label="Backup email">
            <Input type="email" placeholder="backup@example.com" />
          </Field>
          <button className="mt-2 border border-[#1F2937] px-3 py-2 rounded-xl text-xs hover:bg-[#1F2937]">
            View recent login history
          </button>
          <SaveButton />
        </>
      );

    /* ───────── About ───────── */
    case "about":
      return (
        <>
          <Header title="About" desc="Version, credits, and open‑source licenses." />
          <p className="mb-4 text-sm text-[#999]">Version 2.8.5 – May 2025</p>
          <p className="mb-4 max-w-[600px] text-sm">
            © 2025 Puzzle Corp. Built with ♥ by the Puzzle team. Portions of this
            software are licensed under MIT.
          </p>
          <a
            href="https://github.com/puzzlecorp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#208EF3] hover:underline text-sm"
          >
            GitHub repository →
          </a>
        </>
      );

    default:
      return null;
  }
}

/******************
 * Helper pieces  *
 ******************/
const inputClass =
  "px-3 py-2 w-72 max-w-full text-sm rounded-xl bg-[#111827] border border-[#1F2937] text-[#D1D5DB] focus:outline-none focus:border-[#208EF3]";

interface HeaderProps {
  title: string;
  desc: string;
}

function Header({ title, desc }: HeaderProps) {
  return (
    <>
      <h3 className="text-xl text-white border-b border-[#1F2937] pb-2 mt-0">{title}</h3>
      <p className="mb-6 text-[#999] max-w-[600px]">{desc}</p>
    </>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm mb-1 text-[#D1D5DB]">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input(props: InputProps) {
  return <input {...props} className={inputClass} />;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea(props: TextareaProps) {
  return <textarea {...props} rows={3} className={inputClass} />;
}

interface SelectProps {
  list: string[];
}

function Select({ list }: SelectProps) {
  return (
    <select defaultValue={list[0]} className={inputClass}>
      {list.map((v) => (
        <option key={v}>{v}</option>
      ))}
    </select>
  );
}

interface ToggleProps {
  label: string;
  defaultChecked?: boolean;
}

function Toggle({ label, defaultChecked = false }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="mb-5 w-72 flex items-center justify-between">
      <span className="text-sm text-[#D1D5DB] select-none">{label}</span>
      <label className="relative inline-block w-[50px] h-6">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <span className="absolute inset-0 rounded-full bg-[#1F2937] transition-colors peer-checked:bg-[#208EF3]" />
        <span className="absolute left-1 bottom-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-[26px]" />
      </label>
    </div>
  );
}

interface AccentSwatchProps {
  color: string;
}

function AccentSwatch({ color }: AccentSwatchProps) {
  const [active, setActive] = useState(false);
  return (
    <button
      className={`h-8 w-8 rounded-full border-2 transition-transform ${
        active ? "scale-110 border-[#208EF3]" : "border-transparent"
      }`}
      style={{ backgroundColor: color }}
      onClick={() => setActive(true)}
    />
  );
}

function SaveButton() {
  return (
    <div>
      <button
        className="mt-6 border-2 border-[#208EF3] text-[#208EF3] px-6 py-3 rounded-xl text-sm transition-colors hover:bg-[#208EF3] hover:text-[#0A0F1F]"
        onClick={() => alert("Saved!")}
      >
        Save Changes
      </button>
    </div>
  );
}

/* Tailwind arbitrary keyframes for fadeIn.
   Add this to your globals (or keep a tiny <style> tag) if you want the original fade‑in effect:
   @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
*/