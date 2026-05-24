export type AnalysisMode =
  | "explain"
  | "read-text"
  | "analyze-chart"
  | "translate"
  | "code-review"
  | "roast"
  | "custom";

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AnalyzeRequest {
  image: string;
  mimeType: string;
  prompt: string;
  history?: ConversationTurn[];
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
  name: string;
  size: number;
}
