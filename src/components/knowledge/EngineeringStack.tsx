import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import facultyImage from '@/assets/images/faculty_ai_dashboard.webp';
import hostelImage from '@/assets/images/hostel.webp';
import portfolioImage from '@/assets/images/portfolio.webp';

interface StackItem {
  title: string;
  marquee: string[];
  image: string;
  description: string;
  technologies: string[];
  philosophy: string;
}

const stackItems: StackItem[] = [
  {
    title: 'Frontend Engineering',
    marquee: ['React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Next.js'],
    image: portfolioImage,
    description:
      'Interfaces are treated as reading experiences first. Layout, motion, and state are shaped together so the surface feels precise, quiet, and easy to trust. Every interaction is choreographed to reduce cognitive load and reward curiosity.',
    technologies: ['React', 'TypeScript', 'GSAP', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Next.js'],
    philosophy:
      'Clarity matters more than ornament. Frontend work should absorb complexity on behalf of the user and leave behind an interaction that feels inevitable.',
  },
  {
    title: 'Backend Engineering',
    marquee: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL', 'System Design', 'Docker'],
    image: facultyImage,
    description:
      'The backend layer is where structure earns its keep. Schemas, APIs, and service boundaries are designed to stay readable under pressure and durable as products grow. Observability and failure modes are first-class concerns.',
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Docker', 'System Design'],
    philosophy:
      'Understand the data model before reaching for abstractions. A strong backend should feel boring in production: predictable, observable, and difficult to break by accident.',
  },
  {
    title: 'Development Toolkit',
    marquee: ['Git', 'Neovim', 'Linux', 'Docker', 'Figma', 'Performance Tuning', 'CI/CD'],
    image: hostelImage,
    description:
      'Tooling is part of the craft, not an afterthought. The stack around the codebase supports iteration speed, careful debugging, and a cleaner path from concept to stable delivery. Every tool earns its place.',
    technologies: ['Git', 'Neovim', 'Linux', 'Docker', 'Figma', 'Vercel', 'Performance Tuning'],
    philosophy:
      'A good toolkit reduces noise. The point is not to collect tools, but to build a working environment where decisions are easier to test, refine, and ship with confidence.',
  },
  {
    title: 'Currently Exploring',
    marquee: ['Machine Learning', 'Flutter', 'Reverse Engineering', 'Compilers', 'Systems Thinking', 'Rust'],
    image: portfolioImage,
    description:
      'Exploration stays close to fundamentals. Current study moves between machine learning workflows, mobile architecture, and lower-level systems to deepen how software behaves beneath the surface.',
    technologies: ['Machine Learning', 'Flutter', 'Reverse Engineering', 'Compilers', 'Systems Design', 'Rust'],
    philosophy:
      'Learning is most useful when it sharpens judgment. New domains matter because they reveal better questions, better tradeoffs, and better ways to simplify complex systems.',
  },
];

interface StackRowProps extends StackItem {
  isActive: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

const StackRow: React.FC<StackRowProps> = ({
  title,
  description,
  technologies,
  philosophy,
  image,
  isActive,
  onToggle,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const detailInnerRef = useRef<HTMLDivElement>(null);
  
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  useLayoutEffect(() => {
    if (!detailInnerRef.current) return;

    gsap.killTweensOf(detailInnerRef.current);

    if (isActive) {
      gsap.fromTo(
        detailInnerRef.current,
        { yPercent: -12, scaleY: 0.92, opacity: 0, transformOrigin: 'top center' },
        { yPercent: 0, scaleY: 1, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    } else {
      gsap.to(detailInnerRef.current, {
        yPercent: -8,
        scaleY: 0.96,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        transformOrigin: 'top center',
      });
    }
  }, [isActive]);

  // Calculate repetitions for marquee
  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [technologies]);

  // Set up GSAP horizontal loop animation for marquee
  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee-part') as HTMLElement | null;
      if (!marqueeContent) return;
      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: 15,
        ease: 'none',
        repeat: -1,
      });
    };

    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [technologies, repetitions]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const edge = ev.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom';

    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (!rowRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = ev.currentTarget.getBoundingClientRect();
    const edge = ev.clientY - rect.top < rect.height / 2 ? 'top' : 'bottom';

    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      ref={rowRef}
      className="relative overflow-hidden"
    >
      {/* Header Button & Marquee Container */}
      <div className="relative overflow-hidden w-full">
        <button
          type="button"
          onClick={onToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="group relative flex min-h-[84px] w-full items-center bg-transparent px-5 py-5 text-left sm:px-8"
          style={{ 
            backgroundColor: isActive ? 'rgba(212, 190, 114, 0.08)' : 'transparent',
            transition: 'background-color 300ms ease'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-secondary/5 via-transparent to-accent-primary/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 flex w-full items-center gap-6 lg:gap-8">
            <div
              className="flex min-w-0 flex-none items-center gap-6 lg:gap-8"
              style={{ width: 'clamp(200px, 44vw, 550px)' }}
            >
              <span className={`shrink-0 font-body text-[11px] uppercase tracking-[0.28em] transition-colors duration-300 ${
                isActive ? 'text-text-primary/80' : 'text-text-muted/40'
              }`}>
                Stack
              </span>
              <h4 className={`flex-none font-display text-[clamp(0.95rem,1.8vw,1.35rem)] font-light leading-none transition-colors duration-300 ${
                isActive ? 'text-text-primary font-medium' : 'text-text-secondary'
              }`}>
                {title}
              </h4>
            </div>
            <div className="min-w-[4rem] flex-1" />
            <div className="shrink-0 relative w-6 h-6 rounded-full border border-neutral/15 group-hover:border-accent-primary/45 flex items-center justify-center transition-colors duration-300">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`}
              >
                <path
                  d="M5 1V9M1 5H9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-neutral/60 group-hover:text-accent-primary transition-colors"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Marquee Overlay */}
        <div
          ref={marqueeRef}
          className="pointer-events-none absolute inset-0 z-20 translate-y-[101%] overflow-hidden bg-[#F5F0DE]"
        >
          <div ref={marqueeInnerRef} className="flex h-full w-fit">
            {Array.from({ length: repetitions }).map((_, idx) => (
              <div
                key={idx}
                className="marquee-part flex flex-shrink-0 items-center text-[#0E211A]"
              >
                <span className="px-4 font-display text-[clamp(1.15rem,1.9vw,1.6rem)] font-light uppercase leading-none">
                  {technologies.join('  /  ')}
                </span>
                <div
                  className="mx-5 h-[36px] w-[110px] rounded-full border border-[#0E211A]/10 bg-cover bg-center shadow-[0_8px_22px_rgba(14,33,26,0.16)]"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div
          ref={detailInnerRef}
          className={`grid min-h-0 grid-cols-1 gap-5 px-5 opacity-0 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] ${isActive ? 'border-t border-border-light bg-surface/20 py-4.5 shadow-[0_20px_50px_var(--shadow-medium)]' : ''}`}
        >
          <div className="flex flex-col gap-4">
            <p className="font-body text-sm leading-relaxed text-text-secondary/90">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-body text-[11px] uppercase tracking-[0.28em] text-accent-secondary">
                Technologies
              </span>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border-light bg-glass-bg px-3.5 py-1.5 font-mono text-[11px] text-text-secondary hover:text-text-primary hover:border-accent-primary/40 hover:bg-white/5 transition-all duration-300 shadow-sm cursor-target"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-body text-[11px] uppercase tracking-[0.28em] text-accent-secondary">
                Philosophy
              </span>
              <p className="font-body text-[13px] leading-relaxed text-text-secondary/80">
                {philosophy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EngineeringStack: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full px-6 md:px-8 lg:px-12" id="skills">
      <div className="mx-auto max-w-[1400px] w-full py-12 md:py-16 lg:py-20 flex flex-col gap-2.5">
        <span className="text-xs uppercase tracking-[0.25em] text-accent-secondary font-semibold font-body animate-fade-rise">
          04 / ENGINEERING STACK
        </span>
        <h3 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] text-text-primary font-light leading-tight animate-fade-rise-delay">
          Tools, Systems &amp; Craftsmanship
        </h3>
      </div>

      <div className="mx-auto max-w-[1400px] w-full overflow-hidden">
        <div className="flex flex-col">
            {stackItems.map((item, index) => (
              <StackRow
                key={item.title}
                {...item}
                isFirst={index === 0}
                isActive={activeIndex === index}
                onToggle={() => setActiveIndex((current) => (current === index ? null : index))}
              />
            ))}
          </div>
        </div>

      <div className="mx-auto max-w-[1400px] w-full border-t border-border-light pt-8 mt-12">
        <a
          href="#certificates"
          className="cursor-target inline-flex items-center gap-2 font-body text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          Continue into certificates & industry experience
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default EngineeringStack;
