import React, { useState } from 'react';
import { Chapter, BOOK_CONFIG } from '../bookData';
import { ReaderTheme, toBengaliNumber } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { X, Copy, Check, Share2, Sparkles, Quote } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  chapterIndex: number;
  theme: ReaderTheme;
}

export const QuoteCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  chapter,
  chapterIndex,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [cardStyle, setCardStyle] = useState<'vintage' | 'midnight' | 'minimal'>('vintage');
  const colors = THEME_CLASSES[theme];

  if (!isOpen) return null;

  const quoteText = `"${chapter.hook}"\n\n— অধ্যায়: ${chapter.title} (${chapter.part})\nবই: ${BOOK_CONFIG.title} (${BOOK_CONFIG.subtitle})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg ${colors.cardBg} ${colors.textPrimary} rounded-3xl shadow-2xl border ${colors.border} flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm">উদ্ধৃতি শেয়ার কার্ড</h3>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${colors.textMuted} hover:bg-black/5`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style switch */}
        <div className="px-5 pt-4 flex gap-2">
          {(['vintage', 'midnight', 'minimal'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setCardStyle(style)}
              className={`text-xs px-3 py-1.5 rounded-full capitalize font-medium transition ${
                cardStyle === style
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {style === 'vintage' ? 'ভিন্টেজ পার্চমেন্ট' : style === 'midnight' ? 'মিডনাইট ডার্ক' : 'মিনিমাল ক্লিন'}
            </button>
          ))}
        </div>

        {/* Card Preview */}
        <div className="p-6">
          <div
            id="quote-card-preview"
            className={`p-7 rounded-2xl relative shadow-lg overflow-hidden border transition duration-300 ${
              cardStyle === 'vintage'
                ? 'bg-amber-50 text-amber-950 border-amber-300/80 shadow-amber-900/10'
                : cardStyle === 'midnight'
                ? 'bg-stone-900 text-stone-100 border-stone-800 shadow-black/40'
                : 'bg-white text-stone-900 border-stone-200'
            }`}
          >
            {/* Top Branding */}
            <div className="flex items-center justify-between text-xs opacity-70 mb-4 pb-2 border-b border-current/15">
              <span className="font-semibold tracking-wider">{BOOK_CONFIG.title}</span>
              <span>{chapter.part}</span>
            </div>

            {/* Quote Icon */}
            <Quote className="w-8 h-8 opacity-20 mb-2 text-current" />

            {/* Hook text */}
            <p className="text-lg md:text-xl font-bengali-serif leading-relaxed mb-6 font-medium">
              "{chapter.hook}"
            </p>

            {/* Source */}
            <div className="flex items-end justify-between pt-4 border-t border-current/15 text-xs opacity-80">
              <div>
                <p className="font-bold">অধ্যায় {toBengaliNumber(chapterIndex + 1)}: {chapter.title}</p>
                <p className="text-[11px] opacity-70">দৃষ্টিভঙ্গি: {chapter.character}</p>
              </div>
              <span className="text-[10px] font-mono opacity-60">সংস্করণ ২০২৬</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={`p-4 border-t ${colors.border} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
          <span className={`text-xs ${colors.textMuted}`}>টেক্সট ও সোশ্যাল মিডিয়ার জন্য প্রস্তুত</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'কপি হয়েছে!' : 'উদ্ধৃতি কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
