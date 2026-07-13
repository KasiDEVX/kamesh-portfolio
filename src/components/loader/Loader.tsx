import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import heroFallback from '@/assets/hero_fallback.jpg';
import heroVideo from '@/assets/hero.webm';
import { useAudio } from '@/context/AudioContext';
import { useIsLowEnd, usePrefersReducedMotion } from '@/hooks/use-device-capability';

const WORD = 'KAMESH';
const LETTER_STAGGER = 0.085;
const LETTER_DURATION = 0.7;
const BAR_EASE: [number, number, number, number] = [0.32, 0, 0.68, 1];
const CINEMATIC_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MASK_REVEAL_DELAY = 1560;
const PROGRESS_HOLD_DELAY = 2000;
const EXPAND_DELAY = 4480;
const COMPLETE_DELAY = 5360;

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(16px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -26,
    filter: 'blur(12px)',
  },
};

interface LoaderProps {
  onExitComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onExitComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'letters' | 'mask' | 'expand'>('idle');
  const [assetReady, setAssetReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEnd = useIsLowEnd();
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const { isMuted, toggleSound } = useAudio();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isLowEnd) {
      const timer = window.setTimeout(() => {
        onExitComplete();
      }, 120);

      return () => window.clearTimeout(timer);
    }

    const video = preloadVideoRef.current;
    if (!video) return;

    const handleReady = () => {
      setAssetReady(true);
      video.play().catch(() => {});
    };

