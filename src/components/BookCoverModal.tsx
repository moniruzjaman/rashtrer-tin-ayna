import React from 'react';
import { BOOK_CONFIG, CHAPTERS_DATA } from '../bookData';
import { ReaderTheme, toBengaliNumber } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { BookOpen, Sparkles, X, ArrowRight, Bookmark, Volume2, ShieldCheck, Printer, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartReading: (index?: number) => void;
  theme: ReaderTheme;
  lastReadIndex: number;
  onOpenPrint: () => void;
}

export const BookCoverModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onStartReading,
  theme,
  lastReadIndex,
  onOpenPrint,
}) => {
  const colors = THEME_CLASSES[theme];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className={`w-full max-w-3xl ${colors.cardBg} ${colors.textPrimary} rounded-3xl shadow-2xl border ${colors.border} flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]`}
      >
        {/* Top bar with close */}
        <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
            <Sparkles className="w-4 h-4" />
            <span>ডিজিটাল ই-বুক সংস্করণ ও প্রস্তাবনা</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          {/* Cover Hero Card */}
          <div className="relative rounded-2xl p-8 md:p-10 bg-linear-to-br from-amber-950 via-stone-900 to-stone-950 text-white shadow-xl overflow-hidden border border-amber-600/30">
            {/* Background watermark mirror illustration */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-[180px] select-none pointer-events-none">
              🪞
            </div>

            <div className="relative z-10 max-w-xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {BOOK_CONFIG.edition} • {BOOK_CONFIG.year}
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-serif-bengali text-white leading-tight">
                {BOOK_CONFIG.title}
              </h1>

              <p className="text-base md:text-xl text-amber-200/90 font-light leading-relaxed">
                {BOOK_CONFIG.subtitle}
              </p>

              <div className="pt-2 flex flex-wrap gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {toBengaliNumber(CHAPTERS_DATA.length)} টি পূর্ণাঙ্গ অধ্যায়
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" /> ৪টি পৃথক বাচন ব্যক্তিত্ব
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ১০০% অফলাইন সাপোর্ট
                </span>
              </div>
            </div>
          </div>

          {/* Three Mirrors Concept Breakdown */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>রাষ্ট্রকে দেখা তিন চোখে</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-normal">
                তিন দৃষ্টিভঙ্গির রূপরেখা
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mirror 1: Citizen */}
              <div className="p-4 rounded-2xl border border-amber-300/50 dark:border-amber-900/50 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                    ১
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    ১০টি অধ্যায়
                  </span>
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  আয়না ১: নাগরিকের চোখ
                </h3>
                <p className={`text-xs ${colors.textSecondary} leading-relaxed`}>
                  ভোরের টিসিবি লাইনের ক্লান্তি, ভোটাধিকারের আতঙ্ক, মধ্যবিত্তের বাজারের ফর্দ ও কৃষকের দেনা—সাধারণ নাগরিকের দীর্ঘশ্বাস ও বঞ্চনা।
                </p>
              </div>

              {/* Mirror 2: Field Officer */}
              <div className="p-4 rounded-2xl border border-cyan-300/50 dark:border-cyan-900/50 bg-cyan-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold flex items-center justify-center text-xs">
                    ২
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-400">
                    ৭টি অধ্যায় + সেতু
                  </span>
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  আয়না ২: কর্মকর্তার চোখ
                </h3>
                <p className={`text-xs ${colors.textSecondary} leading-relaxed`}>
                  ফাইলের গভীরে চাপা পড়া দেশ, ওপরের অযৌক্তিক নির্দেশ বনাম মাঠের কঠোর বাস্তবতা এবং নিরপেক্ষভাবে দায়িত্ব পালনের নীরব যন্ত্রণা।
                </p>
              </div>

              {/* Mirror 3: Politician */}
              <div className="p-4 rounded-2xl border border-rose-300/50 dark:border-rose-900/50 bg-rose-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-xs">
                    ৩
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                    ৮টি অধ্যায় + সেতু
                  </span>
                </div>
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  আয়না ৩: রাজনীতিবিদের চোখ
                </h3>
                <p className={`text-xs ${colors.textSecondary} leading-relaxed`}>
                  ক্ষমতার লোভ, পতনের ভয়, ইতিহাসের নির্মম শিক্ষা এবং বিবেক ও দলীয় স্বার্থের সংঘাত পেরিয়ে রাষ্ট্র সংস্কারের জরুরি আকুলতা।
                </p>
              </div>
            </div>
          </div>

          {/* Book Introspection Note */}
          <div className={`p-4 rounded-2xl border ${colors.border} bg-black/5 dark:bg-white/5 space-y-2`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>প্রতিটি অধ্যায়ের অন্তর-জিজ্ঞাসা</span>
            </div>
            <p className={`text-xs ${colors.textSecondary} leading-relaxed`}>
              এই ই-বুকে প্রতিটি অধ্যায় শেষ হয় একটি মননশীল প্রশ্ন দিয়ে। আপনি পাঠক হিসেবে আপনার নিজস্ব মতামত ও প্রতিক্রিয়া সরাসরি প্রতিটি অধ্যায়ের নোটবক্সে সংরক্ষণ করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 md:p-6 border-t ${colors.border} bg-black/5 dark:bg-white/5 flex flex-wrap items-center justify-between gap-3`}>
          <button
            onClick={() => {
              onOpenPrint();
              onClose();
            }}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border ${colors.border} hover:bg-black/5 dark:hover:bg-white/10 transition`}
          >
            <Printer className="w-4 h-4 text-stone-500" />
            <span>প্রিন্ট / সম্পূর্ণ PDF ভিউ</span>
          </button>

          <div className="flex items-center gap-3">
            {lastReadIndex > 0 && (
              <button
                onClick={() => {
                  onStartReading(lastReadIndex);
                  onClose();
                }}
                className={`text-xs px-4 py-2.5 rounded-xl border border-amber-600/40 text-amber-600 hover:bg-amber-500/10 font-semibold transition`}
              >
                অধ্যায় {toBengaliNumber(lastReadIndex + 1)} থেকে চালু করুন
              </button>
            )}

            <button
              onClick={() => {
                onStartReading(0);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md transition"
            >
              <span>পড়া শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
