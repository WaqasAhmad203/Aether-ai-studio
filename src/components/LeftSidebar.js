"use client";

import { useState } from "react";
import {
  AetherLogo,
  MessageSquareIcon,
  CodeIcon,
  BugIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FlaskIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  SettingsIcon,
} from "./Icons";

export default function LeftSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onSelectPreset,
  mode,
  onModeChange,
}) {
  const [presetsOpen, setPresetsOpen] = useState({
    general: true,
    learning: true,
    codegen: false,
    debugging: false,
  });

  const [activeTab, setActiveTab] = useState("chat");

  const promptPresets = [
    {
      category: "general",
      title: "✍️ Writing & Creative",
      items: [
        {
          id: "draft-email",
          title: "Draft Professional Email",
          icon: MessageSquareIcon,
          prompt: "Draft a polite and persuasive professional email to schedule an important partnership sync meeting next Tuesday.",
        },
        {
          id: "brainstorm-ideas",
          title: "Brainstorm Creative Ideas",
          icon: SparklesIcon,
          prompt: "Brainstorm 5 innovative startup ideas combining artificial intelligence with personal productivity and sustainable habits.",
        },
        {
          id: "summarize-text",
          title: "Summarize & Key Takeaways",
          icon: MessageSquareIcon,
          prompt: "Please summarize the core ideas and provide 5 bulleted key takeaways from this topic.",
        },
      ],
    },
    {
      category: "learning",
      title: "🧠 Knowledge & Explanations",
      items: [
        {
          id: "eli5",
          title: "Explain Like I'm 5 (ELI5)",
          icon: SparklesIcon,
          prompt: "Explain how quantum computing works using simple everyday analogies that a 5-year-old could easily understand.",
        },
        {
          id: "step-by-step",
          title: "Step-by-Step Problem Solving",
          icon: FlaskIcon,
          prompt: "Break down how to build a daily learning habit from scratch, including time blocking, habit stacking, and tracking progress.",
        },
        {
          id: "trip-planner",
          title: "Plan a 3-Day Travel Itinerary",
          icon: SparklesIcon,
          prompt: "Create an exciting 3-day travel itinerary for Tokyo focusing on historic shrines, hidden culinary gems, and modern tech districts.",
        },
      ],
    },
    {
      category: "codegen",
      title: "💻 Coding & Architecture",
      items: [
        {
          id: "react-comp",
          title: "Generate React Component",
          icon: CodeIcon,
          prompt: "Generate a modern, accessible React 19 component with Tailwind CSS styling, responsive layout, and smooth micro-interactions.",
        },
        {
          id: "refactor",
          title: "Refactor for Performance",
          icon: SparklesIcon,
          prompt: "Refactor this code to optimize performance, eliminate unnecessary re-renders, and handle edge cases cleanly.",
        },
        {
          id: "unit-test",
          title: "Write Unit Test Cases",
          icon: FlaskIcon,
          prompt: "Write comprehensive unit tests with edge cases, error boundary assertions, and mocks using Vitest/Jest.",
        },
      ],
    },
    {
      category: "debugging",
      title: "🗄️ Database & Security",
      items: [
        {
          id: "sql-opt",
          title: "Optimize SQL Query",
          icon: DatabaseIcon,
          prompt: "Optimize this SQL query for high throughput, suggest index strategies (B-Tree/GIN), and explain query execution improvements.",
        },
        {
          id: "sec-audit",
          title: "Security Audit (OWASP)",
          icon: ShieldCheckIcon,
          prompt: "Perform a security audit for common OWASP Top 10 vulnerabilities (SQLi, XSS, insecure auth, rate limiting) and suggest mitigations.",
        },
      ],
    },
  ];

  const toggleCategory = (cat) => {
    setPresetsOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className="w-72 bg-[#07080c] border-r border-[#161a28] flex flex-col h-full shrink-0 select-none text-slate-300">
      {/* Studio Header */}
      <div className="h-14 px-4 border-b border-[#161a28] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <AetherLogo className="w-6 h-6" />
          <div>
            <span className="font-semibold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
              Aether AI <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">{mode === "developer" ? "Studio" : "Assistant"}</span>
            </span>
          </div>
        </div>

        <button
          onClick={onNewSession}
          title="New Chat (Ctrl+N)"
          className="p-1.5 rounded-md hover:bg-[#151928] text-slate-400 hover:text-cyan-400 transition-colors border border-transparent hover:border-[#222942]"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Switcher Bar */}
      <div className="px-3 py-2 border-b border-[#141724] bg-[#090b12]">
        <div className="grid grid-cols-2 gap-1 bg-[#0e121e] p-0.5 rounded-lg border border-[#1e253c]">
          <button
            onClick={() => onModeChange("general")}
            className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-[11px] font-medium transition-all ${mode === "general"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
              }`}
          >
            <MessageSquareIcon className="w-3 h-3" />
            <span>General AI</span>
          </button>

          <button
            onClick={() => onModeChange("developer")}
            className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-[11px] font-medium transition-all ${mode === "developer"
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
              : "text-slate-400 hover:text-slate-200"
              }`}
          >
            <CodeIcon className="w-3 h-3" />
            <span>Dev Studio</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#141724] bg-[#080a10] text-xs">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${activeTab === "chat"
            ? "bg-[#151929] text-cyan-300 border border-cyan-500/30"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          <MessageSquareIcon className="w-3.5 h-3.5" />
          <span>Conversations</span>
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${activeTab === "prompts"
            ? "bg-[#151929] text-cyan-300 border border-cyan-500/30"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Prompts</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {activeTab === "chat" ? (
          /* Chat History Sessions */
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
              <span>Recent Chats</span>
              <span className="font-mono text-[10px] text-slate-400">{sessions.length}</span>
            </div>

            <div className="space-y-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-all ${isActive
                      ? "bg-[#131726] text-cyan-300 border border-[#222942]"
                      : "text-slate-400 hover:bg-[#0e111c] hover:text-slate-200"
                      }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquareIcon
                        className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"
                          }`}
                      />
                      <span className="truncate text-xs font-medium">
                        {s.title || "New Conversation"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      title="Delete Chat"
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {sessions.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No previous chats. Click + to start.
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Prompt Presets Library */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
            <span>Explore Ideas & Prompts</span>
          </div>

          <div className="space-y-2">
            {promptPresets.map((cat) => {
              const isOpen = presetsOpen[cat.category];
              return (
                <div key={cat.category} className="rounded-md border border-[#141826] bg-[#0a0c14] overflow-hidden">
                  <button
                    onClick={() => toggleCategory(cat.category)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 hover:bg-[#0f1320] text-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 font-medium text-[11px] text-slate-300">
                      {isOpen ? (
                        <ChevronDownIcon className="w-3 h-3 text-cyan-400" />
                      ) : (
                        <ChevronRightIcon className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{cat.title}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-1 space-y-1 border-t border-[#141826] bg-[#07080d]">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => onSelectPreset(item.prompt, item.title)}
                            className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#121625] text-slate-300 hover:text-cyan-300 transition-colors text-[11px] group cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5 text-cyan-400/80 group-hover:text-cyan-300 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User / Workspace Footer */}
      <div className="p-3 border-t border-[#161a28] bg-[#090b12] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            JD
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">Alex Carter</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {mode === "developer" ? "Dev Studio" : "General AI"} • Ready
            </div>
          </div>
        </div>

        <button
          title="Settings"
          className="p-1.5 rounded hover:bg-[#151928] text-slate-400 hover:text-slate-200 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
