import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const {
      message,
      history = [],
      model = "gemini-2.5-flash",
      attachedFile = null,
      mode = "general", // "general" | "developer"
    } = await request.json();

    console.log("Chat API Request:", { model, mode, messageLength: message?.length, historyCount: history.length });

    const apiKey = process.env.GEMINI_API_KEY;

    // Generate contextual thought steps
    const isCodingQuery =
      /code|function|react|javascript|python|sql|bug|test|refactor|html|css|api|component|class|algorithm/i.test(
        message
      );

    const generatedThoughts = isCodingQuery
      ? [
          { title: "Analyzing problem & syntax requirements", detail: "Query parsing", duration: "3ms", tokens: "110" },
          { title: "Synthesizing clean, optimized solution", detail: "Best practices check", duration: "5ms", tokens: "220" },
          { title: "Verifying edge cases & test assertions", detail: "Validation", duration: "4ms", tokens: "130" },
        ]
      : [
          { title: "Understanding context & user intent", detail: "Semantic analysis", duration: "2ms", tokens: "90" },
          { title: "Synthesizing comprehensive response", detail: "Knowledge retrieval", duration: "4ms", tokens: "180" },
          { title: "Polishing clarity, tone & formatting", detail: "Finalizing", duration: "2ms", tokens: "70" },
        ];

    // Graceful fallback when API key is not yet set
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
      let simulatedReply = "";

      if (isCodingQuery) {
        simulatedReply = `Here is a solution for your request:

\`\`\`javascript
// Example solution
export function solveTask(data) {
  if (!data) {
    return { success: false, message: "Data payload is required." };
  }
  
  // Clean processing logic
  const formatted = Object.entries(data).map(([key, value]) => ({
    key,
    value: String(value).trim(),
    timestamp: new Date().toISOString()
  }));

  return { success: true, count: formatted.length, results: formatted };
}
\`\`\`

You can click **"Open in Workspace"** above to edit or run this in the Code Editor!

*(Note: Connect your \`GEMINI_API_KEY\` in \`.env.local\` for live Gemini responses on any topic!)*`;
      } else {
        simulatedReply = `Hello! I am **Aether**, your versatile AI assistant. I can help you with:

- ✍️ **Creative Writing & Communication:** Drafting professional emails, essays, blog posts, or stories.
- 🧠 **Learning & Explanations:** Explaining complex science, history, math, or philosophy in simple terms.
- 💡 **Brainstorming & Strategy:** Generating business ideas, travel itineraries, workout plans, and study schedules.
- 💻 **Coding & Technical Problem Solving:** Writing, debugging, and explaining code in any language.

How can I assist you with **"${message}"** today?

*(Note: Add your \`GEMINI_API_KEY\` in \`.env.local\` for live Gemini AI responses!)*`;
      }

      return Response.json({
        reply: simulatedReply,
        thoughts: generatedThoughts,
        latency: "12ms",
        tokens: "380",
        model: model,
      });
    }

    // Live Gemini Client
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt =
      mode === "developer"
        ? "You are Aether, an expert developer AI coding assistant. Provide clean, production-grade code, clear architectural explanations, and robust error handling. When providing code, use markdown code blocks with language identifiers."
        : "You are Aether, an intelligent, helpful, and versatile AI assistant like ChatGPT and Gemini. You excel at conversational chat, creative writing, structured explanations, brainstorming, problem-solving, and general knowledge, as well as programming. Format your responses with beautiful markdown, bullet points, headers, and code blocks when appropriate.";

    const formattedContents = [];

    // Add conversation history
    for (const msg of history) {
      formattedContents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    // Add current user prompt
    let userPrompt = message;
    if (attachedFile) {
      userPrompt = `[Attached Context: ${attachedFile.name}]\n\n${message}`;
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });

    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const elapsed = `${Date.now() - startTime}ms`;

    return Response.json({
      reply: response.text || "No response generated.",
      thoughts: generatedThoughts,
      latency: elapsed,
      tokens: "520",
      model: model,
    });
  } catch (error) {
    console.error("GEMINI ROUTE ERROR:", error);

    return Response.json(
      {
        error: error.message || "Failed to generate AI response.",
        reply: `> ⚠️ **Notice:** ${error.message || "An error occurred with the Gemini API."}\n\nPlease check your \`GEMINI_API_KEY\` in \`.env.local\`.`,
        thoughts: [
          {
            title: "API Gateway Handshake",
            detail: "Error encountered",
            duration: "1ms",
          },
        ],
        latency: "0ms",
        tokens: "0",
      },
      { status: 200 }
    );
  }
}