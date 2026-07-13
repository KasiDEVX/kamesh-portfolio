import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import ambientSoundtrack from '@/assets/music.mp3';
import { useIsLowEnd } from '@/hooks/use-device-capability';

interface AudioContextType {
  isMuted: boolean;
  toggleSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ambient-sound-pref') !== 'on';
    }
    return true;
  });

  const isLowEnd = useIsLowEnd();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioState = useRef({ targetVolume: 0 });
  const volumeTweenRef = useRef<gsap.core.Tween | null>(null);
  const audioInitialized = useRef(false);

  // Initialize audio element lazily - on first user interaction or if not low-end
  const initializeAudio = useCallback(() => {
    if (audioInitialized.current) return;
    
    const audio = new Audio(ambientSoundtrack);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    audioInitialized.current = true;

    return () => {
      audio.pause();
      audioRef.current = null;
      volumeTweenRef.current?.kill();
    };
  }, []);

  // Initialize immediately on high-end, defer on low-end
  useEffect(() => {
    if (!isLowEnd) {
      initializeAudio();
    }
  }, [isLowEnd, initializeAudio]);

  // Handle play/mute transitions with GSAP volume fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Kill any existing volume tween
    volumeTweenRef.current?.kill();

    if (!isMuted) {
      audio.play().catch((err) => {
        console.warn("Ambient audio play blocked:", err);
        setIsMuted(true);
        localStorage.setItem('ambient-sound-pref', 'off');
      });

      volumeTweenRef.current = gsap.to(audioState.current, {
        targetVolume: 0.35,
        duration: 2,
        ease: 'power1.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          if (audioRef.current) {
            audioRef.current.volume = audioState.current.targetVolume;
          }
        }
      });
    } else {
      volumeTweenRef.current = gsap.to(audioState.current, {
        targetVolume: 0,
        duration: 1,
        ease: 'power1.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          if (audioRef.current) {
            audioRef.current.volume = audioState.current.targetVolume;
          }
        },
        onComplete: () => {
          if (audioRef.current && audioState.current.targetVolume === 0) {
            audioRef.current.pause();
          }
        }
      });
    }

    return () => {
      volumeTweenRef.current?.kill();
    };
  }, [isMuted]);

  const toggleSound = () => {
    // Initialize audio on first toggle if not already initialized (low-end)
    if (!audioInitialized.current) {
      initializeAudio();
    }
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('ambient-sound-pref', next ? 'off' : 'on');
      return next;
    });
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleSound }}>
      {children}
    </AudioContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
