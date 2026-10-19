import { useState, useEffect, useRef, useCallback } from 'react';
import { Chapter } from '../bookData';
import { PERSONA_CONFIGS } from '../types';

export function useSpeechAudio(
  onChapterFinished?: () => void,
  userPlaybackRate: number = 1.0
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(true);
  const currentChapterRef = useRef<Chapter | null>(null);

  currentChapterRef.current = currentChapter;

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasVoiceSupport(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
        // Find preferred Bengali voice
        const bengaliVoice = availableVoices.find(
          (v) => v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben')
        );
        setSelectedVoice(bengaliVoice || null);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const pauseAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, []);

  const playChapter = useCallback(
    (chapter: Chapter) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();
      setCurrentChapter(chapter);

      const persona = PERSONA_CONFIGS[chapter.role] || PERSONA_CONFIGS.narrator;
      const speechText = `${chapter.part}। অধ্যায়: ${chapter.title}। "${chapter.hook}"। ${chapter.content}। অধ্যায়ের অন্তর-জিজ্ঞাসা: ${chapter.question}`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'bn-BD';

      // Persona voice tuning
      utterance.pitch = persona.pitch;
      utterance.rate = persona.rate * userPlaybackRate;

      // Select voice if available
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        const bnVoice = window.speechSynthesis
          .getVoices()
          .find((v) => v.lang.toLowerCase().includes('bn') || v.lang.toLowerCase().includes('ben'));
        if (bnVoice) {
          utterance.voice = bnVoice;
        }
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (onChapterFinished) {
          onChapterFinished();
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    },
    [selectedVoice, userPlaybackRate, onChapterFinished]
  );

  return {
    isPlaying,
    isPaused,
    hasVoiceSupport,
    currentChapter,
    voices,
    selectedVoice,
    setSelectedVoice,
    playChapter,
    pauseAudio,
    resumeAudio,
    stopAudio,
  };
}
