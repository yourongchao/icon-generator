
import { StylePreset } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'pro-designer',
    name: '专业设计师风',
    icon: '👔',
    description: '高端、平衡、极具设计感的专业工作室水准。',
    promptSuffix: 'high-end professional design, studio lighting, premium textures, sophisticated typography, balanced composition, expert graphic design, sleek and corporate, minimalist yet premium'
  },
  {
    id: 'tech-future',
    name: '科技感未来风',
    icon: '🚀',
    description: '全息光效、电路纹理，触手可及的未来。',
    promptSuffix: 'high-tech futuristic aesthetic, holographic elements, circuit board lines, glowing blue energy, sci-fi interface style, ultra-modern tech, deep space blue and silver, sharp digital edges'
  },
  {
    id: 'fresh-healing',
    name: '清新治愈风',
    icon: '🍃',
    description: '莫兰迪色系、柔和光影，温暖人心。',
    promptSuffix: 'fresh and healing aesthetic, soft pastel color palette, airy atmosphere, gentle natural lighting, cozy and warm, minimalist organic shapes, serene and peaceful design, soft gradients'
  },
  {
    id: 'memphis-flat',
    name: '孟菲斯扁平风',
    icon: '🧩',
    description: '活泼几何形、波浪线，经典孟菲斯艺术。',
    promptSuffix: 'Memphis design style, flat vector, playful geometric shapes, squiggly lines and dots, high contrast vibrant colors, pop art influence, modern flat aesthetic, abstract patterns'
  },
  {
    id: 'minimalist',
    name: '极简主义',
    icon: '🎨',
    description: '干净、简单的排版和扁平化设计。',
    promptSuffix: 'minimalist design, flat vector, clean sans-serif typography, solid background, professional tech aesthetic'
  },
  {
    id: 'anime-design',
    name: '动漫设计',
    icon: '⛩️',
    description: '活力四射的二次元动漫风格，明亮饱和。',
    promptSuffix: 'anime art style, vibrant cel-shading, high-quality character illustration, expressive lines, modern anime aesthetic, bright colors, digital art, sharp detail'
  },
  {
    id: 'davinci-sketch',
    name: '达芬奇草稿',
    icon: '📜',
    description: '文艺复兴时期的手稿风格，羊皮纸质感，精细素描。',
    promptSuffix: 'Leonardo da Vinci manuscript style, old parchment paper background, sepia ink sketches, Renaissance technical drawing, anatomical and mechanical diagrams, charcoal strokes, aged paper texture, mirror writing aesthetic'
  },
  {
    id: 'ukiyo-e',
    name: '浮世绘',
    icon: '🌊',
    description: '日本传统木刻版画风格，韵味十足。',
    promptSuffix: 'Japanese ukiyo-e woodblock print style, bold outlines, traditional flat colors, Kanagawa wave aesthetic, cultural heritage, vintage artistic look'
  },
  {
    id: 'bauhaus',
    name: '包豪斯',
    icon: '📐',
    description: '经典几何美学，红黄蓝三原色构图。',
    promptSuffix: 'Bauhaus design style, primary colors red blue yellow, geometric shapes, circle triangle square, minimalist functionalism, early 20th century modernism aesthetic'
  },
  {
    id: 'isometric-3d',
    name: '等距视角',
    icon: '🧱',
    description: '现代 2.5D 矢量艺术，极具空间感。',
    promptSuffix: '3D isometric vector art, 2.5D perspective, clean geometric shapes, modern app icon aesthetic, soft ambient occlusion shadows, professional tech illustration'
  },
  {
    id: 'vaporwave',
    name: '蒸汽波',
    icon: '🏮',
    description: '80年代复古未来主义，梦幻粉紫色调。',
    promptSuffix: 'Vaporwave aesthetic, 80s retro futurism, glitched 3D statues, pink and teal palette, lo-fi nostalgic mood, synthwave elements'
  },
  {
    id: 'program-code',
    name: '程序代码',
    icon: '💻',
    description: '极客范、代码语法高亮、终端感。',
    promptSuffix: 'programming code aesthetic, code syntax highlighting, dark IDE theme, VS Code style, terminal console UI elements, monospaced typography, glowing brackets, software engineering branding'
  },
  {
    id: 'cute-cartoon',
    name: '可爱卡通',
    icon: '✨',
    description: '萌系 Q 版风格，明亮活泼的色彩。',
    promptSuffix: 'cute cartoon style, kawaii aesthetic, chibi characters, rounded soft edges, vibrant pastel colors, 3D clay-like texture, high-quality character design'
  },
  {
    id: 'hand-drawn-sketch',
    name: '手绘素描',
    icon: '✏️',
    description: '精致的铅笔线条，真实手绘感。',
    promptSuffix: 'detailed pencil sketch, hand-drawn artistic lines, graphite strokes, charcoal texture, white paper background, minimalist fine art style'
  },
  {
    id: 'claymorphism',
    name: '粘土风格',
    icon: '🧶',
    description: '目前最流行的胖乎乎 3D 粘土质感。',
    promptSuffix: 'claymorphism 3D style, soft clay texture, puffy and squishy look, pastel colors, high-end 3D render, playful and modern'
  },
  {
    id: 'watercolor-art',
    name: '水墨晕染',
    icon: '🖌️',
    description: '柔美水彩质感，优雅自然流转。',
    promptSuffix: 'traditional ink wash and watercolor, flowing pigments, soft paper texture, artistic bleeding edges, elegant and calm, organic shapes'
  },
  {
    id: 'low-poly-art',
    name: '低多边形',
    icon: '💎',
    description: '独特的多边形网格，数字化艺术感。',
    promptSuffix: 'low poly geometric art, faceted surfaces, triangular mesh, sharp edges, modern digital 3D look, abstract geometric composition'
  },
  {
    id: 'warhammer-world',
    name: '战锤世界',
    icon: '🦅',
    description: '哥特式黑暗奇幻、繁复金属雕刻。',
    promptSuffix: 'Warhammer 40k style, gothic industrial architecture, grimdark aesthetic, ornate gold and iron carvings, imperial eagle motifs, battle-worn textures'
  },
  {
    id: 'wasteland-survival',
    name: '废土末日',
    icon: '☢️',
    description: '锈迹斑斑、破败美学与生存风格。',
    promptSuffix: 'post-apocalyptic wasteland aesthetic, rusty metal textures, dusty atmosphere, survivalist gear elements, weathered typography, gritty cinematic lighting'
  },
  {
    id: 'transformers-mecha',
    name: '变形金刚',
    icon: '🤖',
    description: '精密变形组件、科技蓝光金属感。',
    promptSuffix: 'Transformers style mecha design, intricate mechanical parts, glowing energy cores, metallic blue and silver panels, sharp robotic edges'
  },
  {
    id: 'mechanical-industrial',
    name: '工业机械',
    icon: '⚙️',
    description: '冷峻金属质感、齿轮与工程美学。',
    promptSuffix: 'industrial mechanical design, heavy metal texture, gears and bolts, technical blueprint elements, metallic reflections'
  },
  {
    id: 'natural-eco',
    name: '自然气息',
    icon: '🌿',
    description: '有机形状、绿植元素与自然光泽。',
    promptSuffix: 'natural organic design, lush green leaves, wooden textures, soft sunlight, eco-friendly aesthetic, clean typography'
  },
  {
    id: 'china-red',
    name: '中国红',
    icon: '🏮',
    description: '经典大红配金色，大气东方美学。',
    promptSuffix: 'traditional Chinese red palette, gold foil accents, elegant oriental typography, high-end cultural aesthetic, auspicious patterns'
  },
  {
    id: 'neon',
    name: '赛博霓虹',
    icon: '🏙️',
    description: '高对比度未来主义发光色。',
    promptSuffix: 'cyberpunk style, glowing neon lights, futuristic font, dark background, cyan and magenta accents'
  },
  {
    id: '3d-glass',
    name: '3D 玻璃',
    icon: '🧊',
    description: '半透明玻璃质感的现代 3D 外观。',
    promptSuffix: '3D render, glassmorphism, frosted glass texture, soft shadows, premium feel, modern gradient background'
  },
  {
    id: 'retro-pixel',
    name: '复古像素',
    icon: '👾',
    description: '经典 8-bit，怀旧像素化艺术。',
    promptSuffix: '8-bit pixel art style, retro video game aesthetic, blocky pixelated typography, vibrant low-res colors'
  },
  {
    id: 'luxury-gold',
    name: '奢华黑金',
    icon: '💎',
    description: '高光金箔配磨砂黑，极致尊贵。',
    promptSuffix: 'luxurious gold leaf texture, elegant serif typography, matte black premium background, metallic reflections'
  },
  {
    id: 'paper-cut',
    name: '剪纸艺术',
    icon: '✂️',
    description: '层次分明的纸艺效果，立体纹理。',
    promptSuffix: 'layered paper cutout art, 3D paper shadows, tactile paper texture, clean layers, craft aesthetic'
  },
  {
    id: 'fluid-organic',
    name: '流体玻璃',
    icon: '🌊',
    description: '梦幻流体形状结合磨砂玻璃质感。',
    promptSuffix: 'fluid organic shapes, frosted glass texture, soft pastel gradients, translucent layers, modern tech dreamscape'
  }
];