    const handleError = () => {
      setAssetReady(true);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleReady();
    }

    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('error', handleError);
    };
  }, [onExitComplete, prefersReducedMotion, isLowEnd]);

  useEffect(() => {
    if (prefersReducedMotion || !assetReady) return;

    setPhase('letters');
    setProgress(0.8);

    const maskTimer = window.setTimeout(() => {
      setPhase('mask');
    }, MASK_REVEAL_DELAY + PROGRESS_HOLD_DELAY);

    const finishProgressTimer = window.setTimeout(() => {
      setProgress(1);
    }, MASK_REVEAL_DELAY + PROGRESS_HOLD_DELAY);

    const expandTimer = window.setTimeout(() => {
      setPhase('expand');
    }, EXPAND_DELAY);

    const completeTimer = window.setTimeout(() => {
      onExitComplete();
    }, COMPLETE_DELAY);

    return () => {
      window.clearTimeout(maskTimer);
      window.clearTimeout(finishProgressTimer);
      window.clearTimeout(expandTimer);
      window.clearTimeout(completeTimer);
    };
  }, [assetReady, onExitComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[60] overflow-hidden bg-[#081510]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'expand' ? 0 : 1 }}
      transition={{ duration: 0.62, ease: CINEMATIC_EASE, delay: phase === 'expand' ? 0.42 : 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-[#081510]"
        animate={{ opacity: phase === 'expand' ? 0 : 1 }}
        transition={{ duration: 0.9, ease: CINEMATIC_EASE }}
      />

      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{
          opacity: phase === 'expand' ? 1 : 0,
          scale: phase === 'expand' ? 1 : 1.12,
        }}
        transition={{ duration: 1.05, ease: CINEMATIC_EASE }}
      >
        <div className="absolute inset-0 bg-[#081510]" />
        <img
          src={heroFallback}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-72"
        />
        <video
          autoPlay
          muted
          playsInline
          preload={isLowEnd ? 'metadata' : 'auto'}
          className="absolute inset-0 h-full w-full object-cover opacity-72"
        >
          <source src={heroVideo} type="video/webm" />
        </video>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,21,16,0.24)_0%,rgba(8,21,16,0.1)_34%,rgba(8,21,16,0)_58%,rgba(8,21,16,0)_100%)]"
          animate={{
            opacity: phase === 'expand' ? 0.08 : 0,
            scale: phase === 'expand' ? 1 : 0.84,
          }}
          transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,21,16,0.04)_0%,rgba(8,21,16,0.32)_42%,rgba(8,21,16,0.96)_100%)]"
        animate={{ opacity: phase === 'expand' ? 0 : 1 }}
        transition={{ duration: 0.86, ease: CINEMATIC_EASE }}
      />



      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {phase !== 'expand' && (
            <motion.div
              key="title-shell"
              className="flex w-full max-w-[min(92vw,1320px)] flex-col items-center justify-center gap-8"
              exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
              transition={{ duration: 0.48, ease: CINEMATIC_EASE }}
            >
              <motion.div
                className="relative inline-flex overflow-visible whitespace-nowrap"
                animate={{
                  scale: phase === 'mask' ? 1.12 : 1,
                  y: phase === 'mask' ? -8 : 0,
                }}
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
              >
                <motion.div
                  className="font-display text-[clamp(120px,16vw,320px)] leading-[0.84] tracking-[-0.08em] text-[#f5f0de] [text-wrap:nowrap]"
                  style={{ overflowWrap: 'anywhere', minWidth: 0 }}
                  animate={{
                    opacity: phase === 'mask' ? 0.14 : 1,
                    filter: phase === 'mask' ? 'blur(3px)' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
                >
                  {WORD.split('').map((letter, index) => (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="inline-block"
                      variants={letterVariants}
                      initial="hidden"
                      animate={phase === 'letters' || phase === 'mask' ? 'visible' : 'exit'}
                      transition={{
                        duration: LETTER_DURATION,
                        delay: index * LETTER_STAGGER,
                        ease: CINEMATIC_EASE,
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>

                <AnimatePresence>
                  {phase === 'mask' && (
                    <motion.div
                      key="image-mask"
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 0.985 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      transition={{ duration: 0.6, ease: CINEMATIC_EASE }}
                    >
                      <div
                        className="font-display text-[clamp(120px,16vw,320px)] leading-[0.84] tracking-[-0.08em] text-transparent [text-wrap:nowrap]"
                        style={{
                          overflowWrap: 'anywhere',
                          minWidth: 0,
                          backgroundImage: `linear-gradient(rgba(8, 21, 16, 0.1), rgba(8, 21, 16, 0.1)), url(${heroFallback})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                        }}
                      >
                        {WORD}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="flex w-full max-w-[440px] flex-col items-center gap-3">
                <div className="h-[2px] w-full overflow-hidden rounded-full bg-[#f5f0de]/10">
                  <motion.div
                    className="h-full w-full origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress }}
                    transition={{
                      duration: progress >= 1 ? 0.58 : 2.2,
                      ease: progress >= 1 ? BAR_EASE : 'linear',
                    }}
                  />
                </div>
                <motion.span
                  className="font-body text-[10px] uppercase tracking-[0.32em] text-[#f5f0de]/34"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === 'idle' ? 0 : 1 }}
                  transition={{ duration: 0.45, ease: CINEMATIC_EASE, delay: 0.2 }}
                >
                  {progress < 1 ? 'Calibrating frame' : 'Opening frame'}
                </motion.span>
              </div>

              {/* Catchy & Interactive Sound Switch */}
              <motion.div 
                className="mt-6 flex flex-col items-center gap-3 pointer-events-auto"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: phase === 'idle' ? 0 : 1, y: 0 }}
                transition={{ duration: 0.5, ease: CINEMATIC_EASE, delay: 0.3 }}
              >
                <span className="font-body text-[9px] uppercase tracking-[0.25em] text-[#f5f0de]/40">
                  Ambient Soundtrack
                </span>
                <div className="relative flex items-center p-1 bg-[#0b1612]/60 backdrop-blur-md border border-[#f5f0de]/12 rounded-full w-[240px] h-[46px]">
                  {/* Sliding background highlight */}
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-accent/20 border border-accent/35 shadow-lg shadow-accent/5"
                    initial={false}
                    animate={{
                      left: isMuted ? '4px' : '118px',
                      right: isMuted ? '118px' : '4px',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                  
                  {/* Toggle Buttons */}
                  <button
                    type="button"
                    onClick={() => { if (!isMuted) toggleSound(); }}
                    className={`cursor-target relative z-10 flex-1 h-full flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider transition-colors duration-300 focus:outline-none ${
                      isMuted ? 'text-accent' : 'text-[#f5f0de]/40 hover:text-[#f5f0de]/70'
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
                    </svg>
                    <span>Muted</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => { if (isMuted) toggleSound(); }}
                    className={`cursor-target relative z-10 flex-1 h-full flex items-center justify-center gap-2 font-body text-xs font-semibold uppercase tracking-wider transition-colors duration-300 focus:outline-none ${
                      !isMuted ? 'text-accent' : 'text-[#f5f0de]/40 hover:text-[#f5f0de]/70'
                    }`}
                  >
                    <div className="flex items-end gap-[2px] h-3 w-3.5">
                      <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-[3px]' : 'h-3 animate-sound-bar-1'}`} />
                      <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-[3px]' : 'h-1.5 animate-sound-bar-2'}`} />
                      <span className={`w-[1.5px] bg-current rounded-full transition-all duration-300 ${isMuted ? 'h-[3px]' : 'h-2.5 animate-sound-bar-3'}`} />
                    </div>
                    <span>Sound On</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <video
        ref={preloadVideoRef}
        autoPlay
        muted
        playsInline
        preload={isLowEnd ? 'metadata' : 'auto'}
        className="absolute h-0 w-0 opacity-0"
      >
        <source src={heroVideo} type="video/webm" />
      </video>
    </motion.div>
  );
};

export default Loader;
