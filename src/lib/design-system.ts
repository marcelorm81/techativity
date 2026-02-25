// Design System — Editorial Olive / Gambarino
// Based on Figma designs: olive green + light sage palette with Gambarino serif

export const C = {
  // Core palette (from Figma)
  olive: '#526426',        // Primary — headings, shapes, accents
  oliveDark: '#3E4D1C',    // Darker olive for emphasis
  oliveLight: '#6B8236',   // Lighter olive
  cream: '#EBEFE2',        // Primary light background
  creamDark: '#DDE3D2',    // Slightly darker cream
  white: '#FFFFFF',
  black: '#1A1A1A',
  darkBg: '#526426',       // Dark background = olive (for cover/section slides)

  // Legacy aliases (keeps existing component references working)
  sage: '#526426',
  sageDark: '#3E4D1C',
  sageLight: '#6B8236',
  sagePale: '#EBEFE2',
  warmWhite: '#EBEFE2',
  cardBg: '#F0EDE8',
  midGray: '#6B6B6B',
  lightGray: '#999999',
  darkText: '#526426',
  warmGray: '#B0A99F',
  tagBg: '#EBEFE2',
  tagBgDark: '#3A3A3A',
  accentOlive: '#526426',
} as const;

export const F = {
  title: "'Gambarino', 'Georgia', serif",
  body: "'Gambarino', 'Georgia', serif",
  mono: "'Gambarino', 'Georgia', serif",
} as const;

export type ColorKey = keyof typeof C;
export type { BgMode } from '../types/design';

// Background color mapping
export const BG_COLORS: Record<import('../types/design').BgMode, string> = {
  light: C.cream,
  dark: C.olive,
  sage: C.olive,
  cream: C.cream,
  warmWhite: C.cream,
};

// Text color for each background mode
export const TEXT_COLORS: Record<import('../types/design').BgMode, { heading: string; body: string; accent: string }> = {
  light: { heading: C.olive, body: C.olive, accent: C.olive },
  dark: { heading: C.white, body: C.white, accent: C.cream },
  sage: { heading: C.white, body: C.white, accent: C.cream },
  cream: { heading: C.olive, body: C.olive, accent: C.olive },
  warmWhite: { heading: C.olive, body: C.olive, accent: C.olive },
};
