import { useEffect, useState } from 'react';

interface DeviceCapability {
  isLowEnd: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  hardwareConcurrency: number;
  deviceMemory: number;
  connectionType: string;
}

const DEFAULT_CAPABILITY: DeviceCapability = {
  isLowEnd: false,
  isMobile: false,
  prefersReducedMotion: false,
  hardwareConcurrency: 4,
  deviceMemory: 4,
  connectionType: 'unknown',
};

export const useDeviceCapability = (): DeviceCapability => {
  const [capability, setCapability] = useState<DeviceCapability>(DEFAULT_CAPABILITY);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkCapability = () => {
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { effectiveType?: string; type?: string };
      };

      const hardwareConcurrency = nav.hardwareConcurrency || 4;
      const deviceMemory = nav.deviceMemory || 4;
      const connectionType = nav.connection?.effectiveType || nav.connection?.type || 'unknown';

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Low-end criteria:
      // - Mobile device with slow connection OR prefers reduced motion
      // - Desktop: only if prefers reduced motion (don't penalize for core/RAM reporting)
      const isLowEnd = 
        isMobile && (
          hardwareConcurrency <= 4 ||
          deviceMemory <= 4 ||
          connectionType === 'slow-2g' ||
          connectionType === '2g' ||
          connectionType === '3g'
        ) ||
        prefersReducedMotion;

      setCapability({
        isLowEnd,
        isMobile,
        prefersReducedMotion,
        hardwareConcurrency,
        deviceMemory,
        connectionType,
      });
    };

    checkCapability();

    // Listen for changes in prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => checkCapability();
    mediaQuery.addEventListener?.('change', handleChange);

    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  return capability;
};

export const useIsLowEnd = (): boolean => {
  const { isLowEnd } = useDeviceCapability();
  return isLowEnd;
};

export const usePrefersReducedMotion = (): boolean => {
  const { prefersReducedMotion } = useDeviceCapability();
  return prefersReducedMotion;
};