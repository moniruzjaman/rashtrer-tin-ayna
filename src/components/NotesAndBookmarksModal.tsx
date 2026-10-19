import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../bookData';
import { ReaderTheme, toBengaliNumber } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { Bookmark, Edit3, X, Trash2, ArrowRight, Copy, Check, Download, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: number[];
  onToggleBookmark: (index: number) => void;
  reflections: Record<string, string>;
  onDeleteReflection: (chapterId: string) => void;
  onSelectChapter: (index: number) => void;
  theme: ReaderTheme;
}

export const NotesAndBookmarksModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookmarks,
  onToggleBookmark,
  reflections,
  onDeleteReflection,
  onSelectChapter,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks'>('notes');
  const [copied, setCopied] = useState(false);
  const colors = THEME_CLASSES[theme];

  if (!isOpen) return null;

  const reflectionEntries = Object.entries(reflections).filter(([_, note]) => note.trim().length > 0);

  const handleCopyAllNotes = () => {
    let text = `রাষ্ট্রের তিন আয়না — আমার চিন্তা ও অন্তর-জিজ্ঞাসার নোটস\n\n`;
    reflectionEntries.forEach(([chId, note]) => {
      const ch = CHAPTERS_DATA.find((c) => c.id.toString() === chId.toString());
      if (ch) {
        text += `----------------------------------------\n`;
        text += `অধ্যায়: ${ch.title} (${ch.part} - ${ch.character})\n`;
        text += `প্রশ্ন: "${ch.question}"\n\n`;
        text += `আমার উত্তর:\n${note}\n\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    let text = `রাষ্ট্রের তিন আয়না — পাঠক ডায়রি\n\n`;
    reflectionEntries.forEach(([chId, note]) => {
      const ch = CHAPTERS_DATA.find((c) => c.id.toString() === chId.toString());
      if (ch) {
        text += `========================================\n`;
        text += `অধ্যায়: ${ch.title} (${ch.part} - ${ch.character})\n`;
        text += `প্রশ্ন: "${ch.question}"\n\n`;
        text += `আমার চিন্তা:\n${note}\n\n`;
      }
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rashtrer-teen-ayna-notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-2xl ${colors.cardBg} ${colors.textPrimary} rounded-2xl shadow-2xl border ${colors.border} flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'notes'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : `${colors.textMuted} hover:text-stone-900 dark:hover:text-white`
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>আমার নোটস ({toBengaliNumber(reflectionEntries.length)})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'bookmarks'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : `${colors.textMuted} hover:text-stone-900 dark:hover:text-white`
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>বুকমার্ক ({toBengaliNumber(bookmarks.length)})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'notes' ? (
            reflectionEntries.length === 0 ? (
              <div className="py-16 text-center">
                <Edit3 className="w-10 h-10 mx-auto text-amber-600/30 mb-3" />
                <p className="text-sm font-semibold">এখনো কোনো অধ্যায়ের নোট সংরক্ষণ করেননি</p>
                <p className={`text-xs ${colors.textMuted} mt-1 max-w-sm mx-auto`}>
                  প্রতিটি অধ্যায়ের নিচে "অন্তর-জিজ্ঞাসা" বক্সে আপনার নিজস্ব ভাবনা লিখুন এবং সংরক্ষণ করুন।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200/50 dark:border-stone-800/50">
                  <span className={`text-xs ${colors.textMuted}`}>
                    সংরক্ষিত উত্তর ও ভাবনা সমূহ
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAllNotes}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border ${colors.border} hover:bg-black/5 dark:hover:bg-white/5 transition font-medium`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'কপি হয়েছে' : 'সব কপি করুন'}</span>
                    </button>
                    <button
                      onClick={handleDownloadNotes}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition font-medium shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড</span>
                    </button>
                  </div>
                </div>

                {reflectionEntries.map(([chId, note]) => {
                  const chIndex = CHAPTERS_DATA.findIndex((c) => c.id.toString() === chId.toString());
                  const ch = CHAPTERS_DATA[chIndex];
                  if (!ch) return null;

                  return (
                    <div
                      key={chId}
                      className={`p-4 rounded-xl border ${colors.border} ${colors.cardBoxBg} space-y-2.5`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                            {ch.part}
                          </span>
                          <h4 className="text-sm font-bold">{ch.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              onSelectChapter(chIndex);
                              onClose();
                            }}
                            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-amber-600 text-xs flex items-center gap-1"
                            title="অধ্যায়ে যান"
                          >
                            <span>পড়ুন</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteReflection(chId)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs italic text-stone-500 dark:text-stone-400 pl-3 border-l-2 border-amber-500/40">
                        প্রশ্ন: "{ch.question}"
                      </div>

                      <div className="text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed bg-white/60 dark:bg-black/40 p-3 rounded-lg border border-black/5 dark:border-white/5">
                        {note}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : bookmarks.length === 0 ? (
            <div className="py-16 text-center">
              <Bookmark className="w-10 h-10 mx-auto text-amber-600/30 mb-3" />
              <p className="text-sm font-semibold">কোনো অধ্যায় বুকমার্ক করা নেই</p>
              <p className={`text-xs ${colors.textMuted} mt-1 max-w-sm mx-auto`}>
                পড়ার সময় যেকোনো অধ্যায়ের বুকমার্ক আইকনে ক্লিক করে দ্রুত ফিরে আসার জন্য বুকমার্ক করে রাখুন।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarks.map((index) => {
                const ch = CHAPTERS_DATA[index];
                if (!ch) return null;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border ${colors.border} hover:border-amber-500 transition flex items-center justify-between gap-3 group`}
                  >
                    <button
                      onClick={() => {
                        onSelectChapter(index);
                        onClose();
                      }}
                      className="flex-1 text-left flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-md bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {toBengaliNumber(index + 1)}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-amber-600 font-semibold">{ch.part}</span>
                        <h4 className="text-sm font-semibold truncate">{ch.title}</h4>
                        <p className={`text-xs ${colors.textMuted} truncate italic`}>"{ch.hook}"</p>
                      </div>
                    </button>

                    <button
                      onClick={() => onToggleBookmark(index)}
                      className="p-2 rounded-lg text-amber-500 hover:text-red-500 hover:bg-red-500/10 transition"
                      title="বুকমার্ক মুছুন"
                    >
                      <Bookmark className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
