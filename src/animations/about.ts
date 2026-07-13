import { gsap } from 'gsap';

export const initAboutScrollAnimation = (container: HTMLElement) => {
  const ctx = gsap.context(() => {
    // Scene 01: Philosophy Reveal
    const s1Text = container.querySelector('.s1-text');
    const s1Subtext = container.querySelector('.s1-subtext');
    if (s1Text) {
      gsap.fromTo(
        [s1Text, s1Subtext],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.scene-philosophy',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Scene 02: Who I Am
    const s2Visual = container.querySelector('.s2-visual');
    const s2Texts = container.querySelectorAll('.s2-text');
    if (s2Visual) {
      gsap.fromTo(
        s2Visual,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.scene-who-i-am',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
    if (s2Texts.length > 0) {
      gsap.fromTo(
        s2Texts,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.scene-who-i-am',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Scene 03: Academic Studies
    const progressLine = container.querySelector('.timeline-progress-line');
    if (progressLine) {
      gsap.fromTo(progressLine,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: true,
          },
        }
      );
    }

    const studies = container.querySelectorAll('.study-item');
    studies.forEach((item) => {
      const num = item.querySelector('.study-num');
      const title = item.querySelector('.study-title');
      const desc = item.querySelector('.study-desc');
      const dot = item.querySelector('.timeline-dot');
      
      gsap.fromTo(
        [num, title, desc].filter(Boolean),
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (dot) {
        gsap.fromTo(dot,
          { borderColor: 'rgba(245, 240, 222, 0.3)', backgroundColor: '#19372D', scale: 1 },
          {
            borderColor: '#D4BE72',
            backgroundColor: '#D4BE72',
            scale: 1.25,
            duration: 0.4,
            scrollTrigger: {
              trigger: item,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    });

    const closing = container.querySelector('.s3-closing');
    const skillsLink = container.querySelector('.s3-link');
    if (closing || skillsLink) {
      gsap.fromTo(
        [closing, skillsLink].filter(Boolean),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.16,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: closing || skillsLink,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    gsap.to('.scene-studies', {
      opacity: 0.92,
      ease: 'none',
      scrollTrigger: {
        trigger: '.scene-studies',
        start: 'bottom 85%',
        end: 'bottom 45%',
        scrub: 0.6,
      },
    });
  }, container);

  return {
    kill: () => ctx.revert(),
  };
};
