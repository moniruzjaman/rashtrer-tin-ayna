import React, { useState } from 'react';
import { Chapter, CHAPTERS_DATA, BOOK_CONFIG } from '../bookData';
import { PERSONA_CONFIGS, toBengaliNumber, ReaderTheme } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { X, Search, Bookmark, Edit3, BookOpen, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
  bookmarks: number[];
  reflections: Record<string, string>;
  theme: ReaderTheme;
  onOpenCover: () => void;
}

export const TableOfContentsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentChapterIndex,
  onSelectChapter,
  bookmarks,
  reflections,
  theme,
  onOpenCover,
}) => {
  const [filterPart, setFilterPart] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const colors = THEME_CLASSES[theme];

  if (!isOpen) return null;

  const parts = [
    { id: 'all', label: 'সকল অধ্যায়' },
    { id: 'পার্ট এ', label: 'আয়না ১: নাগরিক' },
    { id: 'সেতু ১', label: 'সেতু ১ (A ➔ B)' },
    { id: 'পার্ট বি', label: 'আয়না ২: কর্মকর্তা' },
    { id: 'সেতু ২', label: 'সেতু ২ (B ➔ C)' },
    { id: 'পার্ট সি', label: 'আয়না ৩: রাজনীতিবিদ' },
  ];

  const filteredChapters = CHAPTERS_DATA.map((ch, originalIndex) => ({ ch, originalIndex })).filter(
    ({ ch }) => {
      const matchPart = filterPart === 'all' || ch.part.includes(filterPart);
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        ch.title.toLowerCase().includes(query) ||
        ch.hook.toLowerCase().includes(query) ||
        ch.character.toLowerCase().includes(query);
      return matchPart && matchQuery;
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/60 backdrop-blur-xs transition-opacity">
      <div
        className={`h-full w-full max-w-md ${colors.cardBg} ${colors.textPrimary} shadow-2xl flex flex-col border-r ${colors.border} transition-transform transform duration-300 animate-in slide-in-from-left`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base">{BOOK_CONFIG.title}</h2>
              <p className={`text-xs ${colors.textMuted}`}>সূচিপত্র ও অধ্যায় বিন্যাস ({toBengaliNumber(CHAPTERS_DATA.length)} টি অধ্যায়)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted} transition`}
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover / Preface Button */}
        <div className={`px-4 py-2.5 border-b ${colors.border} bg-amber-500/5 flex items-center justify-between`}>
          <button
            onClick={() => {
              onOpenCover();
              onClose();
            }}
            className="flex items-center gap-2 text-xs font-semibold text-amber-600 hover:text-amber-700 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>প্রচ্ছদ ও তিন আয়নার পরিচিতি দেখুন</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-stone-200/50 dark:border-stone-800/50">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colors.border} ${colors.inputBg}`}>
            <Search className={`w-4 h-4 ${colors.textMuted}`} />
            <input
              type="text"
              placeholder="অধ্যায় বা চরিত্র খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-stone-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-xs text-stone-400 hover:text-stone-600">
                মুছুন
              </button>
            )}
          </div>

          {/* Perspective Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto py-2 no-scrollbar">
            {parts.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterPart(p.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                  filterPart === p.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : `bg-stone-200/60 dark:bg-stone-800/80 ${colors.textSecondary} hover:bg-stone-300 dark:hover:bg-stone-700`
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-900 p-2 space-y-1">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs">কোনো অধ্যায় পাওয়া যায়নি</div>
          ) : (
            filteredChapters.map(({ ch, originalIndex }) => {
              const isActive = originalIndex === currentChapterIndex;
              const isBookmarked = bookmarks.includes(originalIndex);
              const hasReflection = !!reflections[ch.id.toString()];
              const persona = PERSONA_CONFIGS[ch.role] || PERSONA_CONFIGS.narrator;

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    onSelectChapter(originalIndex);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 group ${
                    isActive
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-amber-600 text-white' : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {toBengaliNumber(originalIndex + 1)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${persona.color}`}>
                        {ch.character}
                      </span>
                      <span className={`text-[10px] ${colors.textMuted} truncate`}>{ch.part}</span>
                    </div>

                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-amber-600 font-bold' : colors.textPrimary}`}>
                      {ch.title}
                    </h3>
                    <p className={`text-xs ${colors.textMuted} truncate line-clamp-1 mt-0.5 italic`}>
                      "{ch.hook}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                    {isBookmarked && (
                      <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    )}
                    {hasReflection && (
                      <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Progress */}
        <div className={`p-3 border-t ${colors.border} bg-black/5 dark:bg-white/5 text-xs flex items-center justify-between`}>
          <span className={colors.textMuted}>পঠন অগ্রগতি</span>
          <span className="font-semibold text-amber-600">
            {toBengaliNumber(Math.round(((currentChapterIndex + 1) / CHAPTERS_DATA.length) * 100))}% সম্পন্ন
          </span>
        </div>
      </div>
    </div>
  );
};
