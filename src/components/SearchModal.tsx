import React, { useState, useMemo } from 'react';
import { CHAPTERS_DATA } from '../bookData';
import { ReaderTheme, toBengaliNumber, PERSONA_CONFIGS } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { Search, X, ChevronRight, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (index: number) => void;
  theme: ReaderTheme;
}

export const SearchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectChapter,
  theme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const colors = THEME_CLASSES[theme];

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return CHAPTERS_DATA.map((ch, idx) => {
      const matchTitle = ch.title.toLowerCase().includes(q);
      const matchHook = ch.hook.toLowerCase().includes(q);
      const matchContent = ch.content.toLowerCase().includes(q);
      const matchQuestion = ch.question.toLowerCase().includes(q);
      const matchPart = ch.part.toLowerCase().includes(q);
      const matchChar = ch.character.toLowerCase().includes(q);

      if (matchTitle || matchHook || matchContent || matchQuestion || matchPart || matchChar) {
        // extract snippet around match
        let snippet = ch.content;
        const pos = ch.content.toLowerCase().indexOf(q);
        if (pos !== -1) {
          const start = Math.max(0, pos - 40);
          const end = Math.min(ch.content.length, pos + q.length + 60);
          snippet = (start > 0 ? '...' : '') + ch.content.slice(start, end) + (end < ch.content.length ? '...' : '');
        } else if (matchHook) {
          snippet = `"${ch.hook}"`;
        } else if (matchQuestion) {
          snippet = `অন্তর-জিজ্ঞাসা: "${ch.question}"`;
        }

        return {
          chapter: ch,
          index: idx,
          snippet,
          matchedIn: matchTitle ? 'শিরোনামে' : matchHook ? 'পঙ্‌ক্তিতে' : matchQuestion ? 'জিজ্ঞাসায়' : 'মূল পাঠ্যাংশে',
        };
      }
      return null;
    }).filter(Boolean) as {
      chapter: (typeof CHAPTERS_DATA)[0];
      index: number;
      snippet: string;
      matchedIn: string;
    }[];
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl ${colors.cardBg} ${colors.textPrimary} rounded-2xl shadow-2xl border ${colors.border} flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Search Input Bar */}
        <div className={`p-4 border-b ${colors.border} flex items-center gap-3`}>
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="সম্পূর্ণ ই-বুকে খুঁজুন (উদাঃ লাইন, ভোট, সংস্কার, কৃষক, সিন্ডিকেট)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base focus:outline-none placeholder:text-stone-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`text-xs px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 ${colors.textMuted}`}
            >
              মুছুন
            </button>
          )}
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!searchTerm.trim() ? (
            <div className="py-12 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-amber-600/40 mb-3" />
              <p className="text-sm font-medium">কোনো শব্দ বা বাক্য লিখে অনুসন্ধান করুন</p>
              <p className={`text-xs ${colors.textMuted} mt-1`}>
                বইয়ের ২৮টি অধ্যায় ও সংযোগ সেতুর মূল বিষয়বস্তুর মধ্যে তাৎক্ষণিক অনুসন্ধান হবে।
              </p>
              {/* Popular tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md mx-auto">
                {['ভোরের লাইন', 'ভোটের ভয়', 'কৃষকের খাতা', 'ফাইলের ভেতরের দেশ', 'ক্ষমতার লোভ', 'সংস্কার', 'বিচার বিভাগ'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border ${colors.border} hover:bg-amber-500/10 hover:border-amber-500 text-stone-600 dark:text-stone-300 transition`}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-stone-400">"{searchTerm}" দিয়ে কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="text-xs text-stone-500 mt-1">বানান ঠিক রেখে অন্য কোনো শব্দ দিয়ে চেষ্টা করুন।</p>
            </div>
          ) : (
            <div>
              <div className={`text-xs px-2 py-1 mb-2 font-medium ${colors.textMuted}`}>
                {toBengaliNumber(results.length)} টি অনুচ্ছেদে মিল পাওয়া গেছে
              </div>
              <div className="space-y-2">
                {results.map(({ chapter, index, snippet, matchedIn }) => {
                  const persona = PERSONA_CONFIGS[chapter.role] || PERSONA_CONFIGS.narrator;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        onSelectChapter(index);
                        onClose();
                      }}
                      className={`w-full text-left p-3 rounded-xl border ${colors.border} hover:border-amber-500 hover:bg-amber-500/5 transition group flex items-start justify-between gap-3`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${persona.color}`}>
                            {chapter.character}
                          </span>
                          <span className="text-xs font-semibold text-amber-600">
                            অধ্যায় {toBengaliNumber(index + 1)}: {chapter.title}
                          </span>
                          <span className={`text-[10px] ml-auto ${colors.textMuted} bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded`}>
                            {matchedIn}
                          </span>
                        </div>
                        <p className={`text-xs ${colors.textSecondary} line-clamp-2 italic`}>
                          {snippet}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 self-center text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
