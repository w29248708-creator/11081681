/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an expert AI Engineer and Product Designer specializing in "bringing ideas to life".
Your goal is to take a user request—which might be a text description, a simple sketch, or a photo—and instantly generate a fully functional, interactive, single-page HTML/JS/CSS application.

CORE DIRECTIVES:
1. **Analyze & Abstract**:
    - **Images**: Detect buttons, inputs, and layout. Turn sketches into modern UIs. Gamify mundane objects (e.g., a photo of a desk -> a cleanup game).
    - **Text**: Interpret requirements (e.g., "Gantt Chart", "Kanban Board", "Calculator") and build a robust implementation.
    - **Data**: If the user asks for specific data (e.g., "30 items", "financial data"), ensure the app initializes with that data so it's ready to use.

2. **NO EXTERNAL IMAGES**:
    - **CRITICAL**: Do NOT use <img src="..."> with external URLs (like imgur, placeholder.com, or generic internet URLs). They will fail.
    - **INSTEAD**: Use **CSS shapes**, **inline SVGs**, **Emojis**, or **CSS gradients** to visually represent the elements you see in the input.
    - If you see a "coffee cup" in the input, render a ☕ emoji or draw a cup with CSS. Do not try to load a jpg of a coffee cup.

3. **Make it Interactive**: The output MUST NOT be static. It needs buttons, sliders, drag-and-drop, or dynamic visualizations.
4. **Self-Contained**: The output must be a single HTML file with embedded CSS (<style>) and JavaScript (<script>). No external dependencies unless absolutely necessary (Tailwind via CDN is allowed).
5. **Robust & Creative**: If the input is messy or ambiguous, generate a "best guess" creative interpretation. Never return an error. Build *something* fun and functional.

RESPONSE FORMAT:
Return ONLY the raw HTML code. Do not wrap it in markdown code blocks (\`\`\`html ... \`\`\`). Start immediately with <!DOCTYPE html>.`;

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string, model: string = 'gemini-3-pro-preview'): Promise<string> {
  // Initialize AI client lazily to prevent top-level crashes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  
  let finalPrompt = "";
  
  if (fileBase64) {
    // If file is provided, prioritize it but include user's text instructions
    finalPrompt = `Analyze this image/document. Detect what functionality is implied.
    ${prompt ? `USER INSTRUCTION: ${prompt}` : ""}
    If it is a real-world object (like a desk), gamify it. Build a fully interactive web app. 
    IMPORTANT: Do NOT use external image URLs. Recreate the visuals using CSS, SVGs, or Emojis.`;
  } else {
    // Text-only mode
    finalPrompt = prompt || "Create a demo app that shows off your capabilities.";
  }

  parts.push({ text: finalPrompt });

  if (fileBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType,
      },
    });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Higher temperature for more creativity with mundane inputs
      },
    });

    let text = response.text || "<!-- Failed to generate content -->";

    // Cleanup if the model still included markdown fences despite instructions
    text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

    return text;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

export async function refineApp(currentCode: string, instruction: string): Promise<string> {
  // Initialize AI client lazily
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: any[] = [
      { text: "You are an expert web developer. The user wants to modify an existing HTML application. You must return the FULL updated HTML code. Do not return partial code. Do not wrap in markdown." },
      { text: `EXISTING CODE:\n${currentCode}` },
      { text: `USER INSTRUCTION: ${instruction}` }
  ];

  try {
      const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-preview', // Always use Pro for code editing
          contents: { parts },
          config: {
              systemInstruction: "Return ONLY the raw HTML code. Do not wrap it in markdown code blocks.",
          }
      });

      let text = response.text || currentCode;
      text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
      return text;
  } catch (error) {
      console.error("Refinement Error:", error);
      throw error;
  }
}