import { Chapter } from './bookData';

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'forest';
export type BengaliFontFamily = 'siliguri' | 'serif' | 'tiro';
export type ViewMode = 'page' | 'scroll' | 'cover' | 'print';

export interface ReaderSettings {
  theme: ReaderTheme;
  fontFamily: BengaliFontFamily;
  fontSize: number; // in px: 16 to 24
  lineHeight: number; // 1.6 to 2.2
  textAlignment: 'justify' | 'left';
  twoColumnDesktop: boolean;
  autoPlayNextAudio: boolean;
  audioPlaybackRate: number; // 0.75, 1, 1.25, 1.5
}

export interface UserReflection {
  chapterId: number | string;
  note: string;
  updatedAt: string;
}

export interface PersonaConfig {
  pitch: number;
  rate: number;
  label: string;
  badge: string;
  color: string;
}

export const PERSONA_CONFIGS: Record<Chapter['role'], PersonaConfig> = {
  citizen: {
    pitch: 1.15,
    rate: 0.95,
    label: 'নাগরিকের কণ্ঠ (কোমল ও ব্যথিত)',
    badge: 'নাগরিক',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  },
  officer: {
    pitch: 0.9,
    rate: 1.0,
    label: 'মাঠ কর্মকর্তার কণ্ঠ (প্রশাসনিক ও শান্ত)',
    badge: 'মাঠ কর্মকর্তা',
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
  },
  politician: {
    pitch: 0.75,
    rate: 0.9,
    label: 'রাজনীতিবিদের কণ্ঠ (ভারী ও গম্ভীর)',
    badge: 'রাজনীতিবিদ',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  },
  narrator: {
    pitch: 1.0,
    rate: 0.95,
    label: 'কথকের কণ্ঠ (নিরপেক্ষ সংযোগ)',
    badge: 'সংযোগ সেতু',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  },
};

// Bengali numeral conversion utility
export function toBengaliNumber(n: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return n.toString().replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}
