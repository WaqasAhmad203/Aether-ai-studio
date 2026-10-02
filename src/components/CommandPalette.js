"use client";

import { useState, useEffect } from "react";
import {
  SearchIcon,
  CommandIcon,
  CodeIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  FlaskIcon,
  CpuIcon,
  DatabaseIcon,
  ShieldCheckIcon,
} from "./Icons";

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectAction,
  onSelectModel,
  currentModel,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      id: "model-flash",
      title: "Switch Model: Gemini 2.5 Flash",
      category: "Models",
      detail: "Ultra-fast & intelligent",
      icon: CpuIcon,
      action: () => onSelectModel("gemini-2.5-flash"),
    },
    {
      id: "model-pro",
      title: "Switch Model: Gemini 1.5 Pro",
      category: "Models",
      detail: "Complex reasoning & deep logic",
      icon: CpuIcon,
      action: () => onSelectModel("gemini-1.5-pro"),
    },
    {
      id: "preset-react",
      title: "Preset: Generate React 19 Component",
      category: "Presets",
      detail: "Codegen with TypeScript & Tailwind",
      icon: CodeIcon,
      action: () =>
        onSelectAction("preset", "Generate a modern React 19 component with Tailwind CSS and full TypeScript types."),
    },
    {
      id: "preset-refactor",
      title: "Preset: Refactor for Performance",
      category: "Presets",
      detail: "Optimize logic and re-renders",
      icon: SparklesIcon,
      action: () =>
        onSelectAction("preset", "Refactor the active code to reduce complexity and optimize performance."),
    },
    {
      id: "preset-tests",
      title: "Preset: Write Unit Test Cases",
      category: "Presets",
      detail: "Vitest/Jest edge case test suites",
      icon: FlaskIcon,
      action: () =>
        onSelectAction("preset", "Write unit test cases covering edge cases and error boundaries."),
    },
    {
      id: "preset-sql",
      title: "Preset: Optimize SQL Query",
      category: "Presets",
      detail: "Query indexing and plan tuning",
      icon: DatabaseIcon,
      action: () =>
        onSelectAction("preset", "Optimize this SQL query for production workloads."),
    },
    {
      id: "new-session",
      title: "New Chat Session",
      category: "General",
      detail: "Create fresh conversation",
      icon: PlusIcon,
      action: () => onSelectAction("new_chat"),
    },
    {
      id: "clear-chat",
      title: "Clear Current Chat",
      category: "General",
      detail: "Reset active messages",
      icon: TrashIcon,
      action: () => onSelectAction("clear_chat"),
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase()) ||
    a.detail.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[#0b0e17] border border-[#232a42] rounded-xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#181d2e] bg-[#0d111d]">
          <SearchIcon className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, prompt preset, or action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 outline-none"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181d2e] text-slate-400 border border-[#262f4a]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#161c2d] text-cyan-300 border border-cyan-500/30"
                    : "hover:bg-[#0f1320] text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className={`p-1.5 rounded-md ${
                      isSelected
                        ? "bg-cyan-950/80 text-cyan-400"
                        : "bg-[#141826] text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-200">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {item.detail}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#141826] text-slate-400 border border-[#20273d]">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching commands or actions found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#080a10] border-t border-[#161a28] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Active: {currentModel}</span>
        </div>
      </div>
    </div>
  );
}
