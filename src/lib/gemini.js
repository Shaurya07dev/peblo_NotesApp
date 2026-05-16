import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI-powered insights from note content using Gemini.
 * Returns summary, action items, and suggested title.
 */
export async function generateNoteSummary(content, title = "") {
  if (!content || content.trim().length < 10) {
    throw new Error("Note content is too short for AI analysis.");
  }

  const prompt = `You are an AI assistant for a notes workspace. Analyze the following note and provide:
1. A concise summary (2-3 sentences max)
2. A list of action items extracted from the content (max 5 items)
3. A suggested title for this note (short, descriptive)

Note Title: ${title || "(untitled)"}
Note Content:
${content}

Respond ONLY in valid JSON format with this exact structure:
{
  "summary": "...",
  "action_items": ["item1", "item2"],
  "suggested_title": "..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text.trim();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response did not contain valid JSON.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      summary: parsed.summary || "No summary generated.",
      action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
      suggested_title: parsed.suggested_title || title || "Untitled Note",
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response. Please try again.");
    }
    throw error;
  }
}
