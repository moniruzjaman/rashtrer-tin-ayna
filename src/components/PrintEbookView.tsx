import React from 'react';
import { BOOK_CONFIG, CHAPTERS_DATA } from '../bookData';
import { toBengaliNumber } from '../types';
import { Printer, ArrowLeft, Download } from 'lucide-react';

interface Props {
  onBack: () => void;
  reflections: Record<string, string>;
}

export const PrintEbookView: React.FC<Props> = ({ onBack, reflections }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 font-serif-bengali p-6 md:p-12 print:p-0">
      {/* Top action toolbar (hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 font-siliguri shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold hover:bg-stone-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>রিডারে ফিরে যান</span>
        </button>

        <div className="text-xs text-amber-900">
          <span className="font-bold">প্রিন্ট / PDF ভিউ:</span> ব্রাউজারের প্রিন্ট ডায়ালগ থেকে 'Save as PDF' নির্বাচন করে পূর্ণাঙ্গ ই-বুকটি সংরক্ষণ করতে পারেন।
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট বা PDF সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Book Container for Printing */}
      <div className="max-w-3xl mx-auto space-y-16">
        {/* Cover Page */}
        <div className="print-page-break text-center py-24 md:py-32 border-b-2 border-stone-200 print:border-none flex flex-col justify-center min-h-[85vh]">
          <div className="text-amber-800 text-xs tracking-widest uppercase mb-4 font-siliguri font-semibold">
            {BOOK_CONFIG.edition}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-stone-950 mb-6 font-serif-bengali">
            {BOOK_CONFIG.title}
          </h1>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg md:text-2xl text-stone-700 font-light max-w-xl mx-auto mb-16 leading-relaxed">
            {BOOK_CONFIG.subtitle}
          </p>

          <div className="mt-auto text-xs text-stone-500 font-siliguri space-y-1">
            <p>প্রকাশনা ও সংকলন: {BOOK_CONFIG.year}</p>
            <p>ডিজিটাল ওপেন এক্সেস সংস্করণ</p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="print-page-break py-12 border-b border-stone-200 print:border-none">
          <h2 className="text-2xl font-bold mb-8 text-center text-stone-900 border-b pb-3">
            সূচিপত্র
          </h2>
          <div className="space-y-3 font-siliguri text-sm max-w-xl mx-auto">
            {CHAPTERS_DATA.map((ch, idx) => (
              <div key={ch.id} className="flex items-baseline justify-between gap-4 border-b border-dotted border-stone-300 pb-1">
                <span className="font-medium text-stone-900">
                  <span className="font-bold text-amber-700 mr-2">{toBengaliNumber(idx + 1)}.</span>
                  {ch.title}
                </span>
                <span className="text-xs text-stone-500 shrink-0">{ch.character}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        {CHAPTERS_DATA.map((ch, idx) => (
          <article
            key={ch.id}
            className="print-page-break py-10 space-y-6 border-b border-stone-100 print:border-none"
          >
            <div className="text-xs font-siliguri text-stone-500 flex items-center justify-between border-b pb-2">
              <span>অধ্যায় {toBengaliNumber(idx + 1)} • {ch.part}</span>
              <span className="font-semibold text-amber-800">দৃষ্টিভঙ্গি: {ch.character}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-serif-bengali">
              {ch.title}
            </h2>

            <blockquote className="border-l-4 border-amber-600 pl-4 py-2 italic text-stone-700 text-base bg-amber-50/50">
              "{ch.hook}"
            </blockquote>

            <p className="text-base text-stone-800 leading-8 text-justify font-serif-bengali">
              {ch.content}
            </p>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 font-siliguri text-xs space-y-1">
              <span className="font-bold text-amber-900">অধ্যায় সমাপ্তির অন্তর-জিজ্ঞাসা: </span>
              <span className="italic text-stone-700">{ch.question}</span>
            </div>
          </article>
        ))}

        {/* User Saved Reflections Appendix if any */}
        {Object.keys(reflections).length > 0 && (
          <div className="print-page-break py-12 space-y-6">
            <h2 className="text-2xl font-bold text-stone-900 border-b pb-3 font-serif-bengali">
              পাঠকের নিজস্ব অন্তর-ভাবনা ডায়রি
            </h2>
            <div className="space-y-6 font-siliguri text-xs">
              {Object.entries(reflections).map(([chId, note]) => {
                const ch = CHAPTERS_DATA.find((c) => c.id.toString() === chId.toString());
                if (!ch || !note.trim()) return null;
                return (
                  <div key={chId} className="p-4 rounded border border-stone-300 space-y-2">
                    <h4 className="font-bold text-stone-900 text-sm">
                      {ch.title} ({ch.part})
                    </h4>
                    <p className="italic text-stone-600">প্রশ্ন: {ch.question}</p>
                    <p className="text-stone-900 whitespace-pre-wrap pl-3 border-l-2 border-stone-400">
                      {note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
