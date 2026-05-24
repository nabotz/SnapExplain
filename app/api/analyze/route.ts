import { NextRequest, NextResponse } from "next/server";
import { analyzeMiMo } from "@/lib/mimo";
import { AnalyzeRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();
    const { image, mimeType, prompt, history = [] } = body;

    if (!image || !mimeType || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: image, mimeType, prompt" },
        { status: 400 }
      );
    }

    // Validate file size (~10MB base64 limit → ~7.5MB raw)
    if (image.length > 14_000_000) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 10MB." },
        { status: 413 }
      );
    }

    const stream = await analyzeMiMo(image, mimeType, prompt, history);

    // Pass through the SSE stream from MiMo directly
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("[analyze] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
