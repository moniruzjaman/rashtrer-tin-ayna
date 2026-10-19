import React from 'react';
import { BOOK_CONFIG } from '../bookData';
import { ReaderTheme, ViewMode, toBengaliNumber } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import {
  Menu,
  BookOpen,
  Search,
  Sliders,
  Bookmark,
  Sun,
  Moon,
  Printer,
  Sparkles,
  Columns,
  List,
} from 'lucide-react';

interface Props {
  currentChapterIndex: number;
  totalChapters: number;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenTOC: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenNotes: () => void;
  onOpenCover: () => void;
  onOpenPrint: () => void;
  theme: ReaderTheme;
  onCycleTheme: () => void;
  bookmarkCount: number;
  reflectionCount: number;
}

export const Navbar: React.FC<Props> = ({
  currentChapterIndex,
  totalChapters,
  viewMode,
  onChangeViewMode,
  onOpenTOC,
  onOpenSearch,
  onOpenSettings,
  onOpenNotes,
  onOpenCover,
  onOpenPrint,
  theme,
  onCycleTheme,
  bookmarkCount,
  reflectionCount,
}) => {
  const colors = THEME_CLASSES[theme];

  return (
    <header
      className={`sticky top-0 z-40 w-full ${colors.headerBg} border-b ${colors.border} transition-colors px-3 sm:px-6 py-2.5`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: TOC button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenTOC}
            className={`p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textPrimary} transition flex items-center gap-1.5`}
            title="সূচিপত্র খুলুন"
          >
            <Menu className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline text-xs font-semibold">সূচিপত্র</span>
          </button>

          <button
            onClick={onOpenCover}
            className="flex items-center gap-2 group text-left min-w-0"
            title="প্রচ্ছদ ও তিন আয়নার পরিচিতি"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              📖
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold truncate tracking-tight font-serif-bengali group-hover:text-amber-600 transition">
                {BOOK_CONFIG.title}
              </h1>
              <p className={`hidden sm:block text-[10px] ${colors.textMuted} truncate`}>
                {BOOK_CONFIG.subtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Center: Mode Switch (Page vs Scroll) */}
        <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 text-xs">
          <button
            onClick={() => onChangeViewMode('page')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
              viewMode === 'page'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : `${colors.textMuted} hover:text-stone-900 dark:hover:text-white`
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>পেজ রিডার</span>
          </button>
          <button
            onClick={() => onChangeViewMode('scroll')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
              viewMode === 'scroll'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : `${colors.textMuted} hover:text-stone-900 dark:hover:text-white`
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>অখণ্ড স্ক্রল</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Search */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} transition`}
            title="অনুসন্ধান করুন"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Bookmarks & Notes */}
          <button
            onClick={onOpenNotes}
            className={`relative p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} transition`}
            title="বুকমার্ক ও নোটস"
          >
            <Bookmark className="w-4 h-4" />
            {(bookmarkCount > 0 || reflectionCount > 0) && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600"></span>
            )}
          </button>

          {/* Quick Theme Cycle */}
          <button
            onClick={onCycleTheme}
            className={`p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} transition`}
            title="থিম পরিবর্তন করুন (লাইট, সেপিয়া, ডার্ক, ফরেস্ট)"
          >
            {theme === 'dark' || theme === 'forest' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} transition`}
            title="রিডার সেটিংস"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Print / PDF */}
          <button
            onClick={onOpenPrint}
            className={`hidden sm:flex p-2 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} transition`}
            title="ই-বুক প্রিন্ট বা PDF সংরক্ষণ"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
