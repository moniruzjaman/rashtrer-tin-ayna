import React, { useState, useEffect } from 'react';
import { Chapter, CHAPTERS_DATA } from '../bookData';
import {
  ReaderSettings,
  PERSONA_CONFIGS,
  toBengaliNumber,
} from '../types';
import { THEME_CLASSES, FONT_CLASSES } from '../utils/themeStyles';
import {
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

interface Props {
  chapter: Chapter;
  chapterIndex: number;
  totalChapters: number;
  settings: ReaderSettings;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onNavigate: (step: number) => void;
  userReflection: string;
  onSaveReflection: (note: string) => void;
  onOpenQuoteCard: () => void;
}

export const ChapterView: React.FC<Props> = ({
  chapter,
  chapterIndex,
  totalChapters,
  settings,
  isAudioPlaying,
  onToggleAudio,
  isBookmarked,
  onToggleBookmark,
  onNavigate,
  userReflection,
  onSaveReflection,
  onOpenQuoteCard,
}) => {
  const [reflectionInput, setReflectionInput] = useState(userReflection);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [isNoteExpanded, setIsNoteExpanded] = useState(!!userReflection);

  const colors = THEME_CLASSES[settings.theme];
  const fontClass = FONT_CLASSES[settings.fontFamily];
  const persona = PERSONA_CONFIGS[chapter.role] || PERSONA_CONFIGS.narrator;

  // Sync reflection input when chapter changes
  useEffect(() => {
    setReflectionInput(userReflection || '');
    setIsNoteExpanded(!!userReflection);
  }, [chapterIndex, userReflection]);

  const handleReflectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReflectionInput(val);
    onSaveReflection(val);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleCopyContent = () => {
    const fullText = `${chapter.title}\n${chapter.part}\n\n"${chapter.hook}"\n\n${chapter.content}\n\nঅন্তর-জিজ্ঞাসা: ${chapter.question}`;
    navigator.clipboard.writeText(fullText);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  return (
    <article
      className={`w-full max-w-3xl mx-auto transition-all duration-300 pb-16 ${fontClass}`}
    >
      {/* Chapter Card Container */}
      <div
        className={`p-6 sm:p-10 md:p-12 rounded-3xl ${colors.cardBg} border ${colors.border} shadow-xl shadow-black/5 space-y-8`}
      >
        {/* Meta Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/40 dark:border-stone-800/40 pb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
              অধ্যায় {toBengaliNumber(chapterIndex + 1)} / {toBengaliNumber(totalChapters)}
            </span>
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${persona.color}`}>
              {chapter.character}
            </span>
          </div>

          <span className={`text-xs ${colors.textMuted} font-medium`}>
            {chapter.part}
          </span>
        </div>

        {/* Chapter Title */}
        <div className="space-y-3">
          <h1
            className={`text-2xl sm:text-4xl md:text-[2.6rem] font-bold ${colors.textPrimary} tracking-tight leading-tight`}
          >
            {chapter.title}
          </h1>
          <div className="w-16 h-1 bg-amber-500/80 rounded-full"></div>
        </div>

        {/* Retention Hook Quote */}
        <blockquote
          className={`border-l-4 ${colors.quoteBorder} ${colors.quoteBg} pl-5 pr-4 py-3.5 rounded-r-2xl text-base sm:text-lg italic font-medium leading-relaxed ${colors.textSecondary}`}
        >
          "{chapter.hook}"
        </blockquote>

        {/* Chapter Main Content */}
        <div
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            textAlign: settings.textAlignment,
          }}
          className={`${colors.textPrimary} font-normal transition-all duration-200 selection:bg-amber-300 dark:selection:bg-amber-900 leading-relaxed`}
        >
          {settings.twoColumnDesktop ? (
            <div className="md:columns-2 md:gap-8">
              <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                {chapter.content}
              </p>
            </div>
          ) : (
            <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
              {chapter.content}
            </p>
          )}
        </div>

        {/* Chapter Action Buttons (Audio, Bookmark, Share, Copy) */}
        <div className={`pt-4 border-t ${colors.border} flex flex-wrap items-center justify-between gap-2`}>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAudio}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                isAudioPlaying
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                  : `border ${colors.border} hover:bg-black/5 dark:hover:bg-white/5 ${colors.textSecondary}`
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>থামান</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>শুনুন ({persona.badge})</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl border ${colors.border} transition ${
                isBookmarked
                  ? 'bg-amber-500/15 border-amber-500 text-amber-600 font-bold'
                  : `hover:bg-black/5 dark:hover:bg-white/5 ${colors.textMuted}`
              }`}
              title={isBookmarked ? 'বুকমার্ক সরানো' : 'বুকমার্ক করুন'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQuoteCard}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${colors.border} text-xs font-medium ${colors.textSecondary} hover:bg-black/5 dark:hover:bg-white/5 transition`}
            >
              <Share2 className="w-3.5 h-3.5 text-amber-600" />
              <span>শেয়ার কার্ড</span>
            </button>

            <button
              onClick={handleCopyContent}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${colors.border} text-xs font-medium ${colors.textSecondary} hover:bg-black/5 dark:hover:bg-white/5 transition`}
            >
              {copiedContent ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedContent ? 'কপি হয়েছে' : 'কপি'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Reflection Box (Hook & Personal Notes) */}
        <div className={`p-5 md:p-6 rounded-2xl border ${colors.border} ${colors.cardBoxBg} space-y-4`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600/10 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-amber-700 dark:text-amber-400">
                অধ্যায় সমাপ্তির অন্তর-জিজ্ঞাসা:
              </h4>
              <p className={`text-sm ${colors.textSecondary} mt-1 font-medium italic leading-relaxed`}>
                "{chapter.question}"
              </p>
            </div>
          </div>

          {/* User note section */}
          <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>
                  {isNoteExpanded ? 'আপনার নিজস্ব ভাবনা লিখছেন' : 'পাঠকের ভাবনা নোট করুন'}
                </span>
              </button>
              {isSavedNotice && (
                <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> সংরক্ষিত
                </span>
              )}
            </div>

            {isNoteExpanded && (
              <textarea
                value={reflectionInput}
                onChange={handleReflectionChange}
                placeholder="এই প্রশ্নের প্রেক্ষিতে আপনার নিজস্ব অভিজ্ঞতা বা চিন্তা এখানে লিখে রাখুন (অটোসেভ হবে)..."
                rows={3}
                className={`w-full p-3 rounded-xl border ${colors.border} ${colors.inputBg} text-xs focus:ring-2 focus:ring-amber-500/40 focus:outline-none placeholder:text-stone-400 leading-relaxed`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 px-2">
        <button
          onClick={() => onNavigate(-1)}
          disabled={chapterIndex === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border ${colors.border} ${colors.cardBg} font-semibold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>পূর্ববর্তী অধ্যায়</span>
        </button>

        <div className="text-center">
          <span className={`text-xs font-semibold ${colors.textMuted}`}>
            {toBengaliNumber(chapterIndex + 1)} / {toBengaliNumber(totalChapters)}
          </span>
        </div>

        <button
          onClick={() => onNavigate(1)}
          disabled={chapterIndex === totalChapters - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>পরবর্তী অধ্যায়</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};
