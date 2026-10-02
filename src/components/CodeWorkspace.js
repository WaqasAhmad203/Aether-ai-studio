"use client";

import { useState } from "react";
import {
  CodeIcon,
  PlayIcon,
  CopyIcon,
  CheckIcon,
  SaveIcon,
  FlaskIcon,
  TerminalIcon,
  PlusIcon,
  ChevronDownIcon,
} from "./Icons";

export default function CodeWorkspace({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onAddTab,
  onCodeChange,
  onRunCode,
  executionLogs,
  isRunning,
  testResults,
  isCollapsed,
  onToggleCollapse,
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bottomTab, setBottomTab] = useState("execution"); // "execution" | "tests"

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleCopy = () => {
    if (!activeTab?.content) return;
    navigator.clipboard.writeText(activeTab.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  if (isCollapsed) {
    return (
      <aside className="w-12 bg-[#090b12] border-l border-[#161a28] flex flex-col items-center py-4 shrink-0 justify-between">
        <button
          onClick={onToggleCollapse}
          title="Expand Code Workspace"
          className="p-2 rounded-lg bg-[#141826] hover:bg-[#1a2033] text-cyan-400 border border-cyan-500/30 transition-all hover:scale-105"
        >
          <CodeIcon className="w-4 h-4" />
        </button>
        <div className="rotate-90 text-[11px] font-mono tracking-widest text-slate-400 uppercase">
          Workspace
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
      </aside>
    );
  }

  return (
    <aside className="w-96 lg:w-[460px] xl:w-[500px] bg-[#07080d] border-l border-[#161a28] flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Workspace Header & Action Bar */}
      <div className="h-14 px-3 border-b border-[#161a28] bg-[#090b12] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-xs tracking-wide text-slate-200 uppercase">
            Code Workspace
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleSave}
            title="Save changes"
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-300 hover:bg-[#151928] hover:text-cyan-300 border border-[#1e2438] transition-colors"
          >
            {saved ? (
              <>
                <CheckIcon className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Saved</span>
              </>
            ) : (
              <>
                <SaveIcon className="w-3 h-3 text-slate-400" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            title="Copy current code"
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-300 hover:bg-[#151928] hover:text-cyan-300 border border-[#1e2438] transition-colors"
          >
            {copied ? (
              <>
                <CheckIcon className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3 h-3 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-900 transition-all ${
              isRunning
                ? "bg-emerald-600/50 cursor-not-allowed opacity-80"
                : "bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-950 glow-emerald active:scale-95"
            }`}
          >
            <PlayIcon className={`w-3 h-3 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Running..." : "Run"}</span>
          </button>

          <button
            onClick={onToggleCollapse}
            title="Collapse Workspace"
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-[#151928] rounded ml-1 transition-colors"
          >
            <ChevronDownIcon className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Editor Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#161a28] bg-[#07080c] px-2 overflow-x-auto">
        <div className="flex items-center gap-1 py-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab?.id;
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer transition-all border-b-2 ${
                  isActive
                    ? "bg-[#0f121e] text-cyan-300 border-cyan-400 font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0c0e18] border-transparent"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    tab.language === "test" || tab.name.includes(".test.")
                      ? "bg-amber-400"
                      : "bg-cyan-400"
                  }`}
                />
                <span>{tab.name}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onAddTab}
          title="New file tab"
          className="p-1 hover:bg-[#151928] text-slate-400 hover:text-cyan-400 rounded transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-hidden flex bg-[#090b12] text-xs font-mono">
        {/* Line Numbers Column */}
        <div className="w-10 py-3 bg-[#07080c] border-r border-[#141724] text-slate-400 text-right pr-2 select-none overflow-hidden leading-5 text-[11px]">
          {(activeTab?.content || "")
            .split("\n")
            .map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
        </div>

        {/* Code Content View / Textarea */}
        <div className="flex-1 p-3 overflow-auto leading-5 text-[12px] bg-[#090b12]">
          <textarea
            value={activeTab?.content || ""}
            onChange={(e) => onCodeChange(activeTab.id, e.target.value)}
            spellCheck="false"
            className="w-full h-full bg-transparent text-slate-200 resize-none outline-none font-mono selection:bg-cyan-900/50 leading-5 text-[12px]"
          />
        </div>
      </div>

      {/* Bottom Drawer: Execution Logs & Tests Runner */}
      <div className="h-44 border-t border-[#161a28] bg-[#07080c] flex flex-col shrink-0">
        {/* Bottom Drawer Tabs */}
        <div className="flex items-center justify-between border-b border-[#141724] px-3 bg-[#0a0c14] h-8 shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setBottomTab("execution")}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                bottomTab === "execution"
                  ? "text-cyan-400 border-b border-cyan-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <TerminalIcon className="w-3 h-3" />
              <span>Execution</span>
            </button>

            <button
              onClick={() => setBottomTab("tests")}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                bottomTab === "tests"
                  ? "text-emerald-400 border-b border-emerald-400 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FlaskIcon className="w-3 h-3" />
              <span>Tests</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-800/40">
                2 passed
              </span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-slate-400">
            Node.js v20.11 • runtime ready
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed bg-[#07080d]">
          {bottomTab === "execution" ? (
            <div className="space-y-1">
              <div className="text-slate-400 flex items-center gap-1">
                <span className="text-cyan-400 font-bold">$</span> node --experimental-specifier-resolution {activeTab?.name || "app.js"}
              </div>
              {executionLogs && executionLogs.length > 0 ? (
                executionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.type === "error"
                        ? "text-rose-400"
                        : log.type === "success"
                        ? "text-emerald-400"
                        : "text-slate-300"
                    }
                  >
                    {log.text}
                  </div>
                ))
              ) : (
                <div className="text-slate-400 py-1">
                  Ready to execute. Click &apos;Run&apos; to evaluate code.
                </div>
              )}
            </div>
          ) : (
            /* Tests Tab */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-[#161a28]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  auth.test.js
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  {testResults?.latency || "45ms"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>✓ should handle user authentication token refresh</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>✓ should return 401 unauthorized on expired session</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-1 font-mono">
                Summary: 2 passed, 0 failed, 2 total (assertions verified)
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
