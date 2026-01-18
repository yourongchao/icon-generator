
export type AspectRatio = '1:1' | '4:3' | '16:9' | 'circle';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  promptSuffix: string;
  icon?: string; // 新增：用于视觉识别的图标或 Emoji
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  text: string;
  styleName: string;
  aspectRatio: AspectRatio;
  timestamp: number;
}
