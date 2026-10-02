"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, CpuIcon, SparklesIcon } from "./Icons";

export default function ThoughtAccordion({ thoughts, latency = "14ms", tokens = "420" }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-[#1e2438] bg-[#0b0e17] overflow-hidden text-xs transition-all duration-200">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#0d101a] hover:bg-[#121624] text-slate-300 transition-colors cursor-pointer border-b border-[#181d2e]"
      >
        <div className="flex items-center gap-2 font-medium">
          {isOpen ? (
            <ChevronDownIcon className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <ChevronRightIcon className="w-3.5 h-3.5 text-slate-400" />
          )}
          <div className="flex items-center gap-1.5 text-slate-200">
            <CpuIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wide">Thought Process</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span className="text-slate-400">{latency}</span>
          <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
            {tokens} tokens
          </span>
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-3 space-y-2 font-mono text-slate-300 bg-[#090b12]/80">
          {thoughts.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 text-[11px] group py-0.5"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <ChevronRightIcon className="w-3 h-3 text-cyan-400/70 group-hover:text-cyan-300 shrink-0" />
                <span className="text-slate-200 font-medium">{step.title}</span>
                {step.detail && (
                  <span className="text-slate-400 text-[10px]">({step.detail})</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 text-slate-400 text-[10px]">
                {step.duration && <span>{step.duration}</span>}
                {step.tokens && <span>{step.tokens} tokens</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
