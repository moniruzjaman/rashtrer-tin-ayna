import { ReaderTheme, BengaliFontFamily } from '../types';

export interface ThemeColors {
  bg: string;
  cardBg: string;
  cardBoxBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  accent: string;
  quoteBorder: string;
  quoteBg: string;
  inputBg: string;
  headerBg: string;
}

export const THEME_CLASSES: Record<ReaderTheme, ThemeColors> = {
  light: {
    bg: 'bg-stone-50',
    cardBg: 'bg-white',
    cardBoxBg: 'bg-amber-50/60',
    textPrimary: 'text-stone-900',
    textSecondary: 'text-stone-700',
    textMuted: 'text-stone-500',
    border: 'border-stone-200',
    accent: 'text-amber-600',
    quoteBorder: 'border-amber-500',
    quoteBg: 'bg-amber-500/8',
    inputBg: 'bg-white',
    headerBg: 'bg-white/90 backdrop-blur border-stone-200',
  },
  sepia: {
    bg: 'bg-[#f7f2e4]',
    cardBg: 'bg-[#eee4cf]',
    cardBoxBg: 'bg-[#e4d7bc]',
    textPrimary: 'text-[#3c2f1f]',
    textSecondary: 'text-[#5c4933]',
    textMuted: 'text-[#857057]',
    border: 'border-[#dfd0b5]',
    accent: 'text-[#b45309]',
    quoteBorder: 'border-[#c28236]',
    quoteBg: 'bg-[#c28236]/10',
    inputBg: 'bg-[#faf6ed]',
    headerBg: 'bg-[#eee4cf]/95 backdrop-blur border-[#dfd0b5]',
  },
  dark: {
    bg: 'bg-[#0f0e0d]',
    cardBg: 'bg-[#181615]',
    cardBoxBg: 'bg-[#1e1c19]',
    textPrimary: 'text-[#eee9e2]',
    textSecondary: 'text-[#b8b0a5]',
    textMuted: 'text-[#7e766c]',
    border: 'border-[#2d2926]',
    accent: 'text-amber-400',
    quoteBorder: 'border-amber-500',
    quoteBg: 'bg-amber-500/10',
    inputBg: 'bg-[#131110]',
    headerBg: 'bg-[#181615]/90 backdrop-blur border-[#2d2926]',
  },
  forest: {
    bg: 'bg-[#0d1612]',
    cardBg: 'bg-[#14221c]',
    cardBoxBg: 'bg-[#1b2d26]',
    textPrimary: 'text-[#e2ece6]',
    textSecondary: 'text-[#a9c2b4]',
    textMuted: 'text-[#6e8a7c]',
    border: 'border-[#22392f]',
    accent: 'text-emerald-400',
    quoteBorder: 'border-emerald-500',
    quoteBg: 'bg-emerald-500/10',
    inputBg: 'bg-[#0f1a15]',
    headerBg: 'bg-[#14221c]/90 backdrop-blur border-[#22392f]',
  },
};

export const FONT_CLASSES: Record<BengaliFontFamily, string> = {
  siliguri: 'font-siliguri',
  serif: 'font-bengali-serif',
  tiro: 'font-tiro',
};
