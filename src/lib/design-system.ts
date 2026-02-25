// Design System — Editorial Sage
// Ported from techativity.js PPTX design system

export const C = {
  black: '#1A1A1A',
  darkBg: '#1E1E1E',
  sage: '#A8B5A0',
  sageDark: '#8A9B82',
  sageLight: '#C8D3C2',
  sagePale: '#E8EDE6',
  cream: '#F5F2ED',
  warmWhite: '#FAFAF7',
  cardBg: '#F0EDE8',
  midGray: '#6B6B6B',
  lightGray: '#999999',
  darkText: '#2A2A2A',
  white: '#FFFFFF',
  warmGray: '#B0A99F',
  tagBg: '#E8EDE6',
  tagBgDark: '#3A3A3A',
  accentOlive: '#5A6B52',
} as const;

export const F = {
  title: "'Georgia', 'Times New Roman', serif",
  body: "'Calibri', 'Helvetica Neue', 'Segoe UI', sans-serif",
  mono: "'Consolas', 'Monaco', monospace",
} as const;

export type ColorKey = keyof typeof C;
export type { BgMode } from '../types/design';

// Background color mapping
export const BG_COLORS: Record<import('../types/design').BgMode, string> = {
  light: C.warmWhite,
  dark: C.darkBg,
  sage: C.sage,
  cream: C.cream,
  warmWhite: C.warmWhite,
};

// Text color for each background mode
export const TEXT_COLORS: Record<import('../types/design').BgMode, { heading: string; body: string; accent: string }> = {
  light: { heading: C.black, body: C.midGray, accent: C.sageDark },
  dark: { heading: C.white, body: C.warmGray, accent: C.sage },
  sage: { heading: C.accentOlive, body: C.accentOlive, accent: C.white },
  cream: { heading: C.black, body: C.midGray, accent: C.sageDark },
  warmWhite: { heading: C.black, body: C.midGray, accent: C.sageDark },
};
