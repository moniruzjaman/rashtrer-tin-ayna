import React from 'react';
import { CHAPTERS_DATA } from '../bookData';
import { ReaderSettings, PERSONA_CONFIGS, toBengaliNumber } from '../types';
import { THEME_CLASSES, FONT_CLASSES } from '../utils/themeStyles';
import { Volume2, VolumeX, Bookmark, Share2, Lightbulb } from 'lucide-react';

interface Props {
  settings: ReaderSettings;
  bookmarks: number[];
  onToggleBookmark: (index: number) => void;
  activeAudioIndex: number | null;
  onPlayAudioForChapter: (index: number) => void;
  onOpenQuoteCard: (index: number) => void;
}

export const ContinuousScrollView: React.FC<Props> = ({
  settings,
  bookmarks,
  onToggleBookmark,
  activeAudioIndex,
  onPlayAudioForChapter,
  onOpenQuoteCard,
}) => {
  const colors = THEME_CLASSES[settings.theme];
  const fontClass = FONT_CLASSES[settings.fontFamily];

  return (
    <div className={`w-full max-w-3xl mx-auto space-y-12 pb-24 ${fontClass}`}>
      <div className={`p-4 rounded-2xl border ${colors.border} ${colors.cardBg} text-center space-y-1`}>
        <h2 className="text-sm font-bold text-amber-600">অখণ্ড পাঠ ভিউ (Continuous Scroll)</h2>
        <p className={`text-xs ${colors.textMuted}`}>
          একটানা সব অধ্যায় পড়ার মোড। নিচ থেকে ওপরে বা ওপর থেকে নিচে স্ক্রল করে সম্পূর্ণ বইটি একসাথে পাঠ করুন।
        </p>
      </div>

      {CHAPTERS_DATA.map((chapter, index) => {
        const isAudioPlaying = activeAudioIndex === index;
        const isBookmarked = bookmarks.includes(index);
        const persona = PERSONA_CONFIGS[chapter.role] || PERSONA_CONFIGS.narrator;

        return (
          <section
            key={chapter.id}
            id={`chapter-section-${index}`}
            className={`p-6 sm:p-10 rounded-3xl ${colors.cardBg} border ${colors.border} shadow-lg shadow-black/5 space-y-6 transition-all`}
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  অধ্যায় {toBengaliNumber(index + 1)}
                </span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${persona.color}`}>
                  {chapter.character}
                </span>
              </div>
              <span className={`text-xs ${colors.textMuted}`}>{chapter.part}</span>
            </div>

            {/* Title */}
            <h2 className={`text-2xl sm:text-3xl font-bold ${colors.textPrimary}`}>
              {chapter.title}
            </h2>

            {/* Hook quote */}
            <blockquote
              className={`border-l-4 ${colors.quoteBorder} ${colors.quoteBg} pl-4 py-2.5 rounded-r-xl text-base italic font-medium leading-relaxed ${colors.textSecondary}`}
            >
              "{chapter.hook}"
            </blockquote>

            {/* Main content */}
            <div
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                textAlign: settings.textAlignment,
              }}
              className={`${colors.textPrimary} font-normal leading-relaxed`}
            >
              <p className="first-letter:text-2xl first-letter:font-bold first-letter:text-amber-600 first-letter:float-left first-letter:mr-2">
                {chapter.content}
              </p>
            </div>

            {/* Reflection box */}
            <div className={`p-4 rounded-xl border ${colors.border} ${colors.cardBoxBg} flex items-start gap-3`}>
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">অন্তর-জিজ্ঞাসা: </span>
                <span className={`${colors.textSecondary} italic`}>"{chapter.question}"</span>
              </div>
            </div>

            {/* Footer tools */}
            <div className={`pt-3 border-t ${colors.border} flex items-center justify-between`}>
              <button
                onClick={() => onPlayAudioForChapter(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isAudioPlaying
                    ? 'bg-amber-600 text-white'
                    : `border ${colors.border} hover:bg-black/5 dark:hover:bg-white/5 ${colors.textSecondary}`
                }`}
              >
                {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-600" />}
                <span>{isAudioPlaying ? 'থামান' : 'শুনুন'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenQuoteCard(index)}
                  className={`p-1.5 rounded-lg border ${colors.border} ${colors.textMuted} hover:bg-black/5`}
                  title="শেয়ার কার্ড"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                </button>
                <button
                  onClick={() => onToggleBookmark(index)}
                  className={`p-1.5 rounded-lg border ${colors.border} ${
                    isBookmarked ? 'text-amber-500 fill-amber-500' : colors.textMuted
                  }`}
                  title="বুকমার্ক"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
