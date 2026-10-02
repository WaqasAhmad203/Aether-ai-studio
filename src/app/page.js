"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import ChatStream from "@/components/ChatStream";
import ChatInputBar from "@/components/ChatInputBar";
import CodeWorkspace from "@/components/CodeWorkspace";
import CommandPalette from "@/components/CommandPalette";

const INITIAL_CODE_AUTH = `// Aether AI Studio - auth.js
import { useState, useEffect } from 'react';

export async function handleSubmission(formData) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}
`;

const INITIAL_CODE_TEST = `// Aether AI Studio - auth.test.js
import { describe, it, expect, vi } from 'vitest';
import { handleSubmission } from './auth.js';

describe('Authentication Flow', () => {
  it('should authenticate user and return token on valid credentials', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'u_1' }, token: 'jwt_mock_token' }),
    });

    const result = await handleSubmission({ email: 'alex@aether.dev', password: 'secret' });
    expect(result.success).toBe(true);
    expect(result.token).toBe('jwt_mock_token');
  });

  it('should handle network failure gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

    const result = await handleSubmission({ email: 'test@dev.com' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network disconnected');
  });
});
`;

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [studioMode, setStudioMode] = useState("general"); // "general" | "developer"
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(true); // Default collapsed in general mode

  // Code Workspace State
  const [codeTabs, setCodeTabs] = useState([
    { id: "tab-auth", name: "auth.js", language: "javascript", content: INITIAL_CODE_AUTH },
    { id: "tab-test", name: "auth.test.js", language: "test", content: INITIAL_CODE_TEST },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-auth");
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([
    { type: "info", text: "container: node.js runtime initialized" },
    { type: "success", text: "✓ auth.js module compiled without warnings (34ms)" },
    { type: "info", text: "ready for testing or execution" },
  ]);
  const [testResults, setTestResults] = useState({
    latency: "45ms",
    passed: 2,
    failed: 0,
  });

  // Switch mode handler
  const handleModeChange = (newMode) => {
    setStudioMode(newMode);
    if (newMode === "developer") {
      setIsWorkspaceCollapsed(false);
    } else {
      setIsWorkspaceCollapsed(true);
    }
  };

  // Initialize or load from LocalStorage
  useEffect(() => {
    setMounted(true);
    const savedSessions = localStorage.getItem("aether_chat_sessions");
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved sessions:", e);
      }
    }

    // Default Seed Session matching friendly ChatGPT conversational intelligence
    const seedSession = {
      id: "session-default",
      title: "Welcome to Aether AI",
      createdAt: Date.now(),
      messages: [
        {
          role: "user",
          content: "Hi Aether! What can you help me with today?",
        },
        {
          role: "assistant",
          status: "Completed",
          latency: "10ms",
          tokens: "320",
          thoughts: [
            { title: "Analyzing user inquiry", detail: "Greeting & capability overview", duration: "1.8ms", tokens: "60" },
            { title: "Synthesizing conversational capabilities", detail: "General AI & coding synthesis", duration: "3.2ms", tokens: "140" },
            { title: "Formatting bullet points and quick suggestions", detail: "Clarity review", duration: "2.1ms", tokens: "80" },
          ],
          content: `Hello! I am **Aether**, your versatile AI assistant. I can chat with you on virtually any topic just like ChatGPT, while also offering a built-in code workspace when you want to build or run code.

Here are some of the things we can do together:

- 💬 **Conversational Chat & Explanations:** Ask questions about science, history, philosophy, or explain complex ideas simply.
- ✍️ **Writing & Creative Work:** Draft emails, polish blog posts, brainstorm startup ideas, or write stories.
- 📋 **Planning & Productivity:** Create personalized travel itineraries, daily schedules, or study plans.
- 💻 **Coding & Debugging:** Write production code in any language, refactor logic, write test cases, and click **"Open in Workspace"** to run it live.

Feel free to ask me anything below or choose from one of the prompt presets on the left!`,
        },
      ],
    };

    setSessions([seedSession]);
    setActiveSessionId(seedSession.id);
  }, []);

  // Save sessions on state update
  useEffect(() => {
    if (mounted && sessions.length > 0) {
      localStorage.setItem("aether_chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions, mounted]);

  // Global Keyboard Shortcuts (Ctrl+K / Cmd+K, Ctrl+N)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleNewSession();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Session Handlers
  const handleNewSession = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      title: "New Conversation",
      createdAt: Date.now(),
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
  };

  const handleDeleteSession = (id) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (activeSessionId === id && updated.length > 0) {
        setActiveSessionId(updated[0].id);
      }
      return updated;
    });
  };

  // Chat message submission
  const handleSendMessage = async (text, attachedFile = null) => {
    if (!text.trim() && !attachedFile) return;

    const userMessage = {
      role: "user",
      content: text,
      attachedFile,
    };

    const currentMessages = activeSession?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];

    // Auto-set title on first message
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === (activeSession?.id || activeSessionId)) {
          return {
            ...s,
            title: s.messages.length === 0 ? text.slice(0, 32) + "..." : s.title,
            messages: updatedMessages,
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: currentMessages,
          model: selectedModel,
          attachedFile,
          mode: studioMode,
        }),
      });

      const data = await res.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply || "No response received.",
        thoughts: data.thoughts,
        latency: data.latency || "14ms",
        tokens: data.tokens || "450",
        status: "Completed",
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === (activeSession?.id || activeSessionId)) {
            return {
              ...s,
              messages: [...updatedMessages, assistantMessage],
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = {
        role: "assistant",
        content: `> ⚠️ **Error:** Failed to connect to AI server. ${err.message}`,
        status: "Error",
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === (activeSession?.id || activeSessionId)) {
            return {
              ...s,
              messages: [...updatedMessages, errorMessage],
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Prompt Preset click handler
  const handleSelectPreset = (promptText, title) => {
    handleSendMessage(promptText);
  };

  // Open generated code in right-hand workspace
  const handleOpenCodeInWorkspace = (codeContent, language) => {
    const filename = language === "test" || codeContent.includes("describe(") || codeContent.includes("test(")
      ? "refactor.test.js"
      : `component.${language === "python" ? "py" : language === "sql" ? "sql" : "js"}`;

    const existingTab = codeTabs.find((t) => t.name === filename);

    if (existingTab) {
      setCodeTabs((prev) =>
        prev.map((t) => (t.id === existingTab.id ? { ...t, content: codeContent } : t))
      );
      setActiveTabId(existingTab.id);
    } else {
      const newTab = {
        id: `tab-${Date.now()}`,
        name: filename,
        language: language || "javascript",
        content: codeContent,
      };
      setCodeTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }

    // Expand workspace automatically when code is opened
    setIsWorkspaceCollapsed(false);
  };

  // Code Tab Handlers
  const handleAddCodeTab = () => {
    const newTab = {
      id: `tab-${Date.now()}`,
      name: `file_${codeTabs.length + 1}.js`,
      language: "javascript",
      content: `// New file\nconsole.log("Aether AI Workspace");\n`,
    };
    setCodeTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseCodeTab = (id) => {
    if (codeTabs.length <= 1) return;
    setCodeTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleCodeChange = (id, newContent) => {
    setCodeTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: newContent } : t))
    );
  };

  // Run Code Simulation
  const handleRunCode = () => {
    const active = codeTabs.find((t) => t.id === activeTabId);
    setIsRunningCode(true);
    setExecutionLogs([
      { type: "info", text: `[runner]: compiling ${active?.name || "code"}...` },
      { type: "info", text: "evaluating runtime AST & module dependencies..." },
    ]);

    setTimeout(() => {
      setIsRunningCode(false);
      setExecutionLogs([
        { type: "info", text: `[runner]: executed ${active?.name || "code"} (exit code: 0)` },
        { type: "success", text: "✓ Execution finished in 28ms without unhandled exceptions." },
        { type: "info", text: "stdout: { status: 200, latency: '12ms', memoryUsage: '14.2MB' }" },
      ]);
      setTestResults({
        latency: "38ms",
        passed: 2,
        failed: 0,
      });
    }, 900);
  };

  // Command palette action dispatcher
  const handleCommandPaletteAction = (type, payload) => {
    if (type === "preset") {
      handleSendMessage(payload);
    } else if (type === "new_chat") {
      handleNewSession();
    } else if (type === "clear_chat") {
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession?.id ? { ...s, messages: [] } : s))
      );
    }
  };

  if (!mounted) return null;

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#090a0f] text-slate-100 antialiased font-sans studio-grid-pattern">
      {/* Column 1: Left Navigation & Presets Library */}
      <LeftSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onSelectPreset={handleSelectPreset}
        mode={studioMode}
        onModeChange={handleModeChange}
      />

      {/* Column 2: Center Chat Stream + Reasoning + Input */}
      <section className="flex-1 flex flex-col h-full min-w-0 overflow-hidden border-r border-[#161a28]">
        <ChatStream
          messages={activeSession?.messages || []}
          isLoading={isLoading}
          onOpenCodeInWorkspace={handleOpenCodeInWorkspace}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleWorkspace={() => setIsWorkspaceCollapsed((prev) => !prev)}
          projectName={studioMode === "developer" ? "Apollo-Web" : "General AI"}
          branchName={studioMode === "developer" ? "v1.2 Draft" : "Universal"}
          mode={studioMode}
        />

        <ChatInputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          tokenCount={activeSession?.messages?.length ? (activeSession.messages.length * 180 + 320) : 380}
          mode={studioMode}
        />
      </section>

      {/* Column 3: Right Live Code Workspace & Execution Terminal */}
      <CodeWorkspace
        tabs={codeTabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseCodeTab}
        onAddTab={handleAddCodeTab}
        onCodeChange={handleCodeChange}
        onRunCode={handleRunCode}
        executionLogs={executionLogs}
        isRunning={isRunningCode}
        testResults={testResults}
        isCollapsed={isWorkspaceCollapsed}
        onToggleCollapse={() => setIsWorkspaceCollapsed((prev) => !prev)}
      />

      {/* Global Command Palette Overlay (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandPaletteAction}
        onSelectModel={setSelectedModel}
        currentModel={selectedModel}
      />
    </main>
  );
}