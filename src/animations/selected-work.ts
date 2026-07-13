import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface InitHorizontalScrollOptions {
  container: HTMLElement;
  panelsContainer: HTMLElement;
  panelsCount: number;
  onProgressChange?: (activeIndex: number) => void;
  enableHorizontal?: boolean;
}

export const initHorizontalScroll = ({
  container,
  panelsContainer,
  panelsCount,
  onProgressChange,
  enableHorizontal = true,
}: InitHorizontalScrollOptions) => {
  if (panelsCount <= 1) return null;

  const mm = gsap.matchMedia();

  // Horizontal scroll on desktop (only if enabled)
  if (enableHorizontal) {
    mm.add('(min-width: 1024px)', () => {
      const getTotalScroll = () => Math.max(panelsContainer.scrollWidth - window.innerWidth, window.innerWidth);

      const scrollTween = gsap.to(panelsContainer, {
        x: () => -getTotalScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getTotalScroll()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (onProgressChange) {
              const progress = self.progress;
              const index = Math.min(
                Math.floor(progress * panelsCount),
                panelsCount - 1
              );
              onProgressChange(index);
            }
          },
        },
      });

      // Staggered panel elements entry animation driven by horizontal scroll
      const panels = gsap.utils.toArray<HTMLElement>('.panel');
      panels.forEach((panel) => {
        const category = panel.querySelector('.panel-category');
        const title = panel.querySelector('.panel-title');
        const tech = panel.querySelector('.panel-tech');
        const desc = panel.querySelector('.panel-desc');
        const image = panel.querySelector('.panel-image');

        if (!title) return;

        gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 100%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(image, { scale: 0.97, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
        .fromTo(category, { opacity: 0, y: 12 }, { opacity: 0.6, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
        .fromTo(title, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
        .fromTo(tech, { opacity: 0, y: 12 }, { opacity: 0.5, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
        .fromTo(desc, { opacity: 0, y: 12 }, { opacity: 0.6, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25');
      });

      return () => {
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
      };
    });
  }

  // Mobile/Tablet: vertical scroll entry animations (always runs)
  mm.add('(max-width: 1023px)', () => {
    const panels = gsap.utils.toArray<HTMLElement>('.panel');
    panels.forEach((panel) => {
      const category = panel.querySelector('.panel-category');
      const title = panel.querySelector('.panel-title');
      const tech = panel.querySelector('.panel-tech');
      const desc = panel.querySelector('.panel-desc');
      const image = panel.querySelector('.panel-image');

      if (!title) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })
      .fromTo(image, { scale: 0.97, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
      .fromTo(category, { opacity: 0, y: 12 }, { opacity: 0.6, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
      .fromTo(title, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
      .fromTo(tech, { opacity: 0, y: 12 }, { opacity: 0.5, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25')
      .fromTo(desc, { opacity: 0, y: 12 }, { opacity: 0.6, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25');
    });

    return () => {};
  });

  return {
    kill: () => mm.revert(),
  };
};