import { gsap } from 'gsap';

export const initHeroEntrance = (navElement: HTMLElement) => {
  gsap.fromTo(
    navElement,
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power3.out' }
  );
};

export const initHeroScrollAnimation = (
  heroContainer: HTMLElement,
  videoWrapper: HTMLElement,
  contentWrapper: HTMLElement
) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroContainer,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Scale down the video container and apply rounded corners
  tl.to(
    videoWrapper,
    {
      scale: 0.92,
      borderRadius: '32px',
      ease: 'none',
    },
    0
  );

  // Fade out the hero content (typography, buttons, social links)
  tl.to(
    contentWrapper,
    {
      opacity: 0,
      y: -60,
      ease: 'none',
    },
    0
  );

  return tl;
};
