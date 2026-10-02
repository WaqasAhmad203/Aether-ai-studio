"use client";

import { useState, useRef, useEffect } from "react";
import ThoughtAccordion from "./ThoughtAccordion";
import {
  GitBranchIcon,
  CommandIcon,
  CopyIcon,
  CheckIcon,
  CodeIcon,
  SparklesIcon,
  FlaskIcon,
  DatabaseIcon,
  SearchIcon,
  LayoutSplitIcon,
  MessageSquareIcon,
} from "./Icons";

export default function ChatStream({
  messages,
  isLoading,
  onOpenCodeInWorkspace,
  onSelectPrompt,
  onOpenCommandPalette,
  onToggleWorkspace,
  projectName = "General AI",
  branchName = "Universal",
  mode = "general",
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse code blocks and markdown
  const renderMessageContent = (content) => {
    const parts = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: content.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: "code",
        language: match[1] || "javascript",
        value: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        value: content.substring(lastIndex),
      });
    }

    if (parts.length === 0) {
      parts.push({ type: "text", value: content });
    }

    return parts.map((part, pIdx) => {
      if (part.type === "code") {
        return (
          <div
            key={pIdx}
            className="my-3 rounded-lg border border-[#1e2438] bg-[#07090f] overflow-hidden font-mono text-xs shadow-md"
          >
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d101a] border-b border-[#181d2e] text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CodeIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-slate-300">
                  {part.language || "code"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCodeInWorkspace(part.value, part.language)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-cyan-950/80 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/50 transition-colors cursor-pointer"
                >
                  <LayoutSplitIcon className="w-3 h-3" />
                  <span>Open in Workspace</span>
                </button>

                <button
                  onClick={() => handleCopyText(part.value, `code-${pIdx}`)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-slate-400 hover:text-slate-200 hover:bg-[#151928] transition-colors cursor-pointer"
                >
                  {copiedIndex === `code-${pIdx}` ? (
                    <>
                      <CheckIcon className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Content */}
            <pre className="p-3 overflow-x-auto text-slate-200 leading-relaxed text-[11px] font-mono selection:bg-cyan-900/50">
              <code>{part.value}</code>
            </pre>
          </div>
        );
      }

      // Normal text rendering with clean paragraph & bullet formatting
      return (
        <div key={pIdx} className="space-y-2 whitespace-pre-wrap leading-relaxed text-slate-200 text-xs md:text-sm">
          {part.value}
        </div>
      );
    });
  };

  // Versatile starter prompt cards for general chat + coding
  const generalStarterCards = [
    {
      icon: MessageSquareIcon,
      title: "Draft a Professional Email",
      desc: "Write a high-stakes partnership sync message with clear action items.",
      prompt: "Draft a polite and persuasive professional email to propose a strategic collaboration with a partner company.",
    },
    {
      icon: SparklesIcon,
      title: "Explain Complex Topic (ELI5)",
      desc: "Simplify quantum computing or general relativity for quick mastery.",
      prompt: "Explain how quantum computing works in simple, crystal-clear terms with everyday analogies.",
    },
    {
      icon: SparklesIcon,
      title: "Brainstorm Creative Ideas",
      desc: "Generate 5 unique SaaS product concepts in AI and productivity.",
      prompt: "Brainstorm 5 innovative product ideas combining artificial intelligence with personal productivity and habit tracking.",
    },
    {
      icon: CodeIcon,
      title: "Write or Debug Code",
      desc: "Refactor React hooks, build API endpoints, or write test suites.",
      prompt: "Create a modern React 19 Kanban dashboard component with smooth animations and responsive layout.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#090a0f] select-text">
      {/* Top Header / Project Toolbar */}
      <header className="h-14 px-4 border-b border-[#161a28] bg-[#07080c] flex items-center justify-between shrink-0 select-none">
        {/* Left: Mode Context indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <span>Mode:</span>
            <span className={`font-mono px-2 py-0.5 rounded text-[11px] ${
              mode === "developer" ? "text-emerald-400 bg-emerald-950/40 border border-emerald-800/40" : "text-cyan-400 bg-cyan-950/40 border border-cyan-800/40"
            }`}>
              {mode === "developer" ? "Developer Studio" : "General Assistant"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#121625] text-slate-300 border border-[#20273e]">
            <GitBranchIcon className="w-3 h-3 text-cyan-400" />
            <span>{branchName}</span>
          </div>
        </div>

        {/* Right: Search / Command Palette shortcut & Workspace Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e111a] hover:bg-[#141826] text-slate-400 hover:text-slate-200 border border-[#1e2438] text-xs transition-colors cursor-pointer"
          >
            <SearchIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[11px]">Search commands or prompts...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161b2b] text-slate-300 border border-[#252e46]">
              <CommandIcon className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          <button
            onClick={onToggleWorkspace}
            title="Toggle Code Workspace"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0e111a] hover:bg-[#141826] text-slate-300 hover:text-cyan-400 border border-[#1e2438] text-xs transition-colors cursor-pointer"
          >
            <LayoutSplitIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Workspace</span>
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Welcome Empty State */}
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex p-3.5 rounded-2xl bg-[#0f1322] border border-[#20273f] shadow-lg shadow-cyan-950/40 glow-cyan">
              <SparklesIcon className="w-8 h-8 text-cyan-400 animate-pulse-subtle" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                How can I assist you today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                Chat freely about any topic, brainstorm ideas, write content, or generate and run production code.
              </p>
            </div>

            {/* Quick Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
              {generalStarterCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectPrompt(card.prompt)}
                    className="p-3.5 rounded-xl border border-[#181d2e] bg-[#0c0f18] hover:bg-[#121625] hover:border-cyan-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300">
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-xs sm:text-sm text-slate-200">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Stream */
          messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                    isUser
                      ? "bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md"
                      : "bg-[#121626] text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  {isUser ? "You" : "A"}
                </div>

                {/* Message Content Container */}
                <div
                  className={`flex-1 overflow-hidden rounded-xl border p-4 ${
                    isUser
                      ? "bg-[#101422] border-[#222a42] text-slate-200 shadow-md"
                      : "bg-[#0b0e17] border-[#181d2e] text-slate-200 shadow-lg"
                  }`}
                >
                  {/* Assistant Header / Status */}
                  {!isUser && (
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#141826] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">Aether AI</span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {msg.status || "Completed"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyText(msg.content, idx)}
                        className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <CheckIcon className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-mono text-[10px]">
                              Copied
                            </span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* AI Thought Process Accordion */}
                  {!isUser && msg.thoughts && (
                    <ThoughtAccordion
                      thoughts={msg.thoughts}
                      latency={msg.latency}
                      tokens={msg.tokens}
                    />
                  )}

                  {/* Body Text / Code blocks */}
                  <div className="leading-relaxed">
                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Loading / Thinking State Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-full bg-[#121626] text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>

            <div className="flex-1 rounded-xl border border-[#1e2438] bg-[#0b0e17] p-4 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                <SparklesIcon className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Aether is thinking & formulating response...</span>
              </div>

              <div className="space-y-2">
                <div className="h-3.5 bg-gradient-to-r from-[#141826] via-[#1e253c] to-[#141826] rounded animate-pulse w-3/4"></div>
                <div className="h-3.5 bg-gradient-to-r from-[#141826] via-[#1e253c] to-[#141826] rounded animate-pulse w-5/6"></div>
                <div className="h-3.5 bg-gradient-to-r from-[#141826] via-[#1e253c] to-[#141826] rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
