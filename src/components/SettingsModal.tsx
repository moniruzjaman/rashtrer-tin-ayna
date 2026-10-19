import React from 'react';
import { ReaderSettings, ReaderTheme, BengaliFontFamily, toBengaliNumber } from '../types';
import { THEME_CLASSES } from '../utils/themeStyles';
import { X, Type, Sun, Moon, Sparkles, Sliders, Volume2, AlignJustify, AlignLeft, Columns } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const colors = THEME_CLASSES[settings.theme];

  if (!isOpen) return null;

  const themes: { id: ReaderTheme; label: string; icon: string; bg: string; text: string; border: string }[] = [
    { id: 'light', label: 'ধবল (Light)', icon: '☀️', bg: 'bg-white', text: 'text-stone-900', border: 'border-stone-300' },
    { id: 'sepia', label: 'সেপিয়া (Sepia)', icon: '📜', bg: 'bg-[#eee4cf]', text: 'text-[#3c2f1f]', border: 'border-[#dfd0b5]' },
    { id: 'dark', label: 'নিশীথ (Dark)', icon: '🌙', bg: 'bg-[#181615]', text: 'text-[#eee9e2]', border: 'border-[#2d2926]' },
    { id: 'forest', label: 'অরণ্য (Forest)', icon: '🌲', bg: 'bg-[#14221c]', text: 'text-[#e2ece6]', border: 'border-[#22392f]' },
  ];

  const fonts: { id: BengaliFontFamily; name: string; preview: string }[] = [
    { id: 'siliguri', name: 'হিন্দ শিলিগুড়ি', preview: 'আধুনিক ও স্পষ্ট লিপি' },
    { id: 'serif', name: 'নটো সেরিফ বাংলা', preview: 'মুদ্রিত বইয়ের ক্লাসিক সৌন্দর্য' },
    { id: 'tiro', name: 'তিরো বাংলা', preview: 'ঐতিহ্যবাহী সাহিত্যিক রূপ' },
  ];

  const speeds = [0.75, 1.0, 1.25, 1.5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-md ${colors.cardBg} ${colors.textPrimary} rounded-2xl shadow-2xl border ${colors.border} flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-base">রিডার ও অডিও সেটিংস</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${colors.textMuted} transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 max-h-[80vh]">
          {/* Theme Selector */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${colors.textMuted}`}>
              পৃষ্ঠার রঙ ও আবহ (থিম)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition text-left ${t.bg} ${t.text} ${
                    settings.theme === t.id
                      ? 'ring-2 ring-amber-500 font-bold shadow-md'
                      : 'hover:opacity-90 opacity-80'
                  } ${t.border}`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${colors.textMuted}`}>
              বাংলা ফন্ট ও টাইপোগ্রাফি
            </label>
            <div className="space-y-2">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id })}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    settings.fontFamily === f.id
                      ? 'border-amber-500 bg-amber-500/10 font-bold'
                      : `${colors.border} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  <div>
                    <div className="text-sm">{f.name}</div>
                    <div className={`text-xs ${colors.textMuted} mt-0.5`}>{f.preview}</div>
                  </div>
                  {settings.fontFamily === f.id && (
                    <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-sans">
                      সক্রিয়
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size & Line Height */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-xs font-semibold uppercase tracking-wider ${colors.textMuted}`}>
                অক্ষরের আকার
              </label>
              <span className="text-xs font-mono font-semibold text-amber-600">
                {toBengaliNumber(settings.fontSize)}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
                className={`p-2 rounded-lg border ${colors.border} hover:bg-black/5 dark:hover:bg-white/5 text-sm font-bold`}
              >
                A-
              </button>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <button
                onClick={() => onUpdateSettings({ fontSize: Math.min(26, settings.fontSize + 1) })}
                className={`p-2 rounded-lg border ${colors.border} hover:bg-black/5 dark:hover:bg-white/5 text-base font-bold`}
              >
                A+
              </button>
            </div>
          </div>

          {/* Line Height & Alignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${colors.textMuted}`}>
                লাইনের ব্যবধান
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[1.6, 1.8, 2.2].map((lh) => (
                  <button
                    key={lh}
                    onClick={() => onUpdateSettings({ lineHeight: lh })}
                    className={`py-1.5 px-2 rounded-lg border text-xs text-center transition ${
                      settings.lineHeight === lh
                        ? 'border-amber-500 bg-amber-500/15 font-bold text-amber-600'
                        : `${colors.border} hover:bg-black/5 dark:hover:bg-white/5`
                    }`}
                  >
                    {lh === 1.6 ? 'স্বল্প' : lh === 1.8 ? 'স্বাভাবিক' : 'উদার'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${colors.textMuted}`}>
                টেক্সট প্রান্ত
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onUpdateSettings({ textAlignment: 'justify' })}
                  className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition ${
                    settings.textAlignment === 'justify'
                      ? 'border-amber-500 bg-amber-500/15 font-bold text-amber-600'
                      : `${colors.border} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                  <span>জাস্টিফাই</span>
                </button>
                <button
                  onClick={() => onUpdateSettings({ textAlignment: 'left' })}
                  className={`py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1 transition ${
                    settings.textAlignment === 'left'
                      ? 'border-amber-500 bg-amber-500/15 font-bold text-amber-600'
                      : `${colors.border} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>বামে</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Dual Page Column */}
          <div className="pt-2 border-t border-stone-200/40 dark:border-stone-800/40 hidden md:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-stone-500" />
                <span className="text-xs font-medium">কম্পিউটার স্ক্রিনে বইয়ের মতো দ্বি-কলাম ভিউ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.twoColumnDesktop}
                onChange={(e) => onUpdateSettings({ twoColumnDesktop: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Audiobook Settings */}
          <div className="pt-2 border-t border-stone-200/40 dark:border-stone-800/40 space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <label className={`text-xs font-semibold uppercase tracking-wider ${colors.textMuted}`}>
                অডিওবুক বাচন গতি
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {speeds.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateSettings({ audioPlaybackRate: s })}
                  className={`py-1.5 px-2 rounded-lg border text-xs text-center transition font-mono ${
                    settings.audioPlaybackRate === s
                      ? 'border-amber-500 bg-amber-500/15 font-bold text-amber-600'
                      : `${colors.border} hover:bg-black/5 dark:hover:bg-white/5`
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium">অধ্যায় শেষ হলে পরবর্তী অধ্যায় স্বয়ংক্রিয় পাঠ</span>
              <input
                type="checkbox"
                checked={settings.autoPlayNextAudio}
                onChange={(e) => onUpdateSettings({ autoPlayNextAudio: e.target.checked })}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${colors.border} bg-black/5 dark:bg-white/5 flex items-center justify-between`}>
          <button
            onClick={onResetSettings}
            className={`text-xs ${colors.textMuted} hover:text-stone-900 dark:hover:text-white transition`}
          >
            ডিফল্ট সেটিংস রিসেট
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
          >
            প্রয়োগ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
