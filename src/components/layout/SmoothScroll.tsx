import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion, useIsLowEnd } from '@/hooks/use-device-capability';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowEnd = useIsLowEnd();

  useEffect(() => {
    // Skip smooth scroll entirely on reduced motion or low-end devices
    if (prefersReducedMotion || isLowEnd) {
      // Still register ScrollTrigger for static triggers
      gsap.ticker.lagSmoothing(0);
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      const updatePhysics = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updatePhysics);
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.destroy();
        gsap.ticker.remove(updatePhysics);
      };
    });

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, isLowEnd]);

  return <>{children}</>;
};

export default SmoothScroll;