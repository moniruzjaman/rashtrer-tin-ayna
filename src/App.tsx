import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CHAPTERS_DATA, BOOK_CONFIG, Chapter } from './bookData';
import {
  ReaderSettings,
  ReaderTheme,
  BengaliFontFamily,
  ViewMode,
  toBengaliNumber,
} from './types';
import { THEME_CLASSES, FONT_CLASSES } from './utils/themeStyles';
import { useSpeechAudio } from './hooks/useSpeechAudio';

import { Navbar } from './components/Navbar';
import { ChapterView } from './components/ChapterView';
import { ContinuousScrollView } from './components/ContinuousScrollView';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { BookCoverModal } from './components/BookCoverModal';
import { NotesAndBookmarksModal } from './components/NotesAndBookmarksModal';
import { QuoteCardModal } from './components/QuoteCardModal';
import { PrintEbookView } from './components/PrintEbookView';
import { AudioPlayerBar } from './components/AudioPlayerBar';

const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'light',
  fontFamily: 'siliguri',
  fontSize: 18,
  lineHeight: 1.8,
  textAlignment: 'justify',
  twoColumnDesktop: false,
  autoPlayNextAudio: true,
  audioPlaybackRate: 1.0,
};

export default function App() {
  // Current reading index
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ayna_reading_index');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < CHAPTERS_DATA.length) {
          return parsed;
        }
      }
    } catch {}
    return 0;
  });

  // Reader Settings
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    try {
      const saved = localStorage.getItem('ayna_reader_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ayna_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Reflections / Personal Notes
  const [reflections, setReflections] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('ayna_reflections');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('page');

  // Modals state
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [quoteCardData, setQuoteCardData] = useState<{ chapter: Chapter; index: number } | null>(null);

  // Audio Hook
  const handleChapterAudioFinished = useCallback(() => {
    if (settings.autoPlayNextAudio && currentChapterIndex < CHAPTERS_DATA.length - 1) {
      const nextIdx = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIdx);
      localStorage.setItem('ayna_reading_index', nextIdx.toString());
      playChapter(CHAPTERS_DATA[nextIdx]);
    }
  }, [settings.autoPlayNextAudio, currentChapterIndex]);

  const {
    isPlaying: isAudioPlaying,
    isPaused: isAudioPaused,
    currentChapter: audioChapter,
    playChapter,
    pauseAudio,
    resumeAudio,
    stopAudio,
  } = useSpeechAudio(handleChapterAudioFinished, settings.audioPlaybackRate);

  // Save index to localStorage
  const handleSelectChapter = useCallback(
    (index: number) => {
      if (index >= 0 && index < CHAPTERS_DATA.length) {
        setCurrentChapterIndex(index);
        localStorage.setItem('ayna_reading_index', index.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // If audio was playing, update to new chapter
        if (isAudioPlaying) {
          playChapter(CHAPTERS_DATA[index]);
        }
      }
    },
    [isAudioPlaying, playChapter]
  );

  const handleNavigate = useCallback(
    (step: number) => {
      const target = currentChapterIndex + step;
      if (target >= 0 && target < CHAPTERS_DATA.length) {
        handleSelectChapter(target);
      }
    },
    [currentChapterIndex, handleSelectChapter]
  );

  // Toggle Audio for current chapter
  const handleToggleCurrentAudio = useCallback(() => {
    if (isAudioPlaying) {
      stopAudio();
    } else if (isAudioPaused) {
      resumeAudio();
    } else {
      playChapter(CHAPTERS_DATA[currentChapterIndex]);
    }
  }, [isAudioPlaying, isAudioPaused, stopAudio, resumeAudio, playChapter, currentChapterIndex]);

  // Audio play/pause in bar
  const handleAudioBarPlayPause = useCallback(() => {
    if (isAudioPlaying) {
      pauseAudio();
    } else if (isAudioPaused) {
      resumeAudio();
    } else {
      playChapter(CHAPTERS_DATA[currentChapterIndex]);
    }
  }, [isAudioPlaying, isAudioPaused, pauseAudio, resumeAudio, playChapter, currentChapterIndex]);

  // Toggle Bookmark
  const handleToggleBookmark = useCallback((index: number) => {
    setBookmarks((prev) => {
      const exists = prev.includes(index);
      const next = exists ? prev.filter((i) => i !== index) : [...prev, index];
      localStorage.setItem('ayna_bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  // Save Reflection
  const handleSaveReflection = useCallback((chapterId: number | string, note: string) => {
    setReflections((prev) => {
      const next = { ...prev, [chapterId.toString()]: note };
      localStorage.setItem('ayna_reflections', JSON.stringify(next));
      return next;
    });
  }, []);

  // Delete Reflection
  const handleDeleteReflection = useCallback((chapterId: string) => {
    setReflections((prev) => {
      const next = { ...prev };
      delete next[chapterId];
      localStorage.setItem('ayna_reflections', JSON.stringify(next));
      return next;
    });
  }, []);

  // Update Settings
  const handleUpdateSettings = useCallback((newPartial: Partial<ReaderSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      localStorage.setItem('ayna_reader_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Cycle Theme
  const handleCycleTheme = useCallback(() => {
    const themeCycle: ReaderTheme[] = ['light', 'sepia', 'dark', 'forest'];
    const currentPos = themeCycle.indexOf(settings.theme);
    const nextTheme = themeCycle[(currentPos + 1) % themeCycle.length];
    handleUpdateSettings({ theme: nextTheme });
  }, [settings.theme, handleUpdateSettings]);

  // Reset Settings
  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('ayna_reader_settings', JSON.stringify(DEFAULT_SETTINGS));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNavigate(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handleNavigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate]);

  const colors = THEME_CLASSES[settings.theme];
  const fontClass = FONT_CLASSES[settings.fontFamily];
  const currentChapter = CHAPTERS_DATA[currentChapterIndex] || CHAPTERS_DATA[0];
  const isCurrentBookmarked = bookmarks.includes(currentChapterIndex);
  const currentReflection = reflections[currentChapter.id.toString()] || '';

  // Progress percentage
  const readingProgress = Math.round(((currentChapterIndex + 1) / CHAPTERS_DATA.length) * 100);

  // If in Print Mode
  if (viewMode === 'print') {
    return (
      <PrintEbookView
        onBack={() => setViewMode('page')}
        reflections={reflections}
      />
    );
  }

  return (
    <div
      className={`min-h-screen ${colors.bg} ${colors.textPrimary} ${fontClass} selection:bg-amber-300 dark:selection:bg-amber-800 transition-colors duration-300 flex flex-col justify-between`}
    >
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/10 dark:bg-white/10 z-50">
        <div
          className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        currentChapterIndex={currentChapterIndex}
        totalChapters={CHAPTERS_DATA.length}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenTOC={() => setIsTOCOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenCover={() => setIsCoverOpen(true)}
        onOpenPrint={() => setViewMode('print')}
        theme={settings.theme}
        onCycleTheme={handleCycleTheme}
        bookmarkCount={bookmarks.length}
        reflectionCount={Object.keys(reflections).length}
      />

      {/* Reading Canvas Container */}
      <main className="flex-1 px-4 sm:px-6 py-6 md:py-10 max-w-5xl mx-auto w-full">
        {viewMode === 'page' ? (
          <ChapterView
            chapter={currentChapter}
            chapterIndex={currentChapterIndex}
            totalChapters={CHAPTERS_DATA.length}
            settings={settings}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleCurrentAudio}
            isBookmarked={isCurrentBookmarked}
            onToggleBookmark={() => handleToggleBookmark(currentChapterIndex)}
            onNavigate={handleNavigate}
            userReflection={currentReflection}
            onSaveReflection={(note) => handleSaveReflection(currentChapter.id, note)}
            onOpenQuoteCard={() =>
              setQuoteCardData({ chapter: currentChapter, index: currentChapterIndex })
            }
          />
        ) : (
          <ContinuousScrollView
            settings={settings}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            activeAudioIndex={isAudioPlaying ? currentChapterIndex : null}
            onPlayAudioForChapter={(idx) => {
              handleSelectChapter(idx);
              playChapter(CHAPTERS_DATA[idx]);
            }}
            onOpenQuoteCard={(idx) =>
              setQuoteCardData({ chapter: CHAPTERS_DATA[idx], index: idx })
            }
          />
        )}
      </main>

      {/* Floating Audio Bar if active or paused */}
      {(isAudioPlaying || isAudioPaused) && (
        <AudioPlayerBar
          chapter={audioChapter || currentChapter}
          chapterIndex={currentChapterIndex}
          totalChapters={CHAPTERS_DATA.length}
          isPlaying={isAudioPlaying}
          isPaused={isAudioPaused}
          onPlayPause={handleAudioBarPlayPause}
          onStop={stopAudio}
          onPrev={() => handleNavigate(-1)}
          onNext={() => handleNavigate(1)}
          theme={settings.theme}
          playbackRate={settings.audioPlaybackRate}
          onChangePlaybackRate={(rate) => handleUpdateSettings({ audioPlaybackRate: rate })}
        />
      )}

      {/* Footer */}
      <footer
        className={`border-t ${colors.border} py-6 px-4 text-center text-xs ${colors.textMuted} space-y-1.5`}
      >
        <p className="font-medium">
          © {BOOK_CONFIG.year} {BOOK_CONFIG.title} • {BOOK_CONFIG.edition}
        </p>
        <p className="text-[11px] opacity-75">
          নাগরিক, মাঠ কর্মকর্তা ও রাজনীতিবিদের তিন আয়নায় রাষ্ট্র দর্শনের সংকলন
        </p>
      </footer>

      {/* Modals */}
      <TableOfContentsModal
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        currentChapterIndex={currentChapterIndex}
        onSelectChapter={handleSelectChapter}
        bookmarks={bookmarks}
        reflections={reflections}
        theme={settings.theme}
        onOpenCover={() => setIsCoverOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectChapter={handleSelectChapter}
        theme={settings.theme}
      />

      <NotesAndBookmarksModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        bookmarks={bookmarks}
        onToggleBookmark={handleToggleBookmark}
        reflections={reflections}
        onDeleteReflection={handleDeleteReflection}
        onSelectChapter={handleSelectChapter}
        theme={settings.theme}
      />

      <BookCoverModal
        isOpen={isCoverOpen}
        onClose={() => setIsCoverOpen(false)}
        onStartReading={(idx) => handleSelectChapter(idx !== undefined ? idx : 0)}
        theme={settings.theme}
        lastReadIndex={currentChapterIndex}
        onOpenPrint={() => setViewMode('print')}
      />

      {quoteCardData && (
        <QuoteCardModal
          isOpen={true}
          onClose={() => setQuoteCardData(null)}
          chapter={quoteCardData.chapter}
          chapterIndex={quoteCardData.index}
          theme={settings.theme}
        />
      )}
    </div>
  );
}
