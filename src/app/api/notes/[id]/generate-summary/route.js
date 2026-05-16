import { NextResponse } from "next/server";
import { generateNoteSummary } from "@/lib/gemini";

/**
 * POST /api/notes/[id]/generate-summary
 * Calls Gemini AI to generate summary, action items, and suggested title.
 * The Firestore update is done client-side after receiving this response.
 */
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, title } = body;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Note content is too short for AI analysis. Write at least 10 characters." },
        { status: 400 }
      );
    }

    const result = await generateNoteSummary(content, title);

    return NextResponse.json({
      noteId: id,
      ...result,
    });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI summary." },
      { status: 500 }
    );
  }
}
