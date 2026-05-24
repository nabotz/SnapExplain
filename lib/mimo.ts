import { ConversationTurn } from "./types";

const MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";
const MODEL = "MiMo-V2.5";

export async function analyzeMiMo(
  image: string,
  mimeType: string,
  prompt: string,
  history: ConversationTurn[] = []
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.MIMO_API_KEY;
  if (!apiKey) {
    throw new Error("MIMO_API_KEY is not configured");
  }

  // Build message array: first message has image + text, follow-ups are text-only
  const messages: object[] = [];

  if (history.length === 0) {
    // First turn: image + text
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${image}`,
          },
        },
        {
          type: "text",
          text: prompt,
        },
      ],
    });
  } else {
    // Rebuild: first turn with image, then history, then new question
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${image}`,
          },
        },
        {
          type: "text",
          text: history[0].content,
        },
      ],
    });

    // Add history except the first user message (already included above)
    for (let i = 1; i < history.length; i++) {
      messages.push({
        role: history[i].role,
        content: history[i].content,
      });
    }

    // Add the new question
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const response = await fetch(MIMO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiMo API error ${response.status}: ${error}`);
  }

  if (!response.body) {
    throw new Error("No response body from MiMo API");
  }

  return response.body;
}
