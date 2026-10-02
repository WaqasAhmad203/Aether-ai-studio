"use client";

import { useState, useRef, useEffect } from "react";
import {
  SendIcon,
  MicIcon,
  PaperclipIcon,
  CpuIcon,
  ChevronDownIcon,
} from "./Icons";

export default function ChatInputBar({
  onSendMessage,
  isLoading,
  selectedModel,
  onModelChange,
  tokenCount = 380,
  mode = "general",
}) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !attachedFile) || isLoading) return;

    onSendMessage(input, attachedFile);
    setInput("");
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Web Speech API Voice Recognition
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsRecording(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
      });
    }
  };

  return (
    <div className="p-3 bg-[#08090f] border-t border-[#161a28] shrink-0">
      {/* File Attachment Chip if present */}
      {attachedFile && (
        <div className="mb-2 flex items-center gap-2 text-xs bg-[#121625] text-cyan-300 px-3 py-1.5 rounded-lg border border-[#20273f] w-max">
          <PaperclipIcon className="w-3.5 h-3.5" />
          <span className="font-mono">{attachedFile.name}</span>
          <span className="text-[10px] text-slate-400">({attachedFile.size})</span>
          <button
            onClick={() => setAttachedFile(null)}
            className="ml-2 hover:text-rose-400 font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Input Box Container */}
      <div className="relative rounded-xl bg-[#0e111a] border border-[#1e2438] focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all shadow-lg overflow-hidden">
        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "developer"
              ? "Ask Aether to refactor code, generate tests, explain logic..."
              : "Message Aether... (Ask anything, draft content, brainstorm, or write code)"
          }
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 px-4 py-3 text-xs md:text-sm leading-relaxed resize-none outline-none font-sans"
        />

        {/* Input Bar Controls Toolbar */}
        <div className="px-3 pb-2.5 pt-1 flex items-center justify-between border-t border-[#151928] bg-[#0a0d15]/60 text-xs">
          {/* Left Actions (File upload, Voice, Model Pill) */}
          <div className="flex items-center gap-1.5">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Attach context file"
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-[#151928] transition-colors border border-transparent hover:border-[#222942] cursor-pointer"
            >
              <PaperclipIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Attach</span>
            </button>

            <button
              onClick={toggleVoiceInput}
              title={isRecording ? "Listening..." : "Voice input"}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                isRecording
                  ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#151928]"
              }`}
            >
              <MicIcon className="w-3.5 h-3.5" />
            </button>

            {/* Model Selector Pill */}
            <div className="relative group">
              <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="appearance-none bg-[#121625] hover:bg-[#161c2e] text-cyan-300 text-[11px] font-mono pl-6 pr-6 py-1 rounded-md border border-[#20273e] cursor-pointer outline-none transition-colors"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash-8B</option>
              </select>
              <CpuIcon className="w-3.5 h-3.5 text-cyan-400 absolute left-1.5 top-1.5 pointer-events-none" />
              <ChevronDownIcon className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Right Actions (Token Count & Send Button) */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
              {tokenCount} tokens
            </span>

            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                input.trim() || attachedFile
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 hover:from-cyan-400 hover:to-blue-400 shadow-md shadow-cyan-950 glow-cyan active:scale-95"
                  : "bg-[#161a29] text-slate-400 cursor-not-allowed"
              }`}
            >
              <SendIcon className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
