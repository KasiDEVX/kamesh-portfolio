import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { initHeroScrollAnimation, initHeroEntrance } from '@/animations/hero';
import heroVideo from '@/assets/hero.webm';
import heroFallback from '@/assets/hero_fallback.jpg';
import { useDeviceCapability } from '@/hooks/use-device-capability';

export const OpeningScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { prefersReducedMotion } = useDeviceCapability();
  // Only skip video for prefers-reduced-motion, not for isLowEnd
  // Modern laptops (even with 4 cores / 4GB reported) can handle video
  const shouldSkipVideo = prefersReducedMotion;

  const [videoStatus, setVideoStatus] = useState<'playing' | 'fading' | 'ended'>('playing');
  const videoStatusRef = useRef(videoStatus);
  videoStatusRef.current = videoStatus;
  
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Preload fallback image
  useEffect(() => {
    if (videoStatus === 'playing') {
      const img = new Image();
      img.src = heroFallback;
    }
  }, [videoStatus]);


  // IntersectionObserver to track if hero is in viewport
  useEffect(() => {
    if (shouldSkipVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (!entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          setVideoStatus('playing');
          setIsVideoPlaying(false);
        } else {
          setVideoStatus('playing');
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldSkipVideo]);

  // Handle play/pause programmatically based on viewport intersection
  useEffect(() => {
    if (!videoRef.current || shouldSkipVideo) return;
    
    if (isIntersecting) {
      if (videoStatusRef.current === 'playing') {
        videoRef.current.play().catch(() => {});
      }
    } else {
      videoRef.current.pause();
    }
  }, [isIntersecting, shouldSkipVideo]);

  useGSAP(() => {
    if (!containerRef.current || !videoWrapperRef.current || !contentWrapperRef.current) return;

    const scrollTl = initHeroScrollAnimation(
      containerRef.current,
      videoWrapperRef.current,
      contentWrapperRef.current
    );

    const navbar = document.querySelector('nav');
    if (navbar) {
      initHeroEntrance(navbar);
    }

    return () => {
      scrollTl.kill();
    };
  }, { scope: containerRef });


  return (
    <div
      ref={containerRef}
      className="relative w-full h-[120vh] bg-transparent overflow-visible"
      id="opening-scene"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Fullscreen Video Background Wrapper */}
        <div
          ref={videoWrapperRef}
          className="absolute inset-0 w-full h-full object-cover z-0 origin-center bg-[#1A2B22] overflow-hidden"
          style={{ willChange: 'transform, border-radius' }}
        >
          {/* Static Fallback Image - Always rendered if video ended, fading, loading, or if motion preferences skip video */}
          {(shouldSkipVideo || !isVideoPlaying || videoStatus === 'ended' || videoStatus === 'fading') && (
            <img
              src={heroFallback}
              alt="Hero static background"
              className="absolute inset-0 w-full h-full object-cover opacity-65"
              style={{ contentVisibility: 'auto' }}
            />
          )}

          {/* Video - Rendered only when active, fades out smoothly */}
          {!shouldSkipVideo && videoStatus !== 'ended' && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlay={() => setIsVideoPlaying(true)}
              onEnded={() => {
                setVideoStatus('fading');
              }}
              onTransitionEnd={(e) => {
                if (e.propertyName === 'opacity') {
                  setVideoStatus('ended');
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                videoStatus === 'fading' ? 'opacity-0' : 'opacity-65'
              }`}
            >
              <source
                src={heroVideo}
                type="video/webm"
              />
            </video>
          )}
        </div>

        {/* Content Wrapper */}
        <div
          ref={contentWrapperRef}
          className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col items-center text-center justify-center"
        >

          {/* Headline - Editorial Typography */}
          <h1 className="font-display font-normal text-[clamp(2.6rem,10vw,96px)] leading-[0.95] tracking-[-1px] sm:tracking-[-2px] text-neutral max-w-7xl animate-fade-rise">
            Building software <br />
            with <span className="text-accent">purpose</span> <br />
            and <span className="text-accent">craftsmanship.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="font-body font-normal text-sm sm:text-base md:text-[17px] text-neutral/60 leading-relaxed max-w-2xl mt-8 animate-fade-rise-delay">
            Full Stack Developer focused on building thoughtful digital experiences through clean engineering, purposeful design, and continuous learning.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 animate-fade-rise-delay-2">
            <a
              href="#editorial-gallery"
              className="cursor-target inline-block liquid-glass rounded-full px-14 py-5 text-sm font-medium text-neutral hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              View Selected Work
            </a>
            <a
              href="#conversation"
              className="cursor-target inline-block rounded-full px-10 py-5 text-sm font-medium text-neutral border border-neutral/10 hover:border-neutral/30 hover:bg-neutral/5 transition-all duration-200"
            >
              Let's Connect
            </a>
          </div>


        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-neutral/20 text-[10px] uppercase tracking-[0.25em] animate-pulse flex flex-col items-center gap-1">
          <span>Scroll</span>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1V13M5 13L1 9M5 13L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>


      </div>
    </div>
  );
};

export default OpeningScene;