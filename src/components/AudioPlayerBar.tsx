import React from 'react';
import { Chapter } from '../bookData';
import { PERSONA_CONFIGS, toBengaliNumber, ReaderTheme } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { Play, Pause, Square, SkipBack, SkipForward, Volume2, X } from 'lucide-react';

interface Props {
  chapter: Chapter;
  chapterIndex: number;
  totalChapters: number;
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
  theme: ReaderTheme;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
}

export const AudioPlayerBar: React.FC<Props> = ({
  chapter,
  chapterIndex,
  totalChapters,
  isPlaying,
  isPaused,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
  theme,
  playbackRate,
  onChangePlaybackRate,
}) => {
  const colors = THEME_CLASSES[theme];
  const persona = PERSONA_CONFIGS[chapter.role] || PERSONA_CONFIGS.narrator;

  const nextSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const next = speeds[(currentIndex + 1) % speeds.length];
    onChangePlaybackRate(next);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-2xl mx-auto z-40 animate-in slide-in-from-bottom duration-300">
      <div
        className={`p-3.5 sm:px-5 rounded-2xl ${colors.cardBg} border ${colors.border} shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md`}
      >
        {/* Left: Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-600 shrink-0 relative">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${persona.color}`}>
                {persona.badge}
              </span>
              <span className={`text-[10px] ${colors.textMuted} truncate`}>
                {persona.label}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold truncate">
              {toBengaliNumber(chapterIndex + 1)}. {chapter.title}
            </h4>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onPrev}
            disabled={chapterIndex === 0}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} disabled:opacity-30`}
            title="পূর্ববর্তী অধ্যায়"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-md transition"
            title={isPlaying ? 'বিরতি' : 'চালান'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={onStop}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary}`}
            title="বন্ধ করুন"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={onNext}
            disabled={chapterIndex === totalChapters - 1}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textSecondary} disabled:opacity-30`}
            title="পরবর্তী অধ্যায়"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={nextSpeed}
            className={`px-2 py-1 rounded-lg border ${colors.border} text-[11px] font-mono font-semibold hover:bg-black/5 ${colors.textSecondary}`}
            title="গতি পরিবর্তন"
          >
            {playbackRate}x
          </button>

          <button
            onClick={onStop}
            className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted}`}
            title="প্লেয়ার বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
