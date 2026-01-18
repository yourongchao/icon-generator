
import { StylePreset } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'minimalist',
    name: '极简主义',
    description: '干净、简单的排版和扁平化设计元素。',
    promptSuffix: 'minimalist design, flat vector, clean sans-serif typography, solid background, professional tech aesthetic'
  },
  {
    id: 'neon',
    name: '赛博朋克霓虹',
    description: '带有高对比度未来主义色彩的发光字体。',
    promptSuffix: 'cyberpunk style, glowing neon lights, futuristic font, dark background, cyan and magenta accents'
  },
  {
    id: '3d-glass',
    name: '3D 玻璃拟态',
    description: '具有半透明玻璃质感的现代 3D 外观。',
    promptSuffix: '3D render, glassmorphism, frosted glass texture, soft shadows, premium feel, modern gradient background'
  },
  {
    id: 'bold-gradient',
    name: '大胆渐变',
    description: '富有活力的色彩与动态的排版流动感。',
    promptSuffix: 'vibrant color gradient, bold typography, dynamic layout, energetic, high contrast, studio lighting'
  }
];
