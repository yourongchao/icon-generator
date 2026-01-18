
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  promptSuffix: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
