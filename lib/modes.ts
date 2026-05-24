import { AnalysisMode } from "./types";

export interface ModeDefinition {
  id: AnalysisMode;
  label: string;
  emoji: string;
  prompt: string;
  description: string;
}

export const MODES: ModeDefinition[] = [
  {
    id: "explain",
    label: "Explain",
    emoji: "🔍",
    prompt: "Explain everything you see in this image in detail.",
    description: "Full visual breakdown",
  },
  {
    id: "read-text",
    label: "Read Text",
    emoji: "📝",
    prompt: "Extract and transcribe all text visible in this image.",
    description: "OCR & transcription",
  },
  {
    id: "analyze-chart",
    label: "Chart",
    emoji: "📊",
    prompt:
      "Analyze this chart/graph. Describe the data, trends, and key takeaways.",
    description: "Data visualization analysis",
  },
  {
    id: "translate",
    label: "Translate",
    emoji: "🌐",
    prompt:
      "Identify any text in this image and translate it to English. Provide the original text and its translation.",
    description: "Text translation",
  },
  {
    id: "code-review",
    label: "Code Review",
    emoji: "💻",
    prompt:
      "This is a code screenshot. Explain what the code does, identify any bugs, code smells, or improvements.",
    description: "Code analysis",
  },
  {
    id: "roast",
    label: "Roast It",
    emoji: "🔥",
    prompt:
      "Give a funny, light-hearted roast of this image. Be witty and playful, but not mean-spirited.",
    description: "Comedic commentary",
  },
  {
    id: "custom",
    label: "Custom",
    emoji: "✨",
    prompt: "",
    description: "Your own question",
  },
];
